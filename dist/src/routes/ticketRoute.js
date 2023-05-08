"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const ticketController_1 = require("../controllers/ticketController");
// Function to create routes for our app
function routes(app) {
    app.get('/', ticketController_1.getTicket);
}
exports.routes = routes;
//# sourceMappingURL=ticketRoute.js.map