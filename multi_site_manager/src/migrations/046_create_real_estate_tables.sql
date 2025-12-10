-- ============================================
-- Real Estate App Tables
-- Migration: 046_create_real_estate_tables.sql
-- Created: 2025-12-09
-- ============================================

-- ============================================
-- Property Inquiries Table
-- Buyer questions/interest about listings
-- ============================================
CREATE TABLE IF NOT EXISTS property_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    agent_id INT NULL,
    
    -- Inquiry details
    inquiry_type ENUM('general', 'pricing', 'features', 'neighborhood', 'financing', 'other') DEFAULT 'general',
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    
    -- Contact preferences
    preferred_contact ENUM('email', 'phone', 'text', 'any') DEFAULT 'email',
    phone_number VARCHAR(20) NULL,
    best_time_to_call VARCHAR(100) NULL,
    
    -- Status tracking
    status ENUM('new', 'read', 'responded', 'closed') DEFAULT 'new',
    response_message TEXT NULL,
    responded_at TIMESTAMP NULL,
    responded_by INT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES app_users(id) ON DELETE SET NULL,
    FOREIGN KEY (responded_by) REFERENCES app_users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_inquiries_app (app_id),
    INDEX idx_inquiries_listing (listing_id),
    INDEX idx_inquiries_buyer (buyer_id),
    INDEX idx_inquiries_status (status),
    INDEX idx_inquiries_created (created_at)
);

-- ============================================
-- Property Showings Table
-- Scheduled property viewings
-- ============================================
CREATE TABLE IF NOT EXISTS property_showings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    agent_id INT NULL,
    seller_id INT NULL,
    
    -- Scheduling
    requested_date DATE NOT NULL,
    requested_time TIME NULL,
    scheduled_date DATE NULL,
    scheduled_time TIME NULL,
    duration_minutes INT DEFAULT 30,
    
    -- Showing type
    showing_type ENUM('in_person', 'virtual', 'open_house') DEFAULT 'in_person',
    virtual_link VARCHAR(500) NULL,
    
    -- Status tracking
    status ENUM('requested', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'requested',
    
    -- Notes
    buyer_notes TEXT NULL,
    agent_notes TEXT NULL,
    feedback TEXT NULL,
    buyer_interest_level ENUM('not_interested', 'maybe', 'interested', 'very_interested') NULL,
    
    -- Cancellation
    cancelled_at TIMESTAMP NULL,
    cancelled_by INT NULL,
    cancellation_reason TEXT NULL,
    
    -- Confirmation
    confirmed_at TIMESTAMP NULL,
    confirmed_by INT NULL,
    
    -- Completion
    completed_at TIMESTAMP NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES app_users(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES app_users(id) ON DELETE SET NULL,
    FOREIGN KEY (cancelled_by) REFERENCES app_users(id) ON DELETE SET NULL,
    FOREIGN KEY (confirmed_by) REFERENCES app_users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_showings_app (app_id),
    INDEX idx_showings_listing (listing_id),
    INDEX idx_showings_buyer (buyer_id),
    INDEX idx_showings_agent (agent_id),
    INDEX idx_showings_status (status),
    INDEX idx_showings_scheduled (scheduled_date, scheduled_time),
    INDEX idx_showings_created (created_at)
);

-- ============================================
-- Property Offers Table (Phase 2 - created now for future use)
-- Purchase offers on listings
-- ============================================
CREATE TABLE IF NOT EXISTS property_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    agent_id INT NULL,
    
    -- Offer details
    offer_amount DECIMAL(12, 2) NOT NULL,
    earnest_money DECIMAL(10, 2) NULL,
    down_payment_percent DECIMAL(5, 2) NULL,
    financing_type ENUM('cash', 'conventional', 'fha', 'va', 'other') DEFAULT 'conventional',
    
    -- Contingencies
    inspection_contingency BOOLEAN DEFAULT TRUE,
    financing_contingency BOOLEAN DEFAULT TRUE,
    appraisal_contingency BOOLEAN DEFAULT TRUE,
    sale_contingency BOOLEAN DEFAULT FALSE,
    other_contingencies TEXT NULL,
    
    -- Timeline
    closing_date DATE NULL,
    possession_date DATE NULL,
    offer_expiration DATETIME NULL,
    
    -- Status
    status ENUM('draft', 'submitted', 'under_review', 'countered', 'accepted', 'rejected', 'withdrawn', 'expired') DEFAULT 'draft',
    
    -- Counter offer (if countered)
    counter_amount DECIMAL(12, 2) NULL,
    counter_terms TEXT NULL,
    countered_at TIMESTAMP NULL,
    
    -- Response
    response_notes TEXT NULL,
    responded_at TIMESTAMP NULL,
    responded_by INT NULL,
    
    -- Timestamps
    submitted_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    withdrawn_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES app_users(id) ON DELETE SET NULL,
    FOREIGN KEY (responded_by) REFERENCES app_users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_offers_app (app_id),
    INDEX idx_offers_listing (listing_id),
    INDEX idx_offers_buyer (buyer_id),
    INDEX idx_offers_status (status),
    INDEX idx_offers_created (created_at)
);

-- ============================================
-- Update property_listings for Real Estate
-- Add real estate specific fields (using procedures to handle IF NOT EXISTS)
-- ============================================

-- Add columns only if they don't exist (MySQL workaround)
SET @dbname = 'multi_site_manager';
SET @tablename = 'property_listings';

