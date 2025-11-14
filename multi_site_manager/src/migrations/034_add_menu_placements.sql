-- Migration: Add menu placement configuration to app_screen_assignments
-- This allows screens to be assigned to different menus (tabbar, sidebar, etc.)

-- Add menu placement columns to app_screen_assignments
ALTER TABLE app_screen_assignments
ADD COLUMN show_in_tabbar BOOLEAN DEFAULT FALSE COMMENT 'Show screen in mobile app bottom tabbar',
ADD COLUMN tabbar_order INT DEFAULT NULL COMMENT 'Order in tabbar (NULL = not in tabbar)',
ADD COLUMN tabbar_icon VARCHAR(50) DEFAULT NULL COMMENT 'Icon name for tabbar',
ADD COLUMN tabbar_label VARCHAR(50) DEFAULT NULL COMMENT 'Label for tabbar',
ADD COLUMN show_in_sidebar BOOLEAN DEFAULT FALSE COMMENT 'Show screen in mobile app sidebar menu',
ADD COLUMN sidebar_order INT DEFAULT NULL COMMENT 'Order in sidebar menu';

-- Add index for performance
CREATE INDEX idx_menu_placements ON app_screen_assignments(app_id, show_in_tabbar, tabbar_order);
CREATE INDEX idx_sidebar ON app_screen_assignments(app_id, show_in_sidebar, sidebar_order);

-- Update existing screens to keep them in sidebar menu by default if published
UPDATE app_screen_assignments
SET show_in_sidebar = TRUE,
    sidebar_order = display_order
WHERE is_published = 1 AND is_active = 1;

SELECT 'Menu placement columns added successfully!' as message;
