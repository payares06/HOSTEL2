import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: [true, 'La URL de la imagen es requerida']
  },
  alt: {
    type: String,
    required: [true, 'El texto alternativo es requerido'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['Habitaciones', 'Instalaciones', 'Gastronomía', 'Exterior', 'Eventos'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('GalleryImage', galleryImageSchema);