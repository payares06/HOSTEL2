import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guestName: {
    type: String,
    required: [true, 'El nombre del huésped es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  checkIn: {
    type: Date,
    required: [true, 'La fecha de check-in es requerida']
  },
  checkOut: {
    type: Date,
    required: [true, 'La fecha de check-out es requerida']
  },
  guests: {
    type: Number,
    required: [true, 'El número de huéspedes es requerido'],
    min: [1, 'Debe haber al menos 1 huésped']
  },
  nights: {
    type: Number,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Validar que check-out sea después de check-in
reservationSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error('La fecha de check-out debe ser posterior a la fecha de check-in'));
  }
  
  // Calcular noches automáticamente
  const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
  this.nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Calcular precio total
  this.totalPrice = this.nights * this.pricePerNight;
  
  next();
});

export default mongoose.model('Reservation', reservationSchema);