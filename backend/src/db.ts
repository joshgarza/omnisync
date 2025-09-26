import { Pool, QueryResult } from 'pg';
import 'dotenv/config';

// Define the shape of the data returned from the database
export interface CardData {
    id: number;
    click_count: number;
    first_click_timestamp: string | null; // PostgreSQL timestamp is returned as a string or null
}

// Get the connection string from environment variables
// Use the DATABASE_URL defined in docker-compose.yml
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
}

// Create a new PostgreSQL connection pool
const pool = new Pool({
    connectionString: connectionString,
});

// A simple function to test the connection (optional but recommended)
export async function connectToDatabase(): Promise<void> {
    try {
        await pool.query('SELECT 1');
        console.log('Successfully connected to PostgreSQL.');
    } catch (error) {
        console.error('Failed to connect to PostgreSQL:', error);
        // Re-throw the error to prevent the server from starting if the DB is unreachable
        throw error;
    }
}

// Export the pool to be used for executing queries in the API routes
export { pool };