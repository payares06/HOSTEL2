const API_BASE_URL = 'http://localhost:5000/api';

// Configuración base para fetch
const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función para obtener el token del localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Función para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      ...apiConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(error.message || 'Error en la petición');
  }

  return response.json();
};

// API de autenticación
export const authAPI = {
  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      ...apiConfig,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }

    const data = await response.json();
    
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      ...apiConfig,
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el login');
    }

    const data = await response.json();
    
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getProfile: () => authenticatedFetch('/auth/profile'),

  updateProfile: (profileData: { fullName: string; phone: string }) =>
    authenticatedFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// API de habitaciones
export const roomsAPI = {
  getAll: (filters?: { type?: string; available?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.available !== undefined) params.append('available', filters.available.toString());
    
    const queryString = params.toString();
    return fetch(`${API_BASE_URL}/rooms${queryString ? `?${queryString}` : ''}`)
      .then(res => res.json());
  },

  getById: (id: string) =>
    fetch(`${API_BASE_URL}/rooms/${id}`).then(res => res.json()),

  checkAvailability: (roomId: string, checkIn: string, checkOut: string) => {
    const params = new URLSearchParams({
      roomId,
      checkIn,
      checkOut,
    });
    
    return fetch(`${API_BASE_URL}/rooms/availability?${params}`)
      .then(res => res.json());
  },

  // Solo para administradores
  create: (roomData: any) =>
    authenticatedFetch('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    }),

  update: (id: string, roomData: any) =>
    authenticatedFetch(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    }),

  delete: (id: string) =>
    authenticatedFetch(`/rooms/${id}`, {
      method: 'DELETE',
    }),
};

// API de reservas
export const reservationsAPI = {
  create: (reservationData: {
    roomId: string;
    guestName: string;
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
  }) =>
    authenticatedFetch('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    }),

  getUserReservations: () => authenticatedFetch('/reservations/my-reservations'),

  getById: (id: string) => authenticatedFetch(`/reservations/${id}`),

  cancel: (id: string) =>
    authenticatedFetch(`/reservations/${id}/cancel`, {
      method: 'PUT',
    }),

  // Solo para administradores
  getAll: (filters?: { status?: string; page?: number; limit?: number }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    return authenticatedFetch(`/reservations${queryString ? `?${queryString}` : ''}`);
  },

  updateStatus: (id: string, status: string) =>
    authenticatedFetch(`/reservations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getStats: () => authenticatedFetch('/reservations/admin/stats'),
};

// API de galería
export const galleryAPI = {
  getAll: (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    
    const queryString = params.toString();
    return fetch(`${API_BASE_URL}/gallery${queryString ? `?${queryString}` : ''}`)
      .then(res => res.json());
  },

  getCategories: () =>
    fetch(`${API_BASE_URL}/gallery/categories`).then(res => res.json()),

  // Solo para administradores
  create: (imageData: { src: string; alt: string; category: string }) =>
    authenticatedFetch('/gallery', {
      method: 'POST',
      body: JSON.stringify(imageData),
    }),

  update: (id: string, imageData: any) =>
    authenticatedFetch(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    }),

  delete: (id: string) =>
    authenticatedFetch(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};

// Función para verificar si hay conexión con el backend
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Error conectando con el backend:', error);
    return false;
  }
};