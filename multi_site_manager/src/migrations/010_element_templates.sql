-- Migration: Add element templates and data sources for primitive-based rendering
-- This enables the new data-driven architecture where elements are composed from primitives

-- Element templates table - stores reusable element compositions
CREATE TABLE IF NOT EXISTS element_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  element_type VARCHAR(50) NOT NULL UNIQUE,  -- The element_type this template defines
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  template JSON NOT NULL,  -- The primitive composition (ElementDefinition)
  default_config JSON,  -- Default config values
  data_bindings JSON,  -- Default data bindings
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_element_type (element_type),
  INDEX idx_category (category)
);

-- Screen data sources - defines what data a screen needs
CREATE TABLE IF NOT EXISTS screen_data_sources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  screen_id INT NOT NULL,
  source_name VARCHAR(50) NOT NULL,  -- e.g., "listing", "reviews", "user"
  endpoint VARCHAR(255) NOT NULL,  -- API endpoint pattern, e.g., "/apps/{app_id}/listings/{listing_id}"
  method ENUM('GET', 'POST') DEFAULT 'GET',
  params_from_route JSON,  -- Route params to use, e.g., ["listing_id"]
  params_from_config JSON,  -- Static params from config
  refresh_on_focus BOOLEAN DEFAULT FALSE,
  cache_duration INT DEFAULT 0,  -- Cache in seconds, 0 = no cache
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (screen_id) REFERENCES app_screens(id) ON DELETE CASCADE,
  UNIQUE KEY unique_screen_source (screen_id, source_name)
);

-- Add new columns to screen_element_instances for primitive support
-- Using separate statements and ignoring errors if columns exist
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'screen_element_instances' AND COLUMN_NAME = 'primitive_type') = 0,
  'ALTER TABLE screen_element_instances ADD COLUMN primitive_type VARCHAR(50) COMMENT "Base primitive type if using new renderer"',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'screen_element_instances' AND COLUMN_NAME = 'data_bindings') = 0,
  'ALTER TABLE screen_element_instances ADD COLUMN data_bindings JSON COMMENT "Data binding expressions"',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'screen_element_instances' AND COLUMN_NAME = 'children') = 0,
  'ALTER TABLE screen_element_instances ADD COLUMN children JSON COMMENT "Nested element definitions"',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'screen_element_instances' AND COLUMN_NAME = 'conditions') = 0,
  'ALTER TABLE screen_element_instances ADD COLUMN conditions JSON COMMENT "Show/hide conditions"',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add column to app_screens to indicate which renderer to use
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'app_screens' AND COLUMN_NAME = 'use_primitive_renderer') = 0,
  'ALTER TABLE app_screens ADD COLUMN use_primitive_renderer BOOLEAN DEFAULT FALSE COMMENT "Use new primitive-based renderer"',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert base primitive types as element templates
INSERT INTO element_templates (element_type, name, category, template, default_config) VALUES
-- Layout primitives
('Container', 'Container', 'layout', '{"type": "Container"}', '{"padding": 16}'),
('Row', 'Row', 'layout', '{"type": "Row"}', '{"alignItems": "center", "gap": 8}'),
('Column', 'Column', 'layout', '{"type": "Column"}', '{"gap": 8}'),
('Card', 'Card', 'layout', '{"type": "Card"}', '{"padding": 16, "shadow": true}'),
('Spacer', 'Spacer', 'layout', '{"type": "Spacer"}', '{"height": 16}'),

-- Content primitives
('Text', 'Text', 'content', '{"type": "Text"}', '{"fontSize": 16, "color": "#1C1C1E"}'),
('Heading', 'Heading', 'content', '{"type": "Heading"}', '{"level": "h2", "color": "#1C1C1E"}'),
('Image', 'Image', 'content', '{"type": "Image"}', '{"resizeMode": "cover"}'),
('Icon', 'Icon', 'content', '{"type": "Icon"}', '{"size": 24, "color": "#1C1C1E"}'),
('Avatar', 'Avatar', 'content', '{"type": "Avatar"}', '{"size": 48}'),
('Divider', 'Divider', 'content', '{"type": "Divider"}', '{"color": "#E5E5EA"}'),

