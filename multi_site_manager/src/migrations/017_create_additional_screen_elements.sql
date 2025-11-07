-- ============================================
-- Additional Screen Elements
-- Migration: 017
-- Created: Nov 7, 2025
-- Description: Add more useful screen elements for mobile apps
-- ============================================

INSERT INTO screen_elements (name, element_type, category, icon, description, is_input_field, display_order, default_config) VALUES

-- NAVIGATION & LAYOUT ELEMENTS (64-73)
('Tab Bar', 'tab_bar', 'Navigation', 'Menu', 'Bottom navigation tabs', 0, 64, JSON_OBJECT(
    'tabs', JSON_ARRAY(
        JSON_OBJECT('key', 'home', 'label', 'Home', 'icon', 'Home'),
        JSON_OBJECT('key', 'search', 'label', 'Search', 'icon', 'Search'),
        JSON_OBJECT('key', 'profile', 'label', 'Profile', 'icon', 'User')
    ),
    'position', 'bottom',
    'show_labels', true,
    'active_color', '#007AFF',
    'inactive_color', '#8E8E93'
)),

('Navigation Header', 'navigation_header', 'Navigation', 'Navigation', 'Top navigation bar with title and actions', 0, 65, JSON_OBJECT(
    'show_back_button', true,
    'show_title', true,
    'show_search', false,
    'show_menu', false,
    'background_color', '#FFFFFF',
    'text_color', '#000000'
)),

('Drawer Menu', 'drawer_menu', 'Navigation', 'Menu', 'Side drawer navigation menu', 0, 66, JSON_OBJECT(
    'position', 'left',
    'show_header', true,
    'show_user_info', true,
    'menu_items', JSON_ARRAY(
        JSON_OBJECT('key', 'home', 'label', 'Home', 'icon', 'Home'),
        JSON_OBJECT('key', 'settings', 'label', 'Settings', 'icon', 'Settings')
    )
)),

('Breadcrumb', 'breadcrumb', 'Navigation', 'ChevronRight', 'Breadcrumb navigation trail', 0, 67, JSON_OBJECT(
    'separator', '/',
    'show_home', true,
    'max_items', 5
)),

('Pagination', 'pagination', 'Navigation', 'MoreHorizontal', 'Page navigation controls', 0, 68, JSON_OBJECT(
    'items_per_page', 10,
    'show_page_numbers', true,
    'show_prev_next', true,
    'show_first_last', true
)),

('Stepper Navigation', 'stepper_navigation', 'Navigation', 'GitCommit', 'Multi-step process navigation', 0, 69, JSON_OBJECT(
    'steps', JSON_ARRAY(
        JSON_OBJECT('key', 'step1', 'label', 'Step 1'),
        JSON_OBJECT('key', 'step2', 'label', 'Step 2'),
        JSON_OBJECT('key', 'step3', 'label', 'Step 3')
    ),
    'orientation', 'horizontal',
    'show_numbers', true,
    'allow_skip', false
)),

-- DISPLAY ELEMENTS (70-85)
('Avatar', 'avatar', 'Display', 'User', 'User avatar/profile picture', 0, 70, JSON_OBJECT(
    'size', 'medium',
    'shape', 'circle',
    'show_badge', false,
    'show_border', true,
    'fallback_icon', 'User'
)),

('Badge', 'badge', 'Display', 'Tag', 'Small status or count badge', 0, 71, JSON_OBJECT(
    'variant', 'default',
    'color', '#FF3B30',
    'position', 'top-right',
    'show_count', true,
    'max_count', 99
)),

('Chip', 'chip', 'Display', 'Tag', 'Compact element for tags or filters', 0, 72, JSON_OBJECT(
    'variant', 'filled',
    'color', '#007AFF',
    'show_icon', false,
    'show_close', false,
    'size', 'medium'
)),

('Alert Banner', 'alert_banner', 'Display', 'AlertCircle', 'Alert or notification banner', 0, 73, JSON_OBJECT(
    'type', 'info',
    'dismissible', true,
    'show_icon', true,
    'position', 'top',
    'auto_dismiss', false,
    'duration', 5000
)),

('Tooltip', 'tooltip', 'Display', 'Info', 'Hover tooltip with information', 0, 74, JSON_OBJECT(
    'position', 'top',
    'trigger', 'hover',
    'show_arrow', true,
    'delay', 200
)),

