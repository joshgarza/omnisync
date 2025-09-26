"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config"); // For local testing outside of Docker
const app = (0, express_1.default)();
const PORT = process.env.BACKEND_PORT || 8080;
app.use(express_1.default.json());
// Placeholder Root Route
app.get('/', (req, res) => {
    res.status(200).send('Omnisync Backend is running.');
});
// Placeholder API Route to test communication
app.get('/api/cards', (req, res) => {
    // In a real implementation, this would query the DB
    const placeholderCards = [
        { id: 1, click_count: 0, first_click_timestamp: null },
        { id: 2, click_count: 0, first_click_timestamp: null }
    ];
    res.status(200).json(placeholderCards);
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Database URL: ${process.env.DATABASE_URL}`);
});
