-- Ensure the table exists and is clean before seeding (optional, but good practice)
DROP TABLE IF EXISTS card_clicks;

-- Create the card_clicks table
CREATE TABLE card_clicks (
    id SERIAL PRIMARY KEY,
    click_count INTEGER NOT NULL DEFAULT 0,
    first_click_timestamp TIMESTAMP WITH TIME ZONE NULL
);

-- Seed the initial 8 cards (IDs 1 through 8)
INSERT INTO card_clicks (id, click_count, first_click_timestamp) VALUES
(1, 0, NULL),
(2, 0, NULL),
(3, 0, NULL),
(4, 0, NULL),
(5, 0, NULL),
(6, 0, NULL),
(7, 0, NULL),
(8, 0, NULL)
ON CONFLICT (id) DO NOTHING; -- Ensure idempotency on restarts