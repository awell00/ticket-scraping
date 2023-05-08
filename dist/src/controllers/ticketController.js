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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicket = void 0;
const ticketModel_1 = require("../models/ticketModel");
// Define the getTicket handler function
const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve all tickets from the database and sort them by creation date
    const ticket = yield ticketModel_1.TicketModel.find({}).sort({ createdAt: -1 }).select('ticket');
    // Map the ticket objects to an array of ticket values as strings
    const ticket_all_value = ticket.map(obj => String(obj.ticket));
    // Send the array of ticket values back to the client as a JSON response
    res.status(200).json(ticket_all_value);
});
exports.getTicket = getTicket;
//# sourceMappingURL=ticketController.js.map