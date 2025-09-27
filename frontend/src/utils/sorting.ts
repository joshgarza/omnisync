import { type CardData, type SortMode } from '../types';

/**
 * Sorts the card data based on the specified mode.
 * @param currentCards The array of cards to sort.
 * @param mode The sorting mode ('ORIGINAL', 'CLICKS_DESC', 'TIME_ASC').
 * @returns A new sorted array of cards.
 */
export const sortCards = (currentCards: CardData[], mode: SortMode): CardData[] => {
  // Always work on a copy to maintain immutability
  const sorted = [...currentCards];

  if (mode === 'ORIGINAL') {
    // Sort by ID ascending
    return sorted.sort((a, b) => a.id - b.id);
  }

  if (mode === 'CLICKS_DESC') {
    // Sort by click_count descending (Most clicks first)
    return sorted.sort((a, b) => b.click_count - a.click_count);
  }

  if (mode === 'TIME_ASC') {
    // Sort by first_click_timestamp ascending (First clicked first)
    return sorted.sort((a, b) => {
      const timeA = a.first_click_timestamp
        ? new Date(a.first_click_timestamp).getTime()
        : Infinity;
      const timeB = b.first_click_timestamp
        ? new Date(b.first_click_timestamp).getTime()
        : Infinity;

      // Unclicked cards (Infinity) are pushed to the end.
      return timeA - timeB;
    });
  }

  return sorted; // Fallback
};
