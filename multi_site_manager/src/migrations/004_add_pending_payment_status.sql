-- Migration: Add pending_payment status to property_bookings
-- Date: 2025-12-11
-- Description: Add 'pending_payment' status for Stripe checkout flow

ALTER TABLE property_bookings 
MODIFY COLUMN status ENUM('pending', 'pending_payment', 'confirmed', 'cancelled', 'completed', 'rejected') 
DEFAULT 'pending';
