import { validationResult } from 'express-validator';
import Reservation from '../models/Reservation.js';
import Room from '../models/Room.js';

export const createReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { roomId, guestName, email, phone, checkIn, checkOut, guests, specialRequests } = req.body;

    // Verificar que la habitación existe
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      });
    }

    if (!room.available) {
      return res.status(400).json({
        success: false,
        message: 'La habitación no está disponible'
      });
    }

    if (guests > room.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Esta habitación solo permite ${room.maxGuests} huéspedes máximo`
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Verificar disponibilidad en las fechas solicitadas
    const conflictingReservations = await Reservation.find({
      room: roomId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (conflictingReservations.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'La habitación no está disponible en las fechas seleccionadas'
      });
    }

    // Crear la reserva
    const reservation = await Reservation.create({
      user: req.user._id,
      room: roomId,
      guestName,
      email,
      phone,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      pricePerNight: room.price,
      specialRequests
    });

    // Poblar los datos de la habitación
    await reservation.populate('room', 'name type');

    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reservation
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('room', 'name type images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Error obteniendo reservas del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;

    const reservations = await Reservation.find(filter)
      .populate('user', 'fullName email phone')
      .populate('room', 'name type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(filter);

    res.json({
      success: true,
      count: reservations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reservations
    });
  } catch (error) {
    console.error('Error obteniendo todas las reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('room', 'name type images features');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Si es un cliente, solo puede ver sus propias reservas
    if (req.user.role === 'client' && reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta reserva'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('room', 'name type');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Estado de reserva actualizado exitosamente',
      data: reservation
    });
  } catch (error) {
    console.error('Error actualizando estado de reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada'
      });
    }

    // Si es un cliente, solo puede cancelar sus propias reservas
    if (req.user.role === 'client' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cancelar esta reserva'
      });
    }

    // No se puede cancelar una reserva ya completada
    if (reservation.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una reserva completada'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: reservation
    });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getReservationStats = async (req, res) => {
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalReservations = await Reservation.countDocuments();
    const totalRevenue = await Reservation.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalReservations,
        totalRevenue: totalRevenue[0]?.total || 0,
        byStatus: stats
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};