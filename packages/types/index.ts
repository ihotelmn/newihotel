export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  star_rating: number;
  avg_rating: number;
  review_count: number;
  price_min: number;
  price_max: number;
  amenities: string[];
  image_url: string;
  images: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  name: string;
  description: string;
  room_type: string;
  price_per_night: number;
  capacity: number;
  amenities: string[];
  image_url: string;
  images: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  hotel_id: string;
  full_name: string;
  email: string;
  phone: string;
  source: 'website' | 'social' | 'referral' | 'walk_in' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  id_type: 'passport' | 'national_id' | 'driver_license';
  id_number: string;
  visits_count: number;
  total_spent: number;
  vip_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  hotel_id: string;
  room_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  special_requests: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  hotel_id: string;
  guest_id: string;
  booking_id: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
}

export interface Message {
  id: string;
  hotel_id: string;
  guest_id: string;
  sender_type: 'guest' | 'hotel';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Campaign {
  id: string;
  hotel_id: string;
  name: string;
  channel: 'email' | 'sms' | 'push' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  target_audience: string;
  message_template: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  scheduled_at: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'owner' | 'manager' | 'receptionist' | 'staff';
  hotel_id: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
