"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // for creating the server
const puppeteer_core_1 = __importDefault(require("puppeteer-core")); // for taking screenshots of the web page
const node_cron_1 = __importDefault(require("node-cron")); // for scheduling the task to run periodically
const mongoose_1 = __importDefault(require("mongoose")); // for connecting to MongoDB
const ticketModel_1 = require("./src/models/ticketModel"); // for accessing the ticket model
const ticketRoute_1 = require("./src/routes/ticketRoute"); // for defining the routes
// Create an instance of the express application
const app = (0, express_1.default)();
const port = 3000;
// Call the `connect` function to initiate the MongoDB connection
connect();
// Define the tickets to look for on the web page
const ticket_value = ["Pass 1 Jour - Vendredi", "Pass 1 Jour - Jeudi", "Pass 2 Jours - J+V"];
// Define the URL of the web page to take the screenshot of
const url = 'https://reelax-tickets.com/e/n/festival-beauregard-2023/achat';
// Define the function to take the screenshot of the web page
const get_data = () => __awaiter(void 0, void 0, void 0, function* () {
    // Launch the browser and create a new page
    const browser = yield puppeteer_core_1.default.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        args: [
            '--no-sandbox',
            '--disable-gpu',
        ]
    });
    const page = yield browser.newPage();
    // Go to the specified URL
    yield page.goto(url);
    // Wait for 2 seconds
    yield page.waitForTimeout(2000);
    // Define a function to evaluate an XPath expression and return its text content
    const evaluate = (value, prop) => __awaiter(void 0, void 0, void 0, function* () {
        const element = yield page.waitForXPath(value);
        const text = yield page.evaluate((el, prop) => el ? el[prop] : null, element, prop);
        return text;
    });
    // Get the text content of the element that displays the message "All tickets have been sold for the moment..."
    const sold_message = yield evaluate('//p[@_ngcontent-reelax-tickets-c162]', "textContent");
    // Get the number of ticket buttons on the page
    const number_ticket = yield evaluate("//div[@_ngcontent-reelax-tickets-c161]", "childElementCount");
    // Get the list of all tickets stored in the database
    const all_tickets = yield ticketModel_1.TicketModel.find({}).sort({ createdAt: -1 }).select('ticket');
    const all_ticket_values = all_tickets.map(obj => String(obj.ticket));
    // Define a string to represent the case when no ticket is available
    const no_ticket = "No Ticket";
    // If all tickets have been sold, delete all the tickets from the database and store the "No Ticket" string
    if (sold_message === " All tickets have been sold for the moment... ") {
        console.log(no_ticket);
        for (let ticket_data of all_ticket_values) {
            if (ticket_data !== no_ticket) {
                yield ticketModel_1.TicketModel.deleteOne({ ticket: ticket_data });
            }
        }
        if (!all_ticket_values.includes(no_ticket)) {
            yield ticketModel_1.TicketModel.create({ ticket: no_ticket });
        }
        // If tickets are available, get the list of ticket names and update the database accordingly
    }
    else {
        // Declare an empty array to store ticket information
        const list_of_tickets = [];
        // Loop through the ticket buttons and extract the ticket information
        for (let i = 1; i < number_ticket + 1; i++) {
            const value = `//button[@_ngcontent-reelax-tickets-c161][${i}]/span[@class='mat-button-wrapper']/div/span[2]/text()`;
            const text = yield evaluate(value, "textContent");
            const ticket_sold = text.trim();
            // Add the extracted ticket information to the list_of_ticket array
            list_of_tickets.push(ticket_sold);
        }
        // Loop through the existing tickets in the database
        for (let ticket_data of ticket_value) {
            // If the ticket is still available, create a new entry in the database
            if (list_of_tickets.includes(ticket_data) && !all_ticket_values.includes(ticket_data)) {
                console.log(ticket_data);
                yield ticketModel_1.TicketModel.create({ ticket: ticket_data });
                // If the ticket is no longer available, delete the entry from the database
            }
            else if (!list_of_tickets.includes(ticket_data)) {
                yield ticketModel_1.TicketModel.deleteOne({ ticket: ticket_data });
            }
        }
        // If the 'no ticket' option is not already in the database, add it
        if (!ticket_value.some(item => list_of_tickets.includes(item))) {
            console.log(no_ticket);
            if (!all_ticket_values.includes(no_ticket)) {
                yield ticketModel_1.TicketModel.create({ ticket: no_ticket });
            }
        }
    }
    // Close the browser instance
    yield browser.close();
});
// Get data of the page
get_data();
// Schedule the get_data function to run every 10 minutes
node_cron_1.default.schedule("0 */10 * * * *", function () {
    get_data();
});
// Mount the routes on the app instance
(0, ticketRoute_1.routes)(app);
// Connect to the MongoDB database
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB using the connection string in `MONGO`
            yield mongoose_1.default.connect('mongodb+srv://awell:jumbo1207@cluster0.a3rikve.mongodb.net/?retryWrites=true&w=majority');
            console.log("connect to mongodb");
        }
        catch (error) {
            // Log the error if the connection fails
            console.log(error);
        }
    });
}
// Start the app on the specified port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=app.js.map