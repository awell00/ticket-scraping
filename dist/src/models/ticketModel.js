"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = void 0;
// This code defines a Mongoose schema and model for a Ticket object
const mongoose_1 = require("mongoose");
// Define the ticket schema
const ticket = new mongoose_1.Schema({
    ticket: String
});
// Define the TicketModel as a Mongoose model for the Ticket schema
exports.TicketModel = (0, mongoose_1.model)('modelTicket', ticket);
//# sourceMappingURL=ticketModel.js.map