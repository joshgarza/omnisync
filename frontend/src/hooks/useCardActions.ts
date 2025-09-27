import { useState, useEffect, useCallback, useMemo } from 'react';
import { type CardData, type SortMode } from '../types';
import { sortCards } from '../utils/sorting';

// Initial state reflects the default requirement (sort by time, even if all are null)
const DEFAULT_SORT_MODE: SortMode = 'TIME_ASC';

interface CardActions {
  cards: CardData[];
  status: string;
  sortBy: SortMode;
  setSortBy: React.Dispatch<React.SetStateAction<SortMode>>;
  handleCardClick: (cardId: number) => Promise<void>;
  handleReset: () => Promise<void>;
  sortedCardsForDisplay: CardData[];
}

export const useCardActions = (): CardActions => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [status, setStatus] = useState('Loading cards...');
  const [sortBy, setSortBy] = useState<SortMode>(DEFAULT_SORT_MODE);
  const API_URL = import.meta.env.VITE_API_URL;

  // --- Core Sorting Memo ---
  const sortedCardsForDisplay = useMemo(() => {
    return sortCards(cards, sortBy);
  }, [cards, sortBy]);

  // --- 1. Initial Data Fetch ---
  const fetchCards = useCallback(async () => {
    try {
      setStatus('Fetching data from backend...');
      const response = await fetch(`${API_URL}/api/cards`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CardData[] = await response.json();

      // Set raw data; the useMemo hook handles the initial sorting (TIME_ASC)
      setCards(data);
      setStatus('Data loaded successfully.');
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus(`Error: Failed to connect to backend at ${API_URL}. See console.`);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // --- 2. Click Handler (POST /click) ---
  const handleCardClick = useCallback(
    async (cardId: number) => {
      try {
        setStatus(`Registering click for Card ${cardId}...`);

        const response = await fetch(`${API_URL}/api/cards/${cardId}/click`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Failed to register click. Status: ${response.status}`);
        }

        const updatedCard: CardData = await response.json();

        setCards((prevCards) => {
          const updatedList = prevCards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          );

          // Re-sort the list based on the current mode immediately after update
          return sortCards(updatedList, sortBy);
        });

        setStatus(`Click registered for Card ${cardId}.`);
      } catch (error) {
        console.error(`Click failed for card ${cardId}:`, error);
        setStatus(`Error clicking Card ${cardId}.`);
      }
    },
    [API_URL, sortBy]
  );

  // --- 3. Reset Handler (POST /reset) ---
  const handleReset = useCallback(async () => {
    if (!window.confirm('Are you sure you want to reset all click data?')) {
      return;
    }

    try {
      setStatus('Sending reset command to database...');

      const response = await fetch(`${API_URL}/api/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to reset data. Status: ${response.status}`);
      }

      const resetCards: CardData[] = await response.json();

      // Overwrite card state with reset data
      setCards(resetCards);

      // Required: Reset sorting to original 1-8 order
      setSortBy('ORIGINAL');
      setStatus('All card data successfully reset.');
    } catch (error) {
      console.error('Reset failed:', error);
      setStatus(`Error: Failed to reset data.`);
    }
  }, [API_URL]);

  return {
    cards,
    status,
    sortBy,
    setSortBy,
    handleCardClick,
    handleReset,
    sortedCardsForDisplay,
  };
};
