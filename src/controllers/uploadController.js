const { uploadSingle, uploadMultiple, uploadFields } = require('../middlewares/uploadMiddleware');
const { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const path = require('path');

// Upload single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No file uploaded',
        },
      });
    }

    // Determine folder based on request
    const folder = req.body.folder || 'general';
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, folder);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to upload image',
        details: error.message,
      },
    });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No files uploaded',
        },
      });
    }

    // Determine folder based on request
    const folder = req.body.folder || 'general';
    
    // Get file paths
    const filePaths = req.files.map(file => file.path);
    
    // Upload to Cloudinary
    const results = await uploadMultipleToCloudinary(filePaths, folder);

    res.json({
      success: true,
      message: `${results.length} image(s) uploaded successfully`,
      data: results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      })),
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to upload images',
        details: error.message,
      },
    });
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Public ID is required',
        },
      });
    }

    const result = await deleteFromCloudinary(publicId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Image deleted successfully',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        error: {
          message: 'Image not found or already deleted',
        },
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete image',
        details: error.message,
      },
    });
  }
};

// Middleware for handling upload
const handleUpload = (type = 'single') => {
  if (type === 'multiple') {
    return uploadMultiple('images', 10);
  } else if (type === 'fields') {
    return uploadFields([
      { name: 'trip_image', maxCount: 10 },
      { name: 'collection_image', maxCount: 1 },
      { name: 'destination_image', maxCount: 1 },
      { name: 'journal_image', maxCount: 1 },
      { name: 'stop_image', maxCount: 5 },
      { name: 'user_avatar', maxCount: 1 },
    ]);
  } else {
    return uploadSingle('image');
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  handleUpload,
};

