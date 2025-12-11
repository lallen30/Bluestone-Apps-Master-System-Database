-- Migration: Add payment_session_id to property_bookings
-- Date: 2025-12-11
-- Description: Add column to store Stripe checkout session ID

ALTER TABLE property_bookings 
ADD COLUMN payment_session_id VARCHAR(255) NULL AFTER status,
ADD INDEX idx_payment_session_id (payment_session_id);
