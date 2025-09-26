import React, { useState, useEffect } from 'react';
import { type CardData } from './types'; // Import the new interface

// Placeholder for the full card component
const Card: React.FC<{ card: CardData }> = ({ card }) => {
    const timestampText = card.first_click_timestamp
        ? new Date(card.first_click_timestamp).toLocaleTimeString()
        : 'N/A';

    return (
        <div 
            style={{ 
                border: '1px solid #ccc', 
                padding: '20px', 
                textAlign: 'center', 
                margin: '10px', 
                borderRadius: '8px',
                width: 'calc(25% - 20px)', // Simple 4-column grid (25%)
                minWidth: '150px' 
            }}
            // You'll add the onClick handler here later
        >
            <h2 style={{ margin: '0 0 10px 0' }}>Card {card.id}</h2>
            <p>Clicks: <strong>{card.click_count}</strong></p>
            <p style={{ fontSize: '0.8em', color: '#555' }}>First Click: {timestampText}</p>
        </div>
    );
};

function App() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [status, setStatus] = useState("Loading cards...");

    // The API URL is injected via VITE_API_URL in docker-compose.yml
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setStatus("Fetching data from backend...");
                
                // Fetch from the full API endpoint
                const response = await fetch(`${API_URL}/api/cards`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data: CardData[] = await response.json();
                
                setCards(data);
                setStatus("Data loaded successfully.");

            } catch (error) {
                console.error("Fetch error:", error);
                setStatus(`Error: Failed to connect to backend at ${API_URL}. See console.`);
            }
        };

        fetchCards();
    }, [API_URL]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Omnisync Card Tracker</h1>
            <p style={{ color: cards.length > 0 ? 'green' : 'red' }}>Status: {status}</p>
            
            {cards.length === 0 && <p>Waiting for data or no cards found...</p>}
            
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'flex-start',
                maxWidth: '1000px', // Constrain max width for 2x4 look on large screens
                margin: '0 auto' 
            }}>
                {cards.map(card => (
                    <Card key={card.id} card={card} />
                ))}
            </div>
        </div>
    );
}

export default App;