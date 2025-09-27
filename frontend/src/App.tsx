import React, { useState, useEffect, useCallback } from 'react';
import { type CardData } from './types'; // Import the new interface

// Placeholder for the full card component
const Card: React.FC<{ card: CardData; onClick: (id: number) => void }> = ({ card, onClick }) => {
  const timestampText = card.first_click_timestamp
    ? new Date(card.first_click_timestamp).toLocaleTimeString()
    : 'N/A';

  return (
    <div
      onClick={() => onClick(card.id)}
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        textAlign: 'center',
        margin: '10px',
        borderRadius: '8px',
        width: 'calc(25% - 20px)', // Simple 4-column grid (25%)
        minWidth: '150px',
        cursor: 'pointer',
      }}
    >
      <h2 style={{ margin: '0 0 10px 0' }}>Card {card.id}</h2>
      <p>
        Clicks: <strong>{card.click_count}</strong>
      </p>
      <p style={{ fontSize: '0.8em', color: '#555' }}>First Click: {timestampText}</p>
    </div>
  );
};

function App() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [status, setStatus] = useState('Loading cards...');

  // The API URL is injected via VITE_API_URL in docker-compose.yml
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCards = async () => {
    try {
      setStatus('Fetching data from backend...');

      // Fetch from the full API endpoint
      const response = await fetch(`${API_URL}/api/cards`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CardData[] = await response.json();

      setCards(data);
      setStatus('Data loaded successfully.');
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus(`Error: Failed to connect to backend at ${API_URL}. See console.`);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [API_URL]);

  const handleCardClick = useCallback(
    async (cardId: number) => {
      try {
        setStatus(`Registering click for Card ${cardId}...`);

        // POST request to the backend endpoint
        const response = await fetch(`${API_URL}/api/cards/${cardId}/click`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // NOTE: No body needed for this endpoint
        });

        if (!response.ok) {
          throw new Error(`Failed to register click. Status: ${response.status}`);
        }

        // Get the single updated card from the response body
        const updatedCard: CardData = await response.json();

        // *** Placeholder UI Update Logic ***
        setCards((prevCards) => {
          const newCards = prevCards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          );

          // NOTE: The sorting logic will be implemented here later.
          // For now, we're just updating the data in its current position.

          return newCards;
        });
        // **********************************

        setStatus(`Click registered for Card ${cardId}.`);
      } catch (error) {
        console.error(`Click failed for card ${cardId}:`, error);
        setStatus(`Error clicking Card ${cardId}.`);
      }
    },
    [API_URL]
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Omnisync Card Tracker</h1>
      <p style={{ color: cards.length > 0 ? 'green' : 'red' }}>Status: {status}</p>

      {cards.length === 0 && <p>Waiting for data or no cards found...</p>}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          maxWidth: '1000px', // Constrain max width for 2x4 look on large screens
          margin: '0 auto',
        }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
