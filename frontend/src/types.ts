export interface CardData {
    id: number;
    click_count: number;
    // Timestamp is an ISO string or null if the card hasn't been clicked yet
    first_click_timestamp: string | null;
}