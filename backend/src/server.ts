import express, { Request, Response } from 'express';
import { connectToDatabase } from './db';
import 'dotenv/config'; // For local testing outside of Docker
import cors from 'cors';
import cardRoutes from './routes'; 

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use('/api', cardRoutes);

async function startServer() {
    try {
        await connectToDatabase();
        
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
            console.log(`Database URL: ${process.env.DATABASE_URL}`);
        });
    } catch (error) {
        // If connection fails, log and exit the process (Docker will try to restart)
        console.error('FATAL: Server startup failed due to database error.');
        process.exit(1); 
    }
}

startServer();