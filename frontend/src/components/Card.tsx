import React from 'react';
import { type CardData } from '../types';

interface CardProps {
  card: CardData;
  onClick: (id: number) => void;
}

export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const timestampText = card.first_click_timestamp
    ? new Date(card.first_click_timestamp).toLocaleTimeString()
    : 'N/A';

  return (
    <div
      onClick={() => onClick(card.id)}
      style={{
        border: '2px solid #333',
        padding: '20px',
        textAlign: 'center',
        margin: '10px',
        borderRadius: '8px',
        width: 'calc(25% - 20px)',
        minWidth: '150px',
        cursor: 'pointer',
        backgroundColor: card.click_count > 0 ? '#f0f8ff' : '#fff',
        boxShadow: card.click_count > 0 ? '0 0 5px rgba(0, 0, 0, 0.2)' : 'none',
        transition: 'all 0.2s',
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
