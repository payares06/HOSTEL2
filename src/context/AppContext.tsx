import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Room, Reservation, GalleryImage } from '../types';
import { authAPI, roomsAPI, reservationsAPI, galleryAPI } from '../lib/api';

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      setCurrentUser(response.user);
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
      const response = await authAPI.register(userData);
      setCurrentUser(response.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setReservations([]);
  };

  const addReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationsAPI.create({
        roomId: reservationData.roomId,
        guestName: reservationData.guestName,
        email: reservationData.email,
        phone: reservationData.phone,
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        guests: reservationData.guests
      });
      
      // Actualizar la lista de reservas
      if (currentUser) {
        const userReservations = await reservationsAPI.getUserReservations();
        setReservations(userReservations.data);
      }
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
      await reservationsAPI.updateStatus(id, status);
      
      // Actualizar la lista de reservas
      if (currentUser?.role === 'admin') {
        const allReservations = await reservationsAPI.getAll();
        setReservations(allReservations.data);
      } else {
        const userReservations = await reservationsAPI.getUserReservations();
        setReservations(userReservations.data);
      }
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