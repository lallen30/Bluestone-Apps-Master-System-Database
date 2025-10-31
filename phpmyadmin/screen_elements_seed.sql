-- Seed data for screen_elements table
-- These are the available element types that master admins can add to screens

INSERT INTO `screen_elements` (`name`, `element_type`, `category`, `icon`, `description`, `is_editable_by_app_admin`, `has_options`, `is_content_field`, `is_input_field`, `display_order`) VALUES

-- Text Input Elements
('Text Field', 'text_field', 'Input', 'Type', 'Single line text input', 1, 0, 0, 1, 1),
('Text Area', 'text_area', 'Input', 'AlignLeft', 'Multi-line text input', 1, 0, 0, 1, 2),
('Rich Text Editor', 'rich_text_editor', 'Content', 'FileText', 'Text area with formatting toolbar', 1, 0, 1, 0, 3),
('Email Input', 'email_input', 'Input', 'Mail', 'Email address with validation', 1, 0, 0, 1, 4),
('Phone Input', 'phone_input', 'Input', 'Phone', 'Phone number with formatting', 1, 0, 0, 1, 5),
('URL Input', 'url_input', 'Input', 'Link', 'URL with validation', 1, 0, 0, 1, 6),
('Password Input', 'password_input', 'Input', 'Lock', 'Masked password field', 0, 0, 0, 1, 7),
('Number Input', 'number_input', 'Input', 'Hash', 'Numeric input with min/max', 1, 0, 0, 1, 8),
('Currency Input', 'currency_input', 'Input', 'DollarSign', 'Money input with formatting', 1, 0, 0, 1, 9),

-- Selection Elements
('Dropdown', 'dropdown', 'Selection', 'ChevronDown', 'Single selection dropdown', 1, 1, 0, 1, 10),
('Multi-Select', 'multi_select', 'Selection', 'ListChecks', 'Multiple selection dropdown', 1, 1, 0, 1, 11),
('Radio Button', 'radio_button', 'Selection', 'Circle', 'Single choice from options', 1, 1, 0, 1, 12),
('Checkbox', 'checkbox', 'Selection', 'CheckSquare', 'Multiple choice from options', 1, 1, 0, 1, 13),
('Switch/Toggle', 'switch_toggle', 'Selection', 'ToggleLeft', 'On/off boolean toggle', 0, 0, 0, 1, 14),
('Country Selector', 'country_selector', 'Selection', 'Globe', 'Country dropdown with flags', 0, 0, 0, 1, 15),
('Language Selector', 'language_selector', 'Selection', 'Languages', 'Language picker', 0, 0, 0, 1, 16),

-- Date & Time Elements
('Date Picker', 'date_picker', 'DateTime', 'Calendar', 'Date selection', 0, 0, 0, 1, 20),
('Time Picker', 'time_picker', 'DateTime', 'Clock', 'Time selection', 0, 0, 0, 1, 21),
('DateTime Picker', 'datetime_picker', 'DateTime', 'CalendarClock', 'Combined date and time', 0, 0, 0, 1, 22),
('Calendar', 'calendar', 'DateTime', 'CalendarDays', 'Full calendar view', 0, 0, 0, 1, 23),

-- Media Elements
('File Upload', 'file_upload', 'Media', 'Upload', 'Single file upload', 0, 0, 0, 1, 30),
('Image Upload', 'image_upload', 'Media', 'Image', 'Image with preview', 0, 0, 0, 1, 31),
('Video Upload', 'video_upload', 'Media', 'Video', 'Video file upload', 0, 0, 0, 1, 32),
('Audio Recorder', 'audio_recorder', 'Media', 'Mic', 'Record audio', 0, 0, 0, 1, 33),
('Camera Capture', 'camera_capture', 'Media', 'Camera', 'Take photo directly', 0, 0, 0, 1, 34),
('Signature Pad', 'signature_pad', 'Media', 'PenTool', 'Digital signature', 0, 0, 0, 1, 35),

-- Content Display Elements
('Heading', 'heading', 'Content', 'Heading', 'Page heading text', 1, 0, 1, 0, 40),
('Paragraph', 'paragraph', 'Content', 'AlignLeft', 'Paragraph text content', 1, 0, 1, 0, 41),
('Rich Text Display', 'rich_text_display', 'Content', 'FileText', 'Formatted content display', 1, 0, 1, 0, 42),
('Icon', 'icon', 'Content', 'Star', 'Display icon', 1, 0, 1, 0, 43),
('Divider', 'divider', 'Content', 'Minus', 'Visual separation line', 0, 0, 1, 0, 44),
('Spacer', 'spacer', 'Content', 'Space', 'Empty space', 0, 0, 1, 0, 45),

-- Interactive Elements
('Button', 'button', 'Interactive', 'MousePointer', 'Action button', 1, 0, 1, 0, 50),
('Link', 'link', 'Interactive', 'Link2', 'Hyperlink', 1, 0, 1, 0, 51),
('Slider', 'slider', 'Interactive', 'SlidersHorizontal', 'Range selection', 1, 0, 0, 1, 52),
('Stepper', 'stepper', 'Interactive', 'PlusCircle', 'Increment/decrement', 1, 0, 0, 1, 53),
('Rating', 'rating', 'Interactive', 'Star', 'Star rating component', 0, 0, 0, 1, 54),
('Color Picker', 'color_picker', 'Interactive', 'Palette', 'Color selection', 0, 0, 0, 1, 55),

-- Advanced Elements
('Address Input', 'address_input', 'Advanced', 'MapPin', 'Structured address fields', 1, 0, 0, 1, 60),
('Location Picker', 'location_picker', 'Advanced', 'Map', 'GPS/map location', 0, 0, 0, 1, 61),
('Barcode Scanner', 'barcode_scanner', 'Advanced', 'ScanLine', 'QR/barcode scanning', 0, 0, 0, 1, 62),
('OTP Input', 'otp_input', 'Advanced', 'ShieldCheck', 'One-time password', 0, 0, 0, 1, 63),
('Tags Input', 'tags_input', 'Advanced', 'Tags', 'Multiple tag entries', 1, 0, 0, 1, 64),
('Progress Bar', 'progress_bar', 'Advanced', 'TrendingUp', 'Show progress', 1, 0, 1, 0, 65),
('Timer/Countdown', 'timer_countdown', 'Advanced', 'Timer', 'Countdown display', 1, 0, 1, 0, 66),
('Chart/Graph', 'chart_graph', 'Advanced', 'BarChart', 'Data visualization', 1, 0, 1, 0, 67);
