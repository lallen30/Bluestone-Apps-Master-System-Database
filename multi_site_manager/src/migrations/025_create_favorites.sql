-- Create favorites/wishlist table for property listings
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id INT NOT NULL,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES property_listings(id) ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate favorites
    UNIQUE KEY unique_user_listing (user_id, listing_id),
    
    -- Indexes for performance
    INDEX idx_user_favorites_app (app_id),
    INDEX idx_user_favorites_user (user_id),
    INDEX idx_user_favorites_listing (listing_id)
);

-- Add address fields to app_users if not exists (for profile)
ALTER TABLE app_users 
ADD COLUMN IF NOT EXISTS address_line1 VARCHAR(255) DEFAULT NULL AFTER avatar_url,
ADD COLUMN IF NOT EXISTS address_line2 VARCHAR(255) DEFAULT NULL AFTER address_line1,
ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT NULL AFTER address_line2,
ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT NULL AFTER city,
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT NULL AFTER state,
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20) DEFAULT NULL AFTER country;
