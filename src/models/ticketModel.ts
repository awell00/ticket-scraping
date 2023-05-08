// This code defines a Mongoose schema and model for a Ticket object
import { Schema, model, Document, Model } from "mongoose"

// Define the Ticket interface
interface Ticket extends Document {
  ticket: string
}

// Define the ticket schema
const ticket = new Schema({
  ticket: String
})

// Define the TicketModel as a Mongoose model for the Ticket schema
export const TicketModel: Model<Ticket> = model<Ticket>('modelTicket', ticket)
