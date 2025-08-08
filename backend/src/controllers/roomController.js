import Room from '../models/Room.js';
import Reservation from '../models/Reservation.js';

export const getAllRooms = async (req, res) => {
  try {
    const { type, available } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (available !== undefined) filter.available = available === 'true';

    const rooms = await Room.find(filter).sort({ type: 1, price: 1 });

    res.json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    console.error('Error obteniendo habitaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error obteniendo habitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'roomId, checkIn y checkOut son requeridos'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de check-out debe ser posterior a check-in'
      });
    }

    // Buscar reservas que se solapen con las fechas solicitadas
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

    const isAvailable = conflictingReservations.length === 0;

    res.json({
      success: true,
      available: isAvailable,
      conflictingReservations: conflictingReservations.length
    });
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Solo para administradores
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Habitación creada exitosamente',
      data: room
    });
  } catch (error) {
    console.error('Error creando habitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Habitación actualizada exitosamente',
      data: room
    });
  } catch (error) {
    console.error('Error actualizando habitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Habitación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Habitación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando habitación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};