-- Interactive primitives
('Button', 'Button', 'interactive', '{"type": "Button"}', '{"variant": "primary", "size": "medium"}'),
('Link', 'Link', 'interactive', '{"type": "Link"}', '{"color": "#007AFF"}'),

-- Input primitives
('TextInput', 'Text Input', 'input', '{"type": "TextInput"}', '{}'),
('Dropdown', 'Dropdown', 'input', '{"type": "Dropdown"}', '{}'),
('Switch', 'Switch', 'input', '{"type": "Switch"}', '{}'),

-- Composite primitives
('ImageGallery', 'Image Gallery', 'composite', '{"type": "ImageGallery"}', '{"height": 300, "showPagination": true}'),
('RatingDisplay', 'Rating Display', 'composite', '{"type": "RatingDisplay"}', '{"maxRating": 5, "size": 16}'),
('PriceDisplay', 'Price Display', 'composite', '{"type": "PriceDisplay"}', '{"currency": "USD"}'),
('DataField', 'Data Field', 'composite', '{"type": "DataField"}', '{}'),
('ActionBar', 'Action Bar', 'composite', '{"type": "ActionBar"}', '{"position": "bottom"}'),
('List', 'List', 'composite', '{"type": "List"}', '{"separator": true}')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Create a sample property_detail_v2 template using primitives
INSERT INTO element_templates (element_type, name, category, description, template, data_bindings) VALUES
('property_detail_v2', 'Property Detail (Primitives)', 'property', 
 'Property detail view built from primitives - fully configurable',
 '{
   "type": "Column",
   "children": [
     {
       "type": "ImageGallery",
       "config": {"height": 300, "showPagination": true, "showFavoriteButton": true},
       "data_binding": {"dataSource": "$.images"}
     },
     {
       "type": "Container",
       "config": {"padding": 16},
       "children": [
         {
           "type": "Heading",
           "config": {"level": "h1"},
           "data_binding": {"text": "$.title"}
         },
         {
           "type": "Row",
           "config": {"gap": 4},
           "children": [
             {"type": "Icon", "config": {"name": "map-marker", "size": 16, "color": "#8E8E93"}},
             {"type": "Text", "data_binding": {"text": "$.city, $.state"}}
           ]
         },
         {
           "type": "RatingDisplay",
           "data_binding": {"rating": "$.average_rating", "reviewCount": "$.total_reviews"}
         },
         {
           "type": "Card",
           "config": {"marginVertical": 16},
           "children": [
             {"type": "Text", "config": {"color": "#007AFF", "fontWeight": "600"}, "data_binding": {"text": "$.property_type"}},
             {
               "type": "Row",
               "config": {"justifyContent": "space-around", "marginTop": 12},
               "children": [
                 {"type": "Column", "config": {"alignItems": "center"}, "children": [
                   {"type": "Icon", "config": {"name": "bed", "color": "#007AFF"}},
                   {"type": "Text", "config": {"fontWeight": "700"}, "data_binding": {"text": "$.bedrooms"}},
                   {"type": "Text", "config": {"fontSize": 12, "color": "#8E8E93"}, "data_binding": {"text": "Bedrooms"}}
                 ]},
                 {"type": "Column", "config": {"alignItems": "center"}, "children": [
                   {"type": "Icon", "config": {"name": "shower", "color": "#007AFF"}},
                   {"type": "Text", "config": {"fontWeight": "700"}, "data_binding": {"text": "$.bathrooms"}},
                   {"type": "Text", "config": {"fontSize": 12, "color": "#8E8E93"}, "data_binding": {"text": "Bathrooms"}}
                 ]},
                 {"type": "Column", "config": {"alignItems": "center"}, "children": [
                   {"type": "Icon", "config": {"name": "account-group", "color": "#007AFF"}},
                   {"type": "Text", "config": {"fontWeight": "700"}, "data_binding": {"text": "$.guests_max"}},
                   {"type": "Text", "config": {"fontSize": 12, "color": "#8E8E93"}, "data_binding": {"text": "Guests"}}
                 ]}
               ]
             }
           ]
         },
         {
           "type": "Heading",
           "config": {"level": "h3", "text": "About this place"}
         },
         {
           "type": "Text",
           "config": {"lineHeight": 24},
           "data_binding": {"text": "$.description"}
         }
       ]
     }
   ]
 }',
 '{}')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
