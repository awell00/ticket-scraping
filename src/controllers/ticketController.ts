// This code defines a handler function that retrieves all tickets from the database and returns their values as an array of strings
import { Request, Response } from "express"
import { TicketModel } from "../models/ticketModel"

// Define the getTicket handler function
const getTicket = async (req: Request, res: Response) => {
  // Retrieve all tickets from the database and sort them by creation date
  const ticket = await TicketModel.find({}).sort({createdAt: -1}).select('ticket')
  
  // Map the ticket objects to an array of ticket values as strings
  const ticket_all_value = ticket.map(obj => String(obj.ticket));
  
  // Send the array of ticket values back to the client as a JSON response
  res.status(200).json(ticket_all_value)
}

// Export the getTicket function for use in other modules
export { getTicket }
