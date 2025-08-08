import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Room from '../models/Room.js';
import GalleryImage from '../models/GalleryImage.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar datos existentes
    await Room.deleteMany({});
    await GalleryImage.deleteMany({});
    await User.deleteMany({});

    console.log('Datos existentes eliminados');

    // Crear usuario administrador
    const adminUser = await User.create({
      fullName: 'Administrador Hotel',
      email: 'admin@hotelelegance.com',
      password: 'admin123456',
      phone: '+1234567890',
      role: 'admin'
    });

    console.log('Usuario administrador creado');

    // Crear habitaciones
    const rooms = [
      {
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
        images: [
          {
            url: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
            alt: 'Habitación Individual Deluxe'
          }
        ],
        maxGuests: 1,
        roomNumber: '101'
      },
      {
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
        images: [
          {
            url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
            alt: 'Habitación Doble Premium'
          }
        ],
        maxGuests: 2,
        roomNumber: '201'
      },
      {
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
        images: [
          {
            url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg',
            alt: 'Suite Familiar'
          }
        ],
        maxGuests: 6,
        roomNumber: '301'
      }
    ];

    await Room.insertMany(rooms);
    console.log('Habitaciones creadas');

    // Crear imágenes de galería
    const galleryImages = [
      {
        src: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
        alt: 'Lobby elegante del hotel con decoración moderna',
        category: 'Instalaciones'
      },
      {
        src: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
        alt: 'Restaurante principal con ambiente acogedor',
        category: 'Gastronomía'
      },
      {
        src: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
        alt: 'Piscina al aire libre con área de relajación',
        category: 'Instalaciones'
      },
      {
        src: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
        alt: 'Habitación premium con vista panorámica',
        category: 'Habitaciones'
      },
      {
        src: 'https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg',
        alt: 'Spa y centro de bienestar',
        category: 'Instalaciones'
      },
      {
        src: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
        alt: 'Vista exterior del hotel al atardecer',
        category: 'Exterior'
      },
      {
        src: 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg',
        alt: 'Bar y lounge con ambiente nocturno',
        category: 'Gastronomía'
      },
      {
        src: 'https://images.pexels.com/photos/1579739/pexels-photo-1579739.jpeg',
        alt: 'Salón de eventos para celebraciones',
        category: 'Eventos'
      }
    ];

    await GalleryImage.insertMany(galleryImages);
    console.log('Imágenes de galería creadas');

    console.log('✅ Datos de prueba creados exitosamente');
    console.log('📧 Admin: admin@hotelelegance.com');
    console.log('🔑 Password: admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creando datos de prueba:', error);
    process.exit(1);
  }
};

seedData();