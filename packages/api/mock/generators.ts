import type { Hotel, Lead, Guest } from '@ihotel/types';

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const HOTEL_NAMES: string[] = [
  'Хангай Ресорт', 'Эрдэнэ Зуу Буудал', 'Номин Хаус', 'Чингис Хаан Отель',
  'Монголиан Стэпп Лодж', 'Хөх Монгол Инн', 'Тэрэлж Ривер Лодж', 'Алтай Маунтин Ресорт',
  'Говь Оазис Отель', 'Хүрээ Палас', 'Бурхан Халдун Лодж', 'Сэлэнгэ Ривер Инн',
  'Дархан Сити Отель', 'Өндөрхаан Плаза', 'Хархорин Хэритиж', 'Завхан Вэлли Лодж',
  'Орхон Фоллс Ресорт', 'Хөвсгөл Лэйк Лодж', 'Баянзүрх Бутик', 'Цэцэрлэг Инн',
  'Сүхбаатар Гранд', 'Булган Грийн Отель', 'Дорнод Стэпп Лодж', 'Өмнөговь Дезерт Кэмп',
  'Увс Лэйк Ресорт', 'Ховд Ривер Инн', 'Баян-Өлгий Иглу Лодж', 'Архангай Спрингс',
  'Түвхэн Монастери Лодж', 'Хустай Нуруу Кэмп', 'Горхи-Тэрэлж Глампинг',
  'Их Нарт Дезерт Кэмп', 'Хонгор Элс Ресорт', 'Ёлын Ам Вэлли Лодж',
  'Гурван Сайхан Инн', 'Угалзат Ривер Кэмп', 'Цагаан Суврага Лодж',
  'Молцог Элс Кэмп', 'Хүйтэн Оргил Маунтин Лодж', 'Алтай Таван Богд Кэмп',
  'Цэнхэр Хот Спрингс', 'Амарбаясгалант Пийс Лодж', 'Дадал Бирсплэйс Инн',
  'Онон Ривер Лодж', 'Балдан Бэрээвэн Лодж', 'Их Газрын Чулуу Кэмп',
  'Бага Газрын Чулуу Инн', 'Баянхонгор Отель', 'Мандалговь Стэй',
  'Сайншанд Энержи Лодж', 'Замын-Үүд Бордер Инн', 'Чойбалсан Сити Отель',
  'Эрдэнэт Майнинг Таун Отель', 'Мөрөн Лэйкфронт', 'Хатгал Гэйтвэй Инн',
  'Төгрөг Валлей Лодж', 'Дэлгэрхангай Номад Стэй', 'Богд Хан Маунтин Вью',
  'Зайсан Хилл Бутик', 'Гандан Пийс Хаус', 'Чойжин Лама Хэритиж',
  'Нарантуул Маркет Инн', 'Скай Ресорт Буудал', 'Туул Ривер Лодж',
  'Хэнтий Маунтин Ресорт', 'Сэлбэ Ривер Бутик', 'Жаргалант Отель',
  'Баатархайрхан Лодж', 'Хар Ус Нуур Кэмп', 'Хяргас Нуур Лодж',
  'Даян Нуур Фишинг Лодж', 'Толбо Нуур Кэмп', 'Ачит Нуур Инн',
  'Тэлмэн Нуур Лодж', 'Сангийн Далай Нуур Стэй', 'Өгий Нуур Ресорт',
  'Тэрхийн Цагаан Нуур Лодж', 'Хорго Волкано Кэмп', 'Чулуут Ривер Лодж',
  'Идэр Ривер Инн', 'Дэлгэр Ривер Кэмп', 'Тамир Ривер Лодж',
  'Туул Голын Эрэг Ресорт', 'Хэрлэн Ривер Инн', 'Онги Ривер Кэмп',
  'Баянголын Нуруу Лодж', 'Биндэрья Отель', 'Номрог Натүр Лодж',
  'Нумруг Ривер Кэмп', 'Дорнод Монголын Талын Стэй', 'Буйр Нуур Лейксайд',
  'Хөх Нуур Блү Лэйк Лодж', 'Монгол Шуудан Посталь Инн',
  'Гэр Кэмп Традишнл Стэй', 'Мөнх Тэнгэр Скай Лодж',
  'Цас Уул Сноу Маунтин', 'Нүүдэлчин Номад Бутик',
  'Улаанбаатар Марриотт', 'Рамада Улаанбаатар', 'Блү Скай Тауэр',
  'Бэст Вэстерн Тушин', 'Шангри-Ла Улаанбаатар', 'Кемпински Хан Палас',
  'Флауэр Отель', 'Их Монгол Отель', 'Пүмэ Отель',
  'Платинум Отель', 'Корпорэйт Отель', 'Убиланс Отель',
];

