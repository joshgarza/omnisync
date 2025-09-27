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

router.post('/cards/:id/click', async (req: Request, res: Response) => {
  const cardId = parseInt(req.params.id, 10);

  // 1. Validate card ID
  if (isNaN(cardId) || cardId < 1 || cardId > 8) {
    return res.status(400).json({ message: 'Invalid card ID. Must be between 1 and 8.' });
  }

  try {
    // 2. Execute a single, atomic UPDATE query
    const updateResult = await pool.query(
      `
            UPDATE card_clicks
            SET 
                click_count = click_count + 1,
                -- COALESCE ensures the timestamp is only set if it's currently NULL
                first_click_timestamp = COALESCE(first_click_timestamp, NOW())
            WHERE id = $1
            RETURNING id, click_count, first_click_timestamp;
        `,
      [cardId]
    );

    // 3. Handle resource not found (if ID was valid but row was deleted)
    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    // 4. Map, Log, and Respond
    const updatedCard: CardData = mapCardResult(updateResult.rows[0]);
    console.log(`Card ${cardId} clicked. Updated data:`, updatedCard);
    res.status(200).json(updatedCard);
  } catch (error) {
    // 5. Handle any SQL/database errors
    console.error(`Error updating card ${cardId}:`, error);
    // No explicit ROLLBACK needed since no BEGIN was issued, the single query failed cleanly.
    res.status(500).json({ message: 'Internal Server Error: Could not update card data.' });
  }
});

/**
 * API Route: POST /api/reset (Clear Data)
 * Purpose: Resets all card click_count to 0 and first_click_timestamp to NULL.
 */
router.post('/reset', async (req: Request, res: Response) => {
  try {
    console.log('--- POST /api/reset: Reset command received ---');

    // SQL query to reset all rows atomically.
    const query = `
            WITH updated AS (
                UPDATE card_clicks
                SET click_count = 0,
                    first_click_timestamp = NULL
                RETURNING id, click_count, first_click_timestamp
            )
            SELECT * FROM updated
            ORDER BY id ASC;
        `;

    const result = await pool.query(query);

    // Map the 8 reset cards to the CardData format
    const resetCards: CardData[] = result.rows.map(mapCardResult);

    console.log(`Successfully reset ${resetCards.length} cards.`);

    // Return the full set of reset data for the frontend to update its state
    res.status(200).json(resetCards);
  } catch (error) {
    console.error('Error resetting cards:', error);
    res.status(500).json({ message: 'Internal Server Error: Could not reset card data.' });
  }
});

export default router;
