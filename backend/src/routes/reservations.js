import express from 'express';
import { body } from 'express-validator';
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
  getReservationStats
} from '../controllers/reservationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validaciones
const reservationValidation = [
  body('roomId')
    .isMongoId()
    .withMessage('ID de habitación inválido'),
  body('guestName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del huésped debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Ingresa un email válido'),
  body('phone')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Ingresa un número de teléfono válido'),
  body('checkIn')
    .isISO8601()
    .withMessage('Fecha de check-in inválida'),
  body('checkOut')
    .isISO8601()
    .withMessage('Fecha de check-out inválida'),
  body('guests')
    .isInt({ min: 1, max: 10 })
    .withMessage('El número de huéspedes debe ser entre 1 y 10')
];

// Rutas protegidas
router.use(protect);

// Rutas para clientes y administradores
router.post('/', reservationValidation, createReservation);
router.get('/my-reservations', getUserReservations);
router.get('/:id', getReservationById);
router.put('/:id/cancel', cancelReservation);

// Rutas solo para administradores
router.get('/', authorize('admin'), getAllReservations);
router.put('/:id/status', authorize('admin'), updateReservationStatus);
router.get('/admin/stats', authorize('admin'), getReservationStats);

export default router;