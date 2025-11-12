-- Add auto_sync_enabled column to app_screen_assignments
-- This controls whether new master elements automatically appear on the app's screen

ALTER TABLE app_screen_assignments 
ADD COLUMN auto_sync_enabled BOOLEAN DEFAULT TRUE COMMENT 'If false, new master elements are automatically hidden for this app screen';

-- Add index for faster lookups
CREATE INDEX idx_app_screen_auto_sync ON app_screen_assignments(app_id, screen_id, auto_sync_enabled);
