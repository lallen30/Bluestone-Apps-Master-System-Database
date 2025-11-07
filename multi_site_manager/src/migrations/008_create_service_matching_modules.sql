-- ============================================
-- Service Matching App - New Modules/Elements
-- Migration: 008
-- Created: Nov 7, 2025
-- ============================================

-- Add new element types for Service Matching App
INSERT INTO screen_elements (name, element_type, category, icon, description, is_input_field, display_order, default_config) VALUES

-- 1. Star Rating Display (Read-only rating display)
('Star Rating Display', 'star_rating_display', 'Display', 'Star', 'Display star rating (read-only)', 0, 47, JSON_OBJECT(
    'max_stars', 5,
    'show_value', true,
    'show_count', true,
    'size', 'medium',
    'color', '#FFD700'
)),

-- 2. Service Card (Display service with image, title, price, rating)
('Service Card', 'service_card', 'Display', 'CreditCard', 'Display service offering card', 0, 48, JSON_OBJECT(
    'show_image', true,
    'show_price', true,
    'show_rating', true,
    'show_provider', true,
    'show_distance', true,
    'card_style', 'elevated'
)),

-- 3. Job Status Badge (Visual status indicator)
('Job Status Badge', 'job_status_badge', 'Display', 'Tag', 'Display job status with color coding', 0, 49, JSON_OBJECT(
    'statuses', JSON_ARRAY(
        JSON_OBJECT('value', 'pending', 'label', 'Pending', 'color', '#FFA500'),
        JSON_OBJECT('value', 'accepted', 'label', 'Accepted', 'color', '#4CAF50'),
        JSON_OBJECT('value', 'in_progress', 'label', 'In Progress', 'color', '#2196F3'),
        JSON_OBJECT('value', 'completed', 'label', 'Completed', 'color', '#4CAF50'),
        JSON_OBJECT('value', 'cancelled', 'label', 'Cancelled', 'color', '#F44336')
    ),
    'show_icon', true,
    'size', 'medium'
)),

-- 4. Availability Grid (Weekly schedule selector)
('Availability Grid', 'availability_grid', 'Input', 'Calendar', 'Select available time slots for the week', 1, 50, JSON_OBJECT(
    'days', JSON_ARRAY('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    'time_slots', JSON_ARRAY('Morning', 'Afternoon', 'Evening'),
    'allow_custom_times', true,
    'time_format', '12h'
)),

-- 5. Quote Builder (Itemized quote/estimate)
('Quote Builder', 'quote_builder', 'Input', 'FileText', 'Build itemized quote with line items', 1, 51, JSON_OBJECT(
    'allow_add_items', true,
    'allow_remove_items', true,
    'show_subtotal', true,
    'show_tax', true,
    'show_total', true,
    'currency', 'USD',
    'tax_rate', 0
)),

-- 6. Payment Method Card (Display saved payment method)
('Payment Method Card', 'payment_method_card', 'Display', 'CreditCard', 'Display saved payment method', 0, 52, JSON_OBJECT(
    'show_last_four', true,
    'show_brand', true,
    'show_expiry', true,
    'show_default_badge', true,
    'allow_delete', true,
    'card_style', 'outlined'
)),

-- 7. Badge Display (Verification/achievement badges)
('Badge Display', 'badge_display', 'Display', 'Award', 'Display verification and achievement badges', 0, 53, JSON_OBJECT(
    'badge_types', JSON_ARRAY(
        JSON_OBJECT('type', 'verified', 'label', 'Verified', 'icon', 'CheckCircle', 'color', '#4CAF50'),
        JSON_OBJECT('type', 'background_check', 'label', 'Background Check', 'icon', 'Shield', 'color', '#2196F3'),
        JSON_OBJECT('type', 'top_rated', 'label', 'Top Rated', 'icon', 'Star', 'color', '#FFD700'),
        JSON_OBJECT('type', 'pro', 'label', 'Pro', 'icon', 'Award', 'color', '#9C27B0')
    ),
    'layout', 'horizontal',
    'show_labels', true,
    'size', 'small'
)),

-- 8. Review Card (Display customer review)
('Review Card', 'review_card', 'Display', 'MessageSquare', 'Display customer review with rating and comment', 0, 54, JSON_OBJECT(
    'show_avatar', true,
    'show_name', true,
    'show_date', true,
    'show_rating', true,
    'show_helpful_count', true,
    'allow_reply', false,
    'date_format', 'relative'
));

-- ============================================
-- Verify insertion
-- ============================================
SELECT 
    id,
    name,
    element_type,
    category,
    icon
FROM screen_elements 
WHERE element_type IN (
    'star_rating_display',
    'service_card',
    'job_status_badge',
    'availability_grid',
    'quote_builder',
    'payment_method_card',
    'badge_display',
    'review_card'
)
ORDER BY display_order;
