-- ========================================
-- Media Gallery Tables
-- Created: December 8, 2025
-- Purpose: Generic media storage for any app/template
-- ========================================

-- Generic media uploads table (for any entity type)
CREATE TABLE IF NOT EXISTS media_uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  
  -- Polymorphic association
  entity_type VARCHAR(50) NOT NULL COMMENT 'e.g., property_listing, product, post, user_profile',
  entity_id INT NOT NULL,
  
  -- Media info
  media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
  url VARCHAR(500) NOT NULL,
  storage_key VARCHAR(255) COMMENT 'S3 key or storage identifier',
  thumbnail_url VARCHAR(500) COMMENT 'For videos or large images',
  
  -- Metadata
  caption VARCHAR(255),
  alt_text VARCHAR(255) COMMENT 'Accessibility text',
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE COMMENT 'Featured/main media',
  
  -- File info
  original_filename VARCHAR(255),
  file_size INT COMMENT 'Size in bytes',
  mime_type VARCHAR(100),
  width INT COMMENT 'Image/video width in pixels',
  height INT COMMENT 'Image/video height in pixels',
  duration INT COMMENT 'Video duration in seconds',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_app (app_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_primary (entity_type, entity_id, is_primary),
  INDEX idx_order (entity_type, entity_id, display_order),
  INDEX idx_media_type (media_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Property videos table (specific to property listings for backward compatibility)
CREATE TABLE IF NOT EXISTS property_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  
  video_url VARCHAR(500) NOT NULL,
  video_key VARCHAR(255) COMMENT 'S3 key or storage identifier',
  thumbnail_url VARCHAR(500),
  caption VARCHAR(255),
  duration INT COMMENT 'Duration in seconds',
  display_order INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_listing (listing_id),
  INDEX idx_order (listing_id, display_order),
  
  FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add media_gallery element to screen_elements
INSERT INTO screen_elements (name, element_type, category, description, default_config, is_active)
VALUES (
  'Media Gallery',
  'media_gallery',
  'media',
  'Upload and manage multiple images and videos with reordering, captions, and primary selection',
  JSON_OBJECT(
    'media_types', JSON_ARRAY('image'),
    'max_items', 10,
    'min_items', 0,
    'allow_reorder', true,
    'allow_captions', false,
    'show_primary_selector', false,
    'grid_columns', 3,
    'max_file_size_mb', 10,
    'aspect_ratio', null,
    'upload_text', 'Add Media'
  ),
  1
) ON DUPLICATE KEY UPDATE 
  description = VALUES(description),
  default_config = VALUES(default_config);
