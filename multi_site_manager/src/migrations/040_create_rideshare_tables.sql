-- Migration: Create Rideshare Database Tables
-- Template 11 - Rideshare App
-- Date: 2025-12-03

-- ========================================
-- Core Ride Tables
-- ========================================

-- Rides table - main ride requests
CREATE TABLE IF NOT EXISTS rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    rider_id INT NOT NULL,
    driver_id INT,
    
    -- Pickup Location
    pickup_address VARCHAR(500) NOT NULL,
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    
    -- Destination Location
    destination_address VARCHAR(500) NOT NULL,
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    
    -- Ride Details
    ride_type ENUM('standard', 'premium', 'xl', 'luxury') DEFAULT 'standard',
    estimated_fare DECIMAL(10, 2),
    actual_fare DECIMAL(10, 2),
    distance_km DECIMAL(10, 2),
    duration_minutes INT,
    
    -- Status
    status ENUM('requested', 'searching', 'driver_assigned', 'driver_arriving', 
                'arrived', 'in_progress', 'completed', 'cancelled') DEFAULT 'requested',
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    driver_assigned_at TIMESTAMP NULL,
    driver_arrived_at TIMESTAMP NULL,
    pickup_at TIMESTAMP NULL,
    dropoff_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    
    -- Additional
    promo_code VARCHAR(50),
    ride_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by ENUM('rider', 'driver', 'system'),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (rider_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES app_users(id) ON DELETE SET NULL,
    INDEX idx_app_rider (app_id, rider_id),
    INDEX idx_app_driver (app_id, driver_id),
    INDEX idx_status (status),
    INDEX idx_requested_at (requested_at)
);

-- Driver Profiles
CREATE TABLE IF NOT EXISTS driver_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Vehicle Info
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INT,
    vehicle_color VARCHAR(50),
    license_plate VARCHAR(20),
    vehicle_type ENUM('sedan', 'suv', 'van', 'luxury') DEFAULT 'sedan',
    
    -- Driver Stats
    total_rides INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_ratings INT DEFAULT 0,
    acceptance_rate DECIMAL(5, 2) DEFAULT 100.00,
    cancellation_rate DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP NULL,
    
    -- Documents (URLs)
    drivers_license_url VARCHAR(500),
    vehicle_registration_url VARCHAR(500),
    insurance_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    vehicle_photo_url VARCHAR(500),
    
    -- Verification Status
    license_verified BOOLEAN DEFAULT FALSE,
    registration_verified BOOLEAN DEFAULT FALSE,
    insurance_verified BOOLEAN DEFAULT FALSE,
    background_check_passed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_driver (app_id, user_id),
    INDEX idx_online (app_id, is_online, is_verified),
    INDEX idx_location (current_latitude, current_longitude)
);

-- Ride Reviews/Ratings
CREATE TABLE IF NOT EXISTS ride_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    review_type ENUM('rider_to_driver', 'driver_to_rider') NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES app_users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (ride_id, reviewer_id),
    INDEX idx_reviewee (reviewee_id),
    CHECK (rating >= 1 AND rating <= 5)
);

-- User Payment Methods
CREATE TABLE IF NOT EXISTS user_payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,
    payment_type ENUM('credit', 'debit', 'paypal', 'apple_pay', 'google_pay', 'cash') NOT NULL,
    
    -- Card details (last 4 only - full details stored in payment processor)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    expiry_month INT,
    expiry_year INT,
    
    -- Digital Wallet
    wallet_email VARCHAR(255),
    
    -- Stripe/Payment processor token
    payment_token VARCHAR(255),
    
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_user (app_id, user_id)
);

-- Ride Payments
CREATE TABLE IF NOT EXISTS ride_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ride_id INT NOT NULL,
    payment_method_id INT,
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Breakdown
    base_fare DECIMAL(10, 2),
    distance_fare DECIMAL(10, 2),
    time_fare DECIMAL(10, 2),
    surge_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    promo_discount DECIMAL(10, 2) DEFAULT 0.00,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    failure_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES user_payment_methods(id) ON DELETE SET NULL,
    INDEX idx_status (status)
);

-- User Saved Addresses
CREATE TABLE IF NOT EXISTS user_saved_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,
    
    label VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    is_default BOOLEAN DEFAULT FALSE,
    address_type ENUM('home', 'work', 'other') DEFAULT 'other',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_user (app_id, user_id)
);

