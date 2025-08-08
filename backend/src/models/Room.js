import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'El tipo de habitación es requerido'],
    enum: ['individual', 'doble', 'familiar']
  },
  name: {
    type: String,
    required: [true, 'El nombre de la habitación es requerido'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    alt: String
  }],
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  available: {
    type: Boolean,
    default: true
  },
  roomNumber: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);