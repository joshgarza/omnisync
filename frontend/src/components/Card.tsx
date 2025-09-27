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

  const isClicked = card.click_count > 0;

  return (
    <div
      onClick={() => onClick(card.id)}
      // Outer Container Styles
      style={{
        position: 'relative',
        height: '180px', // Fixed height for clean 2x4 alignment
        width: 'calc(25% - 20px)',
        minWidth: '180px',
        flexGrow: 1,

        // Visual Styles
        border: `2px solid ${isClicked ? '#2563eb' : '#ddd'}`,
        borderRadius: '12px',
        margin: '10px',
        cursor: 'pointer',
        backgroundColor: isClicked ? '#eff6ff' : '#ffffff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        overflow: 'hidden', // Ensures positioned data stays within bounds
      }}
    >
      {/* 1. Card Number (Centered Focal Point) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontSize: '5rem',
          fontWeight: '800',
          color: isClicked ? '#2563eb' : '#333',
          opacity: 0.9,
        }}
      >
        {card.id}
      </div>

      {/* 2. Clicks (Bottom Left Edge) */}
      <p
        style={{
          position: 'absolute',
          bottom: '5px',
          left: '10px',
          margin: 0,
          fontSize: '0.8rem',
          fontWeight: 'bold',
          color: '#059669',
        }}
      >
        {card.click_count} Clicks
      </p>

      {/* 3. Timestamp (Bottom Right Edge) */}
      <p
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '10px',
          margin: 0,
          fontSize: '0.8rem',
          color: '#555',
          textAlign: 'right',
        }}
        title={timestampText !== 'N/A' ? `First clicked at ${timestampText}` : undefined}
      >
        {timestampText}
      </p>
    </div>
  );
};
