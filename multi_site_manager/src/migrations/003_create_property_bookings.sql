-- Migration: Create Property Bookings Tables
-- Date: 2025-11-20
-- Description: Tables for property booking/reservation system

-- ============================================
-- Property Bookings Table
-- ============================================
CREATE TABLE IF NOT EXISTS property_bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  app_id INT NOT NULL,
  listing_id INT NOT NULL,
  guest_user_id INT NOT NULL,
  host_user_id INT NOT NULL,
  
  -- Booking dates
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests_count INT NOT NULL DEFAULT 1,
  nights INT NOT NULL,
  
  -- Pricing
  price_per_night DECIMAL(10,2) NOT NULL,
  cleaning_fee DECIMAL(10,2) DEFAULT 0.00,
  service_fee DECIMAL(10,2) DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Status
  status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'rejected') DEFAULT 'pending',
  
  -- Guest information
  guest_first_name VARCHAR(100),
  guest_last_name VARCHAR(100),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(20),
  special_requests TEXT,
  
  -- Cancellation
  cancelled_at TIMESTAMP NULL,
  cancelled_by INT NULL,
  cancellation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  
  -- Foreign keys
  FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (guest_user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  FOREIGN KEY (host_user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_listing_id (listing_id),
  INDEX idx_guest_user_id (guest_user_id),
  INDEX idx_host_user_id (host_user_id),
  INDEX idx_status (status),
  INDEX idx_check_in_date (check_in_date),
  INDEX idx_check_out_date (check_out_date),
  INDEX idx_dates (check_in_date, check_out_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Booking Status History Table
-- ============================================
CREATE TABLE IF NOT EXISTS booking_status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (booking_id) REFERENCES property_bookings(id) ON DELETE CASCADE,
  INDEX idx_booking_id (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Update property_availability when booking confirmed
-- ============================================
-- This will be handled in the application code to block dates

-- ============================================
-- Sample data for testing (optional)
-- ============================================
-- Uncomment to add test bookings
/*
INSERT INTO property_bookings 
  (app_id, listing_id, guest_user_id, host_user_id, 
   check_in_date, check_out_date, guests_count, nights,
   price_per_night, cleaning_fee, service_fee, total_price,
   status, guest_first_name, guest_last_name, guest_email)
VALUES 
  (28, 1, 21, 22, '2025-12-01', '2025-12-05', 2, 4, 150.00, 50.00, 30.00, 680.00,
   'confirmed', 'John', 'Doe', 'john@test.com');
*/
