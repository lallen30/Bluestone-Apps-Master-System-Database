const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure base uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get app_id or app_name from request body or query
    const appId = req.body.app_id || req.query.app_id;
    const appName = req.body.app_name || req.query.app_name;
    
    // Create app-specific folder
    let appFolder = 'general'; // Default folder if no app specified
    if (appName) {
      // Sanitize app name for folder name (remove special chars, spaces to underscores)
      appFolder = appName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    } else if (appId) {
      appFolder = `app_${appId}`;
    }
    
    const appUploadsDir = path.join(uploadsDir, appFolder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(appUploadsDir)) {
      fs.mkdirSync(appUploadsDir, { recursive: true });
    }
    
    cb(null, appUploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// File filter for images
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// File filter for all files
const fileFilter = function (req, file, cb) {
  // Accept all files but with size limit
  cb(null, true);
};

// File filter for videos
const videoFilter = function (req, file, cb) {
  // Accept video files only
  if (!file.mimetype.startsWith('video/')) {
    return cb(new Error('Only video files are allowed!'), false);
  }
  cb(null, true);
};

// File filter for media (images and videos)
const mediaFilter = function (req, file, cb) {
  // Accept images and videos
  if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
    return cb(new Error('Only image and video files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer for images
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure multer for videos
const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// Configure multer for media (images + videos)
const uploadMedia = multer({
  storage: storage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Configure multer for all files
const uploadFile = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = {
  uploadImage,
  uploadVideo,
  uploadMedia,
  uploadFile
};