-- listing_type
SET @columnname = 'listing_type';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, " ENUM('sale', 'rent', 'sale_or_rent') DEFAULT 'sale' AFTER property_type")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- asking_price
SET @columnname = 'asking_price';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(12, 2) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- year_built
SET @columnname = 'year_built';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- lot_size
SET @columnname = 'lot_size';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 2) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- lot_size_unit
SET @columnname = 'lot_size_unit';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, " ENUM('sqft', 'acres') DEFAULT 'sqft'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- hoa_fee
SET @columnname = 'hoa_fee';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 2) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- hoa_frequency
SET @columnname = 'hoa_frequency';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, " ENUM('monthly', 'quarterly', 'annually') DEFAULT 'monthly'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- property_tax
SET @columnname = 'property_tax';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 2) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- mls_number
SET @columnname = 'mls_number';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(50) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- days_on_market
SET @columnname = 'days_on_market';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- listing_agent_id
SET @columnname = 'listing_agent_id';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- seller_id
SET @columnname = 'seller_id';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- sold_price
SET @columnname = 'sold_price';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(12, 2) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- sold_date
SET @columnname = 'sold_date';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DATE NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- Sample Data for App 60 (Real Estate App)
-- ============================================

-- Get some user IDs for sample data
SET @app_id = 60;

-- Get buyer and agent IDs
SELECT id INTO @buyer1_id FROM app_users WHERE app_id = @app_id AND email LIKE 'buyer1%' LIMIT 1;
SELECT id INTO @buyer2_id FROM app_users WHERE app_id = @app_id AND email LIKE 'buyer2%' LIMIT 1;
SELECT id INTO @agent1_id FROM app_users WHERE app_id = @app_id AND email LIKE 'agent1%' LIMIT 1;
SELECT id INTO @agent2_id FROM app_users WHERE app_id = @app_id AND email LIKE 'agent2%' LIMIT 1;
SELECT id INTO @seller1_id FROM app_users WHERE app_id = @app_id AND email LIKE 'seller1%' LIMIT 1;

-- Get some listing IDs
SELECT id INTO @listing1_id FROM property_listings WHERE app_id = @app_id LIMIT 1;
SELECT id INTO @listing2_id FROM property_listings WHERE app_id = @app_id LIMIT 1 OFFSET 1;
SELECT id INTO @listing3_id FROM property_listings WHERE app_id = @app_id LIMIT 1 OFFSET 2;

-- Insert sample inquiries
INSERT INTO property_inquiries (app_id, listing_id, buyer_id, agent_id, inquiry_type, subject, message, preferred_contact, status, created_at) VALUES
(@app_id, @listing1_id, @buyer1_id, @agent1_id, 'general', 'Interested in this property', 'Hi, I saw this listing and I am very interested. Is it still available? I would love to schedule a showing.', 'email', 'new', NOW()),
(@app_id, @listing1_id, @buyer2_id, @agent1_id, 'pricing', 'Price negotiable?', 'Is the asking price negotiable? I am pre-approved for a mortgage and ready to make an offer.', 'phone', 'responded', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@app_id, @listing2_id, @buyer1_id, @agent2_id, 'neighborhood', 'School district question', 'What school district is this property in? We have two kids and schools are important to us.', 'email', 'new', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@app_id, @listing3_id, @buyer2_id, @agent1_id, 'features', 'Garage size', 'The listing mentions a 2-car garage. Is it attached or detached? Also, is there additional storage space?', 'any', 'read', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Insert sample showings
INSERT INTO property_showings (app_id, listing_id, buyer_id, agent_id, requested_date, requested_time, scheduled_date, scheduled_time, showing_type, status, buyer_notes, created_at) VALUES
(@app_id, @listing1_id, @buyer1_id, @agent1_id, CURDATE() + INTERVAL 2 DAY, '14:00:00', CURDATE() + INTERVAL 2 DAY, '14:00:00', 'in_person', 'confirmed', 'Looking forward to seeing the backyard', NOW()),
(@app_id, @listing2_id, @buyer2_id, @agent2_id, CURDATE() + INTERVAL 3 DAY, '10:00:00', NULL, NULL, 'in_person', 'requested', 'First-time homebuyer, excited to see this one!', NOW()),
(@app_id, @listing1_id, @buyer2_id, @agent1_id, CURDATE() - INTERVAL 5 DAY, '11:00:00', CURDATE() - INTERVAL 5 DAY, '11:00:00', 'in_person', 'completed', NULL, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(@app_id, @listing3_id, @buyer1_id, @agent1_id, CURDATE() + INTERVAL 1 DAY, '16:00:00', NULL, NULL, 'virtual', 'requested', 'Can we do a virtual tour first?', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@app_id, @listing2_id, @buyer1_id, @agent2_id, CURDATE() - INTERVAL 2 DAY, '09:00:00', CURDATE() - INTERVAL 2 DAY, '09:00:00', 'in_person', 'cancelled', NULL, DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Update the completed showing with feedback
UPDATE property_showings 
SET feedback = 'Beautiful home, loved the kitchen. Concerned about the small backyard.', 
    buyer_interest_level = 'interested',
    completed_at = DATE_SUB(NOW(), INTERVAL 5 DAY)
WHERE status = 'completed' AND app_id = @app_id;

-- Update cancelled showing with reason
UPDATE property_showings 
SET cancelled_at = DATE_SUB(NOW(), INTERVAL 2 DAY),
    cancelled_by = @buyer1_id,
    cancellation_reason = 'Schedule conflict, will reschedule'
WHERE status = 'cancelled' AND app_id = @app_id;

-- Update confirmed showing
UPDATE property_showings 
SET confirmed_at = NOW(),
    confirmed_by = @agent1_id
WHERE status = 'confirmed' AND app_id = @app_id;

-- Update responded inquiry
UPDATE property_inquiries 
SET response_message = 'Yes, the price has some flexibility. Let me know if you would like to schedule a showing to discuss further.',
    responded_at = DATE_SUB(NOW(), INTERVAL 1 DAY),
    responded_by = @agent1_id
WHERE status = 'responded' AND app_id = @app_id;
