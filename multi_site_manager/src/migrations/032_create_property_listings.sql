-- Property Rental App - Listings System
-- This migration creates the foundation for property listing management

-- Main property listings table
CREATE TABLE IF NOT EXISTS property_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  app_id INT NOT NULL,
  user_id INT NOT NULL COMMENT 'Host/owner of the property',
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type ENUM('house', 'apartment', 'condo', 'villa', 'cabin', 'cottage', 'townhouse', 'loft', 'other') DEFAULT 'apartment',
  
  -- Location
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  latitude DECIMAL(10, 8) COMMENT 'For map display and proximity search',
  longitude DECIMAL(11, 8),
  
  -- Property Details
  bedrooms INT DEFAULT 0,
  bathrooms DECIMAL(3,1) DEFAULT 0 COMMENT 'Supports half baths (e.g., 2.5)',
  beds INT DEFAULT 0,
  guests_max INT DEFAULT 1,
  square_feet INT,
  
  -- Pricing
  price_per_night DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee_percentage DECIMAL(5, 2) DEFAULT 0 COMMENT 'Platform fee percentage',
  
  -- Booking Rules
  min_nights INT DEFAULT 1,
  max_nights INT DEFAULT 365,
  check_in_time TIME DEFAULT '15:00:00',
  check_out_time TIME DEFAULT '11:00:00',
  cancellation_policy ENUM('flexible', 'moderate', 'strict', 'super_strict') DEFAULT 'moderate',
  
  -- Status
  status ENUM('draft', 'pending_review', 'active', 'inactive', 'suspended') DEFAULT 'draft',
  is_published BOOLEAN DEFAULT FALSE,
  is_instant_book BOOLEAN DEFAULT FALSE COMMENT 'Auto-approve bookings',
  
  -- Rules & Info
  house_rules TEXT COMMENT 'JSON or text of house rules',
  additional_info TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  
  -- Indexes
  INDEX idx_app_id (app_id),
  INDEX idx_user_id (user_id),
  INDEX idx_location (city, state, country),
  INDEX idx_coordinates (latitude, longitude),
  INDEX idx_status (status, is_published),
  INDEX idx_price (price_per_night),
  
  -- Foreign Keys
  FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  
  image_url VARCHAR(500) NOT NULL,
  image_key VARCHAR(255) COMMENT 'S3 key or storage identifier',
  caption VARCHAR(255),
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE COMMENT 'Main listing photo',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_listing (listing_id),
  INDEX idx_primary (listing_id, is_primary),
  INDEX idx_order (listing_id, display_order),
  
  FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Amenities master table
CREATE TABLE IF NOT EXISTS property_amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  name VARCHAR(100) NOT NULL,
  category ENUM('basic', 'features', 'safety', 'accessibility', 'outdoor', 'entertainment') DEFAULT 'basic',
  icon VARCHAR(50) COMMENT 'Icon name for UI',
  description TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_amenity_name (name),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Link table for listing amenities (many-to-many)
CREATE TABLE IF NOT EXISTS property_listing_amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  amenity_id INT NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_listing_amenity (listing_id, amenity_id),
  INDEX idx_listing (listing_id),
  INDEX idx_amenity (amenity_id),
  
  FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES property_amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Availability calendar table
CREATE TABLE IF NOT EXISTS property_availability (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  price_override DECIMAL(10, 2) COMMENT 'Special pricing for this date',
  notes VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_listing_date (listing_id, date),
  INDEX idx_listing (listing_id),
  INDEX idx_date (date),
  INDEX idx_available (listing_id, date, is_available),
  
  FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default amenities
INSERT INTO property_amenities (name, category, icon) VALUES
-- Basic
('WiFi', 'basic', 'Wifi'),
('Kitchen', 'basic', 'ChefHat'),
('Washer', 'basic', 'WashingMachine'),
('Dryer', 'basic', 'Wind'),
('Air Conditioning', 'basic', 'AirVent'),
('Heating', 'basic', 'Flame'),
('TV', 'basic', 'Tv'),
('Hair Dryer', 'basic', 'Wind'),
('Iron', 'basic', 'Shirt'),

-- Features
('Pool', 'features', 'Waves'),
('Hot Tub', 'features', 'Bath'),
('Gym', 'features', 'Dumbbell'),
('EV Charger', 'features', 'BatteryCharging'),
('BBQ Grill', 'features', 'Flame'),
('Fireplace', 'features', 'Flame'),
('Piano', 'features', 'Music'),
('Workspace', 'features', 'Monitor'),

-- Safety
('Smoke Alarm', 'safety', 'AlertTriangle'),
('Carbon Monoxide Alarm', 'safety', 'AlertTriangle'),
('Fire Extinguisher', 'safety', 'Shield'),
('First Aid Kit', 'safety', 'Heart'),
('Security Cameras', 'safety', 'Camera'),

-- Accessibility
('Step-free Entry', 'accessibility', 'Home'),
('Elevator', 'accessibility', 'ArrowUpDown'),
('Wide Doorways', 'accessibility', 'DoorOpen'),
('Accessible Parking', 'accessibility', 'ParkingCircle'),

-- Outdoor
('Patio', 'outdoor', 'Trees'),
('Balcony', 'outdoor', 'Home'),
('Garden', 'outdoor', 'Flower'),
('Beach Access', 'outdoor', 'Waves'),
('Lake Access', 'outdoor', 'Waves'),

-- Entertainment
('Netflix', 'entertainment', 'Tv'),
('Board Games', 'entertainment', 'Gamepad2'),
('Books', 'entertainment', 'Book'),
('Sound System', 'entertainment', 'Music')
ON DUPLICATE KEY UPDATE name=VALUES(name);
