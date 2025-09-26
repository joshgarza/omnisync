import express, { Request, Response } from 'express';
import 'dotenv/config'; // For local testing outside of Docker

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

app.use(express.json());

// Placeholder Root Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Omnisync Backend is running.');
});

// Placeholder API Route to test communication
app.get('/api/cards', (req: Request, res: Response) => {
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