-- Migration: Add Real Estate Template Tables for Inquiries, Showings, and Offers
-- Date: 2025-12-09
-- Description: Creates template tables for property inquiries, showings, and offers
--              so that apps created from Template 5 (Real Estate) will have sample data

-- =====================================================
-- STEP 1: Create app_template_property_inquiries table
-- =====================================================

CREATE TABLE IF NOT EXISTS app_template_property_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    listing_ref INT NOT NULL COMMENT 'Reference to app_template_property_listings.id',
    buyer_ref INT NOT NULL COMMENT 'Reference to app_template_users.id (buyer)',
    agent_ref INT NULL COMMENT 'Reference to app_template_users.id (agent)',
    inquiry_type ENUM('general', 'showing_request', 'price_inquiry', 'offer_interest', 'other') DEFAULT 'general',
    subject VARCHAR(255) NULL,
    message TEXT NULL,
    preferred_contact ENUM('email', 'phone', 'either') DEFAULT 'either',
    status ENUM('new', 'read', 'responded', 'closed') DEFAULT 'new',
    response TEXT NULL,
    responded_at TIMESTAMP NULL,
    days_ago INT DEFAULT 0 COMMENT 'Days before app creation for created_at',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template (template_id),
    INDEX idx_listing (listing_ref),
    INDEX idx_buyer (buyer_ref),
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- =====================================================
-- STEP 2: Create app_template_property_showings table
-- =====================================================

CREATE TABLE IF NOT EXISTS app_template_property_showings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    listing_ref INT NOT NULL COMMENT 'Reference to app_template_property_listings.id',
    buyer_ref INT NOT NULL COMMENT 'Reference to app_template_users.id (buyer)',
    agent_ref INT NULL COMMENT 'Reference to app_template_users.id (agent)',
    requested_date DATE NULL,
    requested_time TIME NULL,
    showing_date DATE NULL,
    showing_time TIME NULL,
    showing_type ENUM('in_person', 'virtual', 'open_house') DEFAULT 'in_person',
    status ENUM('requested', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'requested',
    buyer_notes TEXT NULL,
    agent_notes TEXT NULL,
    confirmation_notes TEXT NULL,
    cancellation_reason TEXT NULL,
    feedback TEXT NULL,
    buyer_interest_level ENUM('not_interested', 'somewhat_interested', 'interested', 'very_interested') NULL,
    days_from_now INT DEFAULT 1 COMMENT 'Days from app creation for showing_date',
    days_ago INT DEFAULT 0 COMMENT 'Days before app creation for created_at',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template (template_id),
    INDEX idx_listing (listing_ref),
    INDEX idx_buyer (buyer_ref),
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- =====================================================
-- STEP 3: Create app_template_property_offers table
-- =====================================================

CREATE TABLE IF NOT EXISTS app_template_property_offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT NOT NULL,
    listing_ref INT NOT NULL COMMENT 'Reference to app_template_property_listings.id',
    buyer_ref INT NOT NULL COMMENT 'Reference to app_template_users.id (buyer)',
    agent_ref INT NULL COMMENT 'Reference to app_template_users.id (agent)',
    offer_amount DECIMAL(12,2) NOT NULL,
    earnest_money DECIMAL(10,2) NULL,
    down_payment_percent DECIMAL(5,2) NULL,
    financing_type ENUM('cash', 'conventional', 'fha', 'va', 'other') DEFAULT 'conventional',
    inspection_contingency TINYINT(1) DEFAULT 1,
    financing_contingency TINYINT(1) DEFAULT 1,
    appraisal_contingency TINYINT(1) DEFAULT 1,
    sale_contingency TINYINT(1) DEFAULT 0,
    other_contingencies TEXT NULL,
    closing_days INT DEFAULT 45 COMMENT 'Days from app creation for closing_date',
    status ENUM('draft', 'submitted', 'under_review', 'countered', 'accepted', 'rejected', 'withdrawn', 'expired') DEFAULT 'submitted',
    counter_amount DECIMAL(12,2) NULL,
    counter_terms TEXT NULL,
    response_notes TEXT NULL,
    days_ago INT DEFAULT 0 COMMENT 'Days before app creation for created_at',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template (template_id),
    INDEX idx_listing (listing_ref),
    INDEX idx_buyer (buyer_ref),
    FOREIGN KEY (template_id) REFERENCES app_templates(id) ON DELETE CASCADE
);

-- =====================================================
-- STEP 4: Insert sample inquiries for Template 5
-- =====================================================
-- NOTE: Data has been inserted manually with correct IDs:
-- Agents: David Miller (23), Jennifer Davis (24)
-- Buyers: John Smith (19), Sarah Johnson (20)
-- Listings: 27-34

-- Sample data inserted:
-- 4 inquiries, 5 showings, 5 offers

-- =====================================================
-- STEP 5: Verify the data
-- =====================================================

-- SELECT 'Template 5 Real Estate Data Summary' as info;
-- SELECT 'Inquiries' as entity, COUNT(*) as count FROM app_template_property_inquiries WHERE template_id = 5;
-- SELECT 'Showings' as entity, COUNT(*) as count FROM app_template_property_showings WHERE template_id = 5;
-- SELECT 'Offers' as entity, COUNT(*) as count FROM app_template_property_offers WHERE template_id = 5;
