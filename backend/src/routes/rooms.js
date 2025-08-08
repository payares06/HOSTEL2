import express from 'express';
import {
  getAllRooms,
  getRoomById,
  checkAvailability,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllRooms);
router.get('/availability', checkAvailability);
router.get('/:id', getRoomById);

// Rutas protegidas (solo administradores)
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);

export default router;