-- Promo Codes
CREATE TABLE IF NOT EXISTS ride_promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    
    code VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount DECIMAL(10, 2),
    min_ride_amount DECIMAL(10, 2),
    
    usage_limit INT,
    used_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    
    valid_from TIMESTAMP NULL,
    valid_until TIMESTAMP NULL,
    
    -- Restrictions
    first_ride_only BOOLEAN DEFAULT FALSE,
    ride_types JSON,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    UNIQUE KEY unique_code (app_id, code),
    INDEX idx_active (app_id, is_active)
);

-- Promo Code Usage Tracking
CREATE TABLE IF NOT EXISTS ride_promo_code_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    promo_code_id INT NOT NULL,
    user_id INT NOT NULL,
    ride_id INT NOT NULL,
    discount_applied DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (promo_code_id) REFERENCES ride_promo_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- Driver Earnings
CREATE TABLE IF NOT EXISTS driver_earnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    driver_id INT NOT NULL,
    ride_id INT NOT NULL,
    
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    tip_amount DECIMAL(10, 2) DEFAULT 0.00,
    bonus_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    status ENUM('pending', 'available', 'paid', 'held') DEFAULT 'pending',
    payout_id INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    available_at TIMESTAMP NULL,
    paid_at TIMESTAMP NULL,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ride_id) REFERENCES rides(id) ON DELETE CASCADE,
    INDEX idx_driver (app_id, driver_id),
    INDEX idx_status (status)
);

-- Driver Payouts
CREATE TABLE IF NOT EXISTS driver_payouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    driver_id INT NOT NULL,
    
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    payout_method ENUM('bank_transfer', 'paypal', 'check') DEFAULT 'bank_transfer',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    
    transaction_id VARCHAR(100),
    failure_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES app_users(id) ON DELETE CASCADE,
    INDEX idx_driver (app_id, driver_id),
    INDEX idx_status (status)
);

-- Ride Pricing Rules
CREATE TABLE IF NOT EXISTS ride_pricing_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    
    ride_type ENUM('standard', 'premium', 'xl', 'luxury') NOT NULL,
    
    base_fare DECIMAL(10, 2) NOT NULL DEFAULT 2.50,
    per_km_rate DECIMAL(10, 2) NOT NULL DEFAULT 1.50,
    per_minute_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.25,
    minimum_fare DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
    
    -- Surge pricing
    surge_multiplier_max DECIMAL(3, 2) DEFAULT 3.00,
    
    -- Platform fee
    platform_fee_percentage DECIMAL(5, 2) DEFAULT 20.00,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    UNIQUE KEY unique_pricing (app_id, ride_type)
);

-- ========================================
-- Template-Specific Tables for Cloning
-- ========================================

-- Template Rides (sample data for cloning)
CREATE TABLE IF NOT EXISTS app_template_rides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    template_rider_id INT,
    template_driver_id INT,
    
    pickup_address VARCHAR(500),
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    destination_address VARCHAR(500),
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    
    ride_type VARCHAR(20) DEFAULT 'standard',
    status VARCHAR(20) DEFAULT 'completed',
    estimated_fare DECIMAL(10, 2),
    actual_fare DECIMAL(10, 2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- Template Driver Profiles
CREATE TABLE IF NOT EXISTS app_template_driver_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    template_user_id INT NOT NULL,
    
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    vehicle_year INT,
    vehicle_color VARCHAR(50),
    license_plate VARCHAR(20),
    vehicle_type VARCHAR(20) DEFAULT 'sedan',
    
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_rides INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- Template Pricing Rules
CREATE TABLE IF NOT EXISTS app_template_ride_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    
    ride_type VARCHAR(20) NOT NULL,
    base_fare DECIMAL(10, 2) NOT NULL,
    per_km_rate DECIMAL(10, 2) NOT NULL,
    per_minute_rate DECIMAL(10, 2) NOT NULL,
    minimum_fare DECIMAL(10, 2) NOT NULL,
    
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- ========================================
-- Insert Default Pricing for Template 11
-- ========================================
INSERT INTO app_template_ride_pricing (template_id, ride_type, base_fare, per_km_rate, per_minute_rate, minimum_fare)
VALUES
    (11, 'standard', 2.50, 1.50, 0.25, 5.00),
    (11, 'premium', 4.00, 2.25, 0.35, 8.00),
    (11, 'xl', 5.00, 2.50, 0.40, 10.00),
    (11, 'luxury', 10.00, 4.00, 0.60, 20.00);

SELECT '✅ Rideshare database tables created successfully!' AS Result;
