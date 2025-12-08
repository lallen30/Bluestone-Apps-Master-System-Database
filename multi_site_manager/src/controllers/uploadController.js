const path = require('path');
const fs = require('fs').promises;

/**
 * Upload file
 * POST /api/v1/upload
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    
    // Extract app folder from the file path
    const pathParts = file.path.split(path.sep);
    const uploadsIndex = pathParts.indexOf('uploads');
    const appFolder = pathParts[uploadsIndex + 1]; // Get folder after 'uploads'
    
    // Construct URL with app folder
    const fileUrl = `/uploads/${appFolder}/${file.filename}`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
        path: file.path,
        appFolder: appFolder
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

/**
 * Upload multiple files
 * POST /api/v1/mobile/apps/:appId/upload/media
 */
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => {
      // Extract app folder from the file path
      const pathParts = file.path.split(path.sep);
      const uploadsIndex = pathParts.indexOf('uploads');
      const appFolder = pathParts[uploadsIndex + 1];
      
      // Determine media type
      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      
      return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${appFolder}/${file.filename}`,
        path: file.path,
        appFolder: appFolder,
        mediaType: mediaType
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      }
    });
  } catch (error) {
    console.error('Upload multiple files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files',
      error: error.message
    });
  }
};

/**
 * Delete file
 * DELETE /api/v1/upload/:appFolder/:filename
 */
const deleteFile = async (req, res) => {
  try {
    const { appFolder, filename } = req.params;
    const uploadsDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadsDir, appFolder, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile
};
