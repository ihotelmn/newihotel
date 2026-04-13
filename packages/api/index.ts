export { USE_MOCK, MOCK_DELAY_MS, API_BASE_URL } from './config';
export { generateHotels, generateLeads, generateGuests } from './mock';

import { USE_MOCK, MOCK_DELAY_MS } from './config';
import { generateHotels } from './mock';
import type { Hotel } from '@ihotel/types';

const hotelsCache = generateHotels(100);

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchHotels(): Promise<Hotel[]> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return hotelsCache;
  }
  throw new Error('Real API not implemented yet');
}

export async function searchHotels(query: string): Promise<Hotel[]> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const q = query.toLowerCase();
    return hotelsCache.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q)
    );
  }
  throw new Error('Real API not implemented yet');
}
