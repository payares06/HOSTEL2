import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Validaciones
const registerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Ingresa un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('phone')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Ingresa un número de teléfono válido')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Ingresa un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Rutas protegidas
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;