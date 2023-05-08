import { Express } from "express";
import { getTicket } from "../controllers/ticketController";

// Function to create routes for our app
function routes(app: Express) {
    app.get('/', getTicket)
}

export { routes }