const CITIES: string[] = [
  'Улаанбаатар', 'Дархан', 'Эрдэнэт', 'Мөрөн', 'Өлгий',
  'Ховд', 'Чойбалсан', 'Өндөрхаан', 'Баянхонгор', 'Далацзадгад',
  'Цэцэрлэг', 'Арвайхээр', 'Зуунмод', 'Сүхбаатар', 'Булган',
];

const AMENITIES: string[] = [
  'wifi', 'parking', 'restaurant', 'spa', 'pool', 'gym',
  'bar', 'room_service', 'laundry', 'airport_shuttle',
  'business_center', 'pet_friendly', 'ev_charging', 'sauna',
];

export function generateHotels(count: number = 100): Hotel[] {
  return Array.from({ length: count }, (_, i): Hotel => {
    const reviewCount = i === 0 ? 0 : i === 1 ? 500 : randomInt(0, 300);
    const name = i < HOTEL_NAMES.length
      ? HOTEL_NAMES[i]!
      : `${randomFrom(HOTEL_NAMES)} ${i}`;

    return {
      id: uuid(),
      name,
      description: `${name} — Монголын шилдэг зочид буудлуудын нэг. Тав тухтай, найрсаг үйлчилгээ.`,
      address: `${randomFrom(['Энхтайвны', 'Бага тойруу', 'Их тойруу', 'Чингисийн', 'Жуулчны'])} гудамж ${randomInt(1, 200)}`,
      city: randomFrom(CITIES),
      latitude: 46.0 + Math.random() * 4,
      longitude: 100.0 + Math.random() * 16,
      star_rating: randomInt(2, 5),
      avg_rating: reviewCount === 0 ? 0 : Math.round((3 + Math.random() * 2) * 10) / 10,
      review_count: reviewCount,
      price_min: randomInt(30, 100) * 1000,
      price_max: randomInt(100, 500) * 1000,
      amenities: AMENITIES.filter(() => Math.random() > 0.5),
      image_url: `https://picsum.photos/seed/hotel${i}/800/600`,
      images: Array.from({ length: randomInt(3, 8) }, (__, j) =>
        `https://picsum.photos/seed/hotel${i}_${j}/800/600`
      ),
      is_featured: i < 10,
      created_at: new Date(Date.now() - randomInt(0, 365 * 2) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

const LEAD_NAMES: string[] = [
  'Батболд Ганбаатар', 'Оюунчимэг Дорж', 'Энхбаяр Бат-Эрдэнэ',
  'Сарангэрэл Нямдорж', 'Түвшинбаяр Мөнхбаатар', 'Болормаа Цэдэнбал',
  'Ганбат Сүрэнхорлоо', 'Алтанцэцэг Баянмөнх',
];

const SOURCES: Lead['source'][] = ['website', 'social', 'referral', 'walk_in', 'other'];
const LEAD_STATUSES: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'lost'];

export function generateLeads(count: number = 50): Lead[] {
  return Array.from({ length: count }, (): Lead => {
    const name = randomFrom(LEAD_NAMES);
    return {
      id: uuid(),
      hotel_id: uuid(),
      full_name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@mail.mn`,
      phone: `+976 ${randomInt(80, 99)}${randomInt(100000, 999999)}`,
      source: randomFrom(SOURCES),
      status: randomFrom(LEAD_STATUSES),
      notes: '',
      created_at: new Date(Date.now() - randomInt(0, 90) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}

const NATIONALITIES: string[] = [
  'Монгол', 'Хятад', 'Орос', 'Солонгос', 'Япон',
  'Америк', 'Герман', 'Франц', 'Англи', 'Австрали',
];

export function generateGuests(count: number = 50): Guest[] {
  return Array.from({ length: count }, (_, i): Guest => {
    const name = i === 0
      ? 'Энхтүвшинзаяабаатаргалмөнхсайханцэцэгмаагийн Батмөнхийн Ариунболд'
      : randomFrom(LEAD_NAMES);

    return {
      id: uuid(),
      full_name: name,
      email: `guest${i}@mail.mn`,
      phone: `+976 ${randomInt(80, 99)}${randomInt(100000, 999999)}`,
      nationality: randomFrom(NATIONALITIES),
      id_type: randomFrom(['passport', 'national_id', 'driver_license'] as const),
      id_number: `${String.fromCharCode(65 + randomInt(0, 25))}${randomInt(10000000, 99999999)}`,
      visits_count: randomInt(0, 50),
      total_spent: randomInt(0, 50000) * 1000,
      vip_status: Math.random() > 0.85,
      created_at: new Date(Date.now() - randomInt(0, 730) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
  });
}
