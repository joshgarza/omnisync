import React from 'react';
import { type SortMode } from '../types';

interface ControlsBarProps {
  sortBy: SortMode;
  onSortChange: (mode: SortMode) => void;
  onReset: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ sortBy, onSortChange, onReset }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        gap: '20px',
      }}
    >
      <label>
        Sort By:
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortMode)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="TIME_ASC">First Clicked → Last Clicked (Default)</option>
          <option value="ORIGINAL">Original Order (1 → 8)</option>
          <option value="CLICKS_DESC">Most Clicks → Fewest Clicks</option>
        </select>
      </label>

      <button
        onClick={onReset}
        style={{
          padding: '8px 15px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Clear All Clicks
      </button>
    </div>
  );
};
