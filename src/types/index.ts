export interface Room {
  id: string;
  _id?: string;
  type: 'individual' | 'doble' | 'familiar';
  name: string;
  price: number;
  description: string;
  features: string[];
  image?: string;
  images?: Array<{ url: string; alt: string }>;
  maxGuests: number;
  available: boolean;
  roomNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reservation {
  id: string;
  _id?: string;
  roomId: string;
  roomName: string;
  guestName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights?: number;
  pricePerNight?: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt?: string;
  user?: {
    fullName: string;
    email: string;
    phone: string;
  };
  room?: {
    name: string;
    type: string;
    images?: Array<{ url: string; alt: string }>;
  };
}

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface GalleryImage {
  id: string;
  _id?: string;
  src: string;
  alt: string;
  category: string;
  isActive?: boolean;
  createdAt?: string;
}