-- Migration: Add template_id to apps table
-- This allows the admin portal to show template-specific features

-- Add template_id column to apps
ALTER TABLE apps
ADD COLUMN template_id INT NULL AFTER name,
ADD CONSTRAINT fk_apps_template FOREIGN KEY (template_id) 
  REFERENCES app_templates(id) 
  ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_apps_template_id ON apps(template_id);

-- Update existing app if it's using Property Rental template
-- You can update this manually for specific apps
-- UPDATE apps SET template_id = 9 WHERE id = 27; -- Example
