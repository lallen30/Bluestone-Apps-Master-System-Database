
-- Migration: Add Stripe Connect account id to app_users
-- Adds an optional column to store the connected Stripe account ID for hosts
-- This migration uses a small stored-procedure wrapper so it works on
-- MySQL versions that do not support `ADD COLUMN IF NOT EXISTS`.

DELIMITER $$
DROP PROCEDURE IF EXISTS add_stripe_account_col$$
CREATE PROCEDURE add_stripe_account_col()
BEGIN
	IF NOT EXISTS (
		SELECT * FROM INFORMATION_SCHEMA.COLUMNS
		WHERE TABLE_SCHEMA = DATABASE()
			AND TABLE_NAME = 'app_users'
			AND COLUMN_NAME = 'stripe_account_id'
	) THEN
		ALTER TABLE app_users
			ADD COLUMN stripe_account_id VARCHAR(255) NULL AFTER avatar_url;
	END IF;
END$$
CALL add_stripe_account_col()$$
DROP PROCEDURE IF EXISTS add_stripe_account_col$$
DELIMITER ;

