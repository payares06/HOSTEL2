import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Room, Reservation, GalleryImage } from '../types';
// import { authAPI, roomsAPI, reservationsAPI, galleryAPI } from '../lib/api';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[]) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Initialize with sample rooms data
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      type: 'individual',
      name: 'Habitación Individual Deluxe',
      price: 80,
      description: 'Cómoda habitación individual con todas las comodidades necesarias para un huésped. Perfecta para viajeros de negocios o turistas que buscan privacidad y confort.',
      features: [
        'Cama individual queen',
        'WiFi gratuito de alta velocidad',
        'TV HD 42 pulgadas',
        'Minibar completamente equipado',
        'Aire acondicionado',
        'Baño privado con ducha',
        'Escritorio de trabajo',
        'Caja fuerte',
        'Servicio de habitaciones 24/7'
      ],
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      maxGuests: 1,
      available: true,
      roomNumber: '101'
    },
    {
      id: '2',
      type: 'doble',
      name: 'Habitación Doble Premium',
      price: 120,
      description: 'Espaciosa habitación doble perfecta para parejas o viajeros de negocios. Combina elegancia y funcionalidad en un ambiente acogedor.',
      features: [
        'Cama doble king size',
        'WiFi gratuito de alta velocidad',
        'TV HD 50 pulgadas',
        'Minibar completamente equipado',
        'Aire acondicionado',
        'Baño privado con bañera',
        'Balcón con vista a la ciudad',
        'Área de estar',
        'Escritorio de trabajo',
        'Caja fuerte',
        'Servicio de habitaciones 24/7'
      ],
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      maxGuests: 2,
      available: true,
      roomNumber: '201'
    },
    {
      id: '3',
      type: 'familiar',
      name: 'Suite Familiar',
      price: 180,
      description: 'Amplia suite familiar con espacio para toda la familia y comodidades adicionales. Ideal para estancias prolongadas y familias numerosas.',
      features: [
        '2 camas dobles queen',
        'Sofá cama en sala de estar',
        'WiFi gratuito de alta velocidad',
        'TV HD 55 pulgadas',
        'Minibar completamente equipado',
        'Aire acondicionado',
        'Baño privado con bañera y ducha separada',
        'Sala de estar independiente',
        'Balcón amplio con vista panorámica',
        'Kitchenette básica',
        'Mesa de comedor',
        'Caja fuerte',
        'Servicio de habitaciones 24/7'
      ],
      image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
      maxGuests: 6,
      available: true,
      roomNumber: '301'
    }
  ]);
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Initialize with sample gallery images
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    {
      id: '1',
      src: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
      alt: 'Lobby elegante del hotel con decoración moderna',
      category: 'Instalaciones'
    },
    {
      id: '2',
      src: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
      alt: 'Restaurante principal con ambiente acogedor',
      category: 'Gastronomía'
    },
    {
      id: '3',
      src: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
      alt: 'Piscina al aire libre con área de relajación',
      category: 'Instalaciones'
    },
    {
      id: '4',
      src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      alt: 'Habitación premium con vista panorámica',
      category: 'Habitaciones'
    },
    {
      id: '5',
      src: 'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg',
      alt: 'Spa y centro de bienestar',
      category: 'Instalaciones'
    },
    {
      id: '6',
      src: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
      alt: 'Vista exterior del hotel al atardecer',
      category: 'Exterior'
    },
    {
      id: '7',
      src: 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg',
      alt: 'Bar y lounge con ambiente nocturno',
      category: 'Gastronomía'
    },
    {
      id: '8',
      src: 'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg',
      alt: 'Salón de eventos para celebraciones',
      category: 'Eventos'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (email === 'admin@hotelelegance.com' && password === 'admin123456') {
        const adminUser: User = {
          id: 'admin-1',
          fullName: 'Administrador Hotel',
          email: 'admin@hotelelegance.com',
          phone: '+1234567890',
          role: 'admin'
        };
        setCurrentUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
      } else {
        // For demo purposes, allow any other email/password combination as client
        const clientUser: User = {
          id: 'client-1',
          fullName: 'Cliente Demo',
          email: email,
          phone: '+1234567890',
          role: 'client'
        };
        setCurrentUser(clientUser);
        localStorage.setItem('user', JSON.stringify(clientUser));
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        role: 'client'
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setReservations([]);
  };

  const addReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReservation: Reservation = {
        id: Date.now().toString(),
        ...reservationData,
        createdAt: new Date().toISOString()
      };
      
      setReservations(prev => [...prev, newReservation]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReservations(prev => 
        prev.map(res => res.id === id ? { ...res, status } : res)
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      rooms,
      setRooms,
      reservations,
      setReservations,
      addReservation,
      updateReservationStatus,
      galleryImages,
      setGalleryImages,
      login,
      register,
      logout,
      loading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}