('Skeleton Loader', 'skeleton_loader', 'Display', 'Loader', 'Loading placeholder skeleton', 0, 75, JSON_OBJECT(
    'variant', 'text',
    'animation', 'pulse',
    'rows', 3,
    'show_avatar', false
)),

('Empty State', 'empty_state', 'Display', 'Inbox', 'Empty state placeholder', 0, 76, JSON_OBJECT(
    'show_icon', true,
    'icon', 'Inbox',
    'title', 'No items found',
    'description', 'Try adjusting your filters',
    'show_action', true,
    'action_label', 'Add New'
)),

('Accordion', 'accordion', 'Display', 'ChevronDown', 'Expandable content sections', 0, 77, JSON_OBJECT(
    'allow_multiple', false,
    'default_expanded', false,
    'show_icon', true,
    'icon_position', 'right'
)),

('Carousel', 'carousel', 'Display', 'Image', 'Image or content carousel', 0, 78, JSON_OBJECT(
    'auto_play', false,
    'interval', 3000,
    'show_indicators', true,
    'show_arrows', true,
    'infinite_loop', true
)),

('Timeline', 'timeline', 'Display', 'Clock', 'Vertical timeline display', 0, 79, JSON_OBJECT(
    'orientation', 'vertical',
    'show_icons', true,
    'show_dates', true,
    'alternate_sides', false
)),

('Table', 'table', 'Display', 'Table', 'Data table display', 0, 80, JSON_OBJECT(
    'sortable', true,
    'filterable', false,
    'paginated', true,
    'rows_per_page', 10,
    'show_header', true,
    'striped', true
)),

('Data Grid', 'data_grid', 'Display', 'Grid', 'Grid layout for items', 0, 81, JSON_OBJECT(
    'columns', 2,
    'gap', 16,
    'responsive', true,
    'min_column_width', 150
)),

('Map View', 'map_view', 'Display', 'Map', 'Interactive map display', 0, 82, JSON_OBJECT(
    'default_zoom', 12,
    'show_markers', true,
    'show_controls', true,
    'allow_zoom', true,
    'allow_pan', true
)),

('Video Player', 'video_player', 'Media', 'Video', 'Video player with controls', 0, 83, JSON_OBJECT(
    'show_controls', true,
    'auto_play', false,
    'loop', false,
    'muted', false,
    'show_fullscreen', true
)),

('Audio Player', 'audio_player', 'Media', 'Music', 'Audio player with controls', 0, 84, JSON_OBJECT(
    'show_controls', true,
    'show_progress', true,
    'show_volume', true,
    'show_playlist', false
)),

('QR Code Display', 'qr_code_display', 'Display', 'QrCode', 'Display QR code', 0, 85, JSON_OBJECT(
    'size', 200,
    'error_correction', 'M',
    'foreground_color', '#000000',
    'background_color', '#FFFFFF'
)),

-- INPUT ELEMENTS (86-100)
('Search Bar', 'search_bar', 'Input', 'Search', 'Search input with icon', 1, 86, JSON_OBJECT(
    'placeholder', 'Search...',
    'show_icon', true,
    'show_clear', true,
    'debounce', 300,
    'min_characters', 2
)),

('Autocomplete', 'autocomplete', 'Input', 'Search', 'Input with suggestions', 1, 87, JSON_OBJECT(
    'min_characters', 2,
    'max_suggestions', 5,
    'show_icon', true,
    'allow_custom', false
)),

('Range Slider', 'range_slider', 'Input', 'SlidersHorizontal', 'Range selection slider', 1, 88, JSON_OBJECT(
    'min', 0,
    'max', 100,
    'step', 1,
    'show_labels', true,
    'show_value', true,
    'dual_handles', false
)),

('Star Rating Input', 'star_rating_input', 'Input', 'Star', 'Star rating input', 1, 89, JSON_OBJECT(
    'max_stars', 5,
    'allow_half', false,
    'size', 'medium',
    'color', '#FFD700',
    'show_value', true
)),

('Image Picker', 'image_picker', 'Input', 'Image', 'Multiple image selection', 1, 90, JSON_OBJECT(
    'max_images', 5,
    'allow_camera', true,
    'allow_gallery', true,
    'show_preview', true,
    'max_size_mb', 10
)),

('Video Picker', 'video_picker', 'Input', 'Video', 'Video file selection', 1, 90, JSON_OBJECT(
    'max_videos', 1,
    'allow_camera', true,
    'allow_gallery', true,
    'max_duration_seconds', 60,
    'max_size_mb', 50
)),

