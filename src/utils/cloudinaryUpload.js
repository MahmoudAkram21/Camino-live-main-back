const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Cloudinary folder path (e.g., 'trips', 'collections')
 * @param {Object} options - Additional Cloudinary options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (filePath, folder = 'general', options = {}) => {
  try {
    const uploadOptions = {
      folder: `camino/${folder}`,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: 'auto',
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    // Delete local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return {
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Delete local file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths to upload
 * @param {string} folder - Cloudinary folder path
 * @param {Object} options - Additional Cloudinary options
 * @returns {Promise<Array<Object>>} - Array of Cloudinary upload results
 */
const uploadMultipleToCloudinary = async (filePaths, folder = 'general', options = {}) => {
  try {
    const uploadPromises = filePaths.map(filePath => 
      uploadToCloudinary(filePath, folder, options)
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw error;
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} - Public ID or null
 */
const extractPublicIdFromUrl = (url) => {
  try {
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/);
    if (match && match[1]) {
      // Remove folder prefix (camino/trips/, etc.)
      return match[1].replace(/^camino\/[^/]+\//, '');
    }
    return null;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

/**
 * Transform Cloudinary image URL (resize, crop, etc.)
 * @param {string} publicId - Cloudinary public_id
 * @param {Object} transformations - Cloudinary transformation options
 * @returns {string} - Transformed URL
 */
const getTransformedUrl = (publicId, transformations = {}) => {
  try {
    const defaultTransformations = {
      quality: 'auto',
      fetch_format: 'auto',
      ...transformations,
    };
    
    return cloudinary.url(publicId, defaultTransformations);
  } catch (error) {
    console.error('Error generating transformed URL:', error);
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  getTransformedUrl,
};

