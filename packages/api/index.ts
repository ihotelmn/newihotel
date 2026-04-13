export { USE_MOCK, MOCK_DELAY_MS, API_BASE_URL } from './config';
export { generateHotels, generateLeads, generateGuests } from './mock';

import { USE_MOCK, MOCK_DELAY_MS } from './config';
import { generateHotels } from './mock';
import type { Hotel, Review } from '@ihotel/types';

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

export async function fetchHotelById(id: string): Promise<Hotel | null> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    return hotelsCache.find((h) => h.id === id) ?? null;
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

export async function fetchReviewsByHotel(hotelId: string): Promise<Review[]> {
  if (USE_MOCK) {
    await delay(MOCK_DELAY_MS);
    const names = ['Бат-Эрдэнэ', 'Сараа', 'Болормаа', 'Ганбат', 'Оюунаа'];
    const bodies = [
      'Маш цэвэрхэн, ажилчид найрсаг. Дахин ирнэ.',
      'Байршил гайхалтай, өрөө том.',
      'Өглөөний цай маш сайн, харагдац гоё.',
      'Үнэ зохимжтой, Wi-Fi жаахан удаан.',
      'Гэр бүлээрээ маш сайхан амарлаа.',
    ];
    return names.map((name, i) => ({
      id: `review-${hotelId}-${i}`,
      hotel_id: hotelId,
      guest_id: `guest-${i}`,
      booking_id: `booking-${i}`,
      rating: 4 + Math.round(Math.random()),
      title: name,
      body: bodies[i]!,
      created_at: new Date(Date.now() - i * 7 * 86400000).toISOString(),
    }));
  }
  throw new Error('Real API not implemented yet');
}