('Document Picker', 'document_picker', 'Input', 'FileText', 'Document file selection', 1, 91, JSON_OBJECT(
    'allowed_types', JSON_ARRAY('pdf', 'doc', 'docx', 'txt'),
    'max_files', 3,
    'max_size_mb', 10,
    'show_preview', true
)),

('Rich Text Editor', 'rich_text_input', 'Input', 'Type', 'Rich text editing input', 1, 92, JSON_OBJECT(
    'toolbar', JSON_ARRAY('bold', 'italic', 'underline', 'link', 'list'),
    'min_height', 150,
    'max_height', 400,
    'placeholder', 'Enter text...'
)),

('Code Editor', 'code_editor', 'Input', 'Code', 'Code editing input', 1, 93, JSON_OBJECT(
    'language', 'javascript',
    'theme', 'light',
    'line_numbers', true,
    'syntax_highlighting', true,
    'auto_complete', true
)),

('Mention Input', 'mention_input', 'Input', 'AtSign', 'Input with @mentions', 1, 94, JSON_OBJECT(
    'trigger', '@',
    'show_suggestions', true,
    'max_suggestions', 5,
    'highlight_mentions', true
)),

('Hashtag Input', 'hashtag_input', 'Input', 'Hash', 'Input with #hashtags', 1, 95, JSON_OBJECT(
    'trigger', '#',
    'show_suggestions', true,
    'max_suggestions', 5,
    'highlight_hashtags', true
)),

-- INTERACTIVE ELEMENTS (96-105)
('Modal', 'modal', 'Interactive', 'Square', 'Modal dialog overlay', 0, 96, JSON_OBJECT(
    'size', 'medium',
    'closable', true,
    'backdrop_dismissible', true,
    'show_close_button', true,
    'centered', true
)),

('Bottom Sheet', 'bottom_sheet', 'Interactive', 'PanelBottom', 'Bottom sliding panel', 0, 97, JSON_OBJECT(
    'height', 'auto',
    'dismissible', true,
    'show_handle', true,
    'snap_points', JSON_ARRAY(0.5, 0.9)
)),

('Action Sheet', 'action_sheet', 'Interactive', 'List', 'Action selection sheet', 0, 98, JSON_OBJECT(
    'title', 'Choose an action',
    'cancelable', true,
    'destructive_index', -1,
    'show_icons', true
)),

('Context Menu', 'context_menu', 'Interactive', 'MoreVertical', 'Right-click context menu', 0, 99, JSON_OBJECT(
    'trigger', 'right-click',
    'show_icons', true,
    'close_on_select', true
)),

('Popover', 'popover', 'Interactive', 'MessageSquare', 'Popover content overlay', 0, 100, JSON_OBJECT(
    'trigger', 'click',
    'position', 'bottom',
    'show_arrow', true,
    'close_on_outside_click', true
)),

('Snackbar', 'snackbar', 'Interactive', 'MessageCircle', 'Temporary notification message', 0, 101, JSON_OBJECT(
    'position', 'bottom',
    'duration', 3000,
    'action_label', '',
    'dismissible', true
)),

('Toast', 'toast', 'Interactive', 'Bell', 'Toast notification', 0, 102, JSON_OBJECT(
    'position', 'top-right',
    'duration', 3000,
    'type', 'info',
    'dismissible', true,
    'show_icon', true
)),

('Pull to Refresh', 'pull_to_refresh', 'Interactive', 'RefreshCw', 'Pull down to refresh content', 0, 103, JSON_OBJECT(
    'enabled', true,
    'threshold', 80,
    'show_spinner', true
)),

('Infinite Scroll', 'infinite_scroll', 'Interactive', 'ArrowDown', 'Load more on scroll', 0, 104, JSON_OBJECT(
    'threshold', 200,
    'show_loader', true,
    'initial_load', true
)),

('Swipe Actions', 'swipe_actions', 'Interactive', 'Move', 'Swipeable list item actions', 0, 105, JSON_OBJECT(
    'left_actions', JSON_ARRAY(),
    'right_actions', JSON_ARRAY(
        JSON_OBJECT('key', 'delete', 'label', 'Delete', 'color', '#FF3B30', 'icon', 'Trash')
    ),
    'threshold', 0.5
));

-- ============================================
-- Verify insertion
-- ============================================
SELECT 
    COUNT(*) as total_elements,
    MAX(id) as last_id
FROM screen_elements;

SELECT 
    category,
    COUNT(*) as count
FROM screen_elements
GROUP BY category
ORDER BY count DESC;
