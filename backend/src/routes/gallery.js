import express from 'express';
import {
  getAllImages,
  getCategories,
  createImage,
  updateImage,
  deleteImage
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllImages);
router.get('/categories', getCategories);

// Rutas protegidas (solo administradores)
router.post('/', protect, authorize('admin'), createImage);
router.put('/:id', protect, authorize('admin'), updateImage);
router.delete('/:id', protect, authorize('admin'), deleteImage);

export default router;