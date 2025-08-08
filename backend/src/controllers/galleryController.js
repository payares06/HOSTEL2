import GalleryImage from '../models/GalleryImage.js';

export const getAllImages = async (req, res) => {
  try {
    const { category } = req.query;
    
    let filter = { isActive: true };
    if (category) filter.category = category;

    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Error obteniendo imágenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await GalleryImage.distinct('category', { isActive: true });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Solo para administradores
export const createImage = async (req, res) => {
  try {
    const image = await GalleryImage.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Imagen agregada exitosamente',
      data: image
    });
  } catch (error) {
    console.error('Error creando imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Imagen actualizada exitosamente',
      data: image
    });
  } catch (error) {
    console.error('Error actualizando imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};