// backend/src/routes.ts

import { Router, Request, Response } from 'express';
import { pool, CardData } from './db';

const router = Router();

// Helper to map and sanitize DB results to the CardData interface
const mapCardResult = (row: any): CardData => ({
    id: row.id,
    click_count: row.click_count,
    // Convert the PostgreSQL timestamp (which can be a Date object or string) to ISO string
    // or return null if it's not set in the DB.
    first_click_timestamp: row.first_click_timestamp 
        ? new Date(row.first_click_timestamp).toISOString() 
        : null,
});

/**
 * API Route 1: GET /api/cards (Read Data)
 * Purpose: Fetch the current state of all eight cards.
 * Order: By default, order by ID (1-8). Sorting logic will happen on the frontend.
 */
router.get('/cards', async (req: Request, res: Response) => {
    try {
        // Query the card_clicks table to get all data
        const result = await pool.query(`
            SELECT id, click_count, first_click_timestamp 
            FROM card_clicks 
            ORDER BY id ASC;
        `);
        
        // Map the raw database rows to the strongly-typed CardData array
        const cards: CardData[] = result.rows.map(mapCardResult);
        
        // Send the JSON response
        console.log('Fetched cards:', cards);
        res.status(200).json(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ message: 'Internal Server Error: Could not fetch card data.' });
    }
});

// Since we are only implementing GET /api/cards right now, 
// we won't include the POST /api/cards/:id/click or POST /api/reset endpoints yet.

export default router;