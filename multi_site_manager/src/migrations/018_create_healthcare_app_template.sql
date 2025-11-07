-- ============================================
-- Healthcare/Medical App Template
-- Migration: 018
-- Created: Nov 7, 2025
-- Description: Complete template for healthcare and telemedicine apps
--              (like Zocdoc, Teladoc, MyChart, HealthTap)
-- ============================================

-- Create the Healthcare App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Healthcare & Telemedicine', 'Complete template for healthcare and telemedicine applications. Includes appointment booking, medical records, prescriptions, video consultations, and health tracking.', 'Health & Fitness', 'Heart', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- AUTHENTICATION & ONBOARDING (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 1, 0, NOW()),
(@template_id, 'Onboarding', 'onboarding', 'Health app introduction', 'BookOpen', 'Onboarding', 2, 0, NOW()),
(@template_id, 'Login', 'login', 'Secure login', 'LogIn', 'Authentication', 3, 0, NOW()),
(@template_id, 'Sign Up', 'sign_up', 'Create account', 'UserPlus', 'Authentication', 4, 0, NOW()),
(@template_id, 'Forgot Password', 'forgot_password', 'Password recovery', 'Key', 'Authentication', 5, 0, NOW()),
(@template_id, 'Email Verification', 'email_verification', 'Verify email', 'Mail', 'Authentication', 6, 0, NOW());

-- MAIN DASHBOARD (1 screen)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Health Dashboard', 'health_dashboard', 'Main health overview with vitals and appointments', 'Activity', 'Navigation', 7, 1, NOW());

-- APPOINTMENTS (7 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Find Doctor', 'find_doctor', 'Search for healthcare providers', 'Search', 'Appointments', 8, 0, NOW()),
(@template_id, 'Doctor Profile', 'doctor_profile', 'View doctor details and reviews', 'User', 'Appointments', 9, 0, NOW()),
(@template_id, 'Book Appointment', 'book_appointment', 'Schedule appointment with doctor', 'Calendar', 'Appointments', 10, 0, NOW()),
(@template_id, 'Appointment Confirmation', 'appointment_confirmation', 'Booking confirmation', 'CheckCircle', 'Appointments', 11, 0, NOW()),
(@template_id, 'My Appointments', 'my_appointments', 'List of upcoming and past appointments', 'List', 'Appointments', 12, 0, NOW()),
(@template_id, 'Appointment Details', 'appointment_details', 'Detailed appointment information', 'FileText', 'Appointments', 13, 0, NOW()),
(@template_id, 'Reschedule Appointment', 'reschedule_appointment', 'Change appointment time', 'Clock', 'Appointments', 14, 0, NOW());

-- TELEMEDICINE (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Video Consultation', 'video_consultation', 'Live video call with doctor', 'Video', 'Telemedicine', 15, 0, NOW()),
(@template_id, 'Waiting Room', 'waiting_room', 'Virtual waiting room', 'Clock', 'Telemedicine', 16, 0, NOW()),
(@template_id, 'Chat with Doctor', 'chat_with_doctor', 'Text messaging with provider', 'MessageCircle', 'Telemedicine', 17, 0, NOW()),
(@template_id, 'Consultation Summary', 'consultation_summary', 'Post-consultation notes', 'FileText', 'Telemedicine', 18, 0, NOW());

-- MEDICAL RECORDS (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Medical Records', 'medical_records', 'View health records', 'Folder', 'Records', 19, 0, NOW()),
(@template_id, 'Lab Results', 'lab_results', 'View test results', 'Activity', 'Records', 20, 0, NOW()),
(@template_id, 'Prescriptions', 'prescriptions', 'View and refill prescriptions', 'Pill', 'Records', 21, 0, NOW()),
(@template_id, 'Immunization Records', 'immunization_records', 'Vaccination history', 'Shield', 'Records', 22, 0, NOW()),
(@template_id, 'Allergies', 'allergies', 'Manage allergy information', 'AlertTriangle', 'Records', 23, 0, NOW()),
(@template_id, 'Medical History', 'medical_history', 'Past conditions and treatments', 'Clock', 'Records', 24, 0, NOW());

-- HEALTH TRACKING (8 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Health Metrics', 'health_metrics', 'Track vital signs', 'TrendingUp', 'Tracking', 25, 0, NOW()),
(@template_id, 'Blood Pressure Log', 'blood_pressure_log', 'Record blood pressure', 'Activity', 'Tracking', 26, 0, NOW()),
(@template_id, 'Blood Glucose Log', 'blood_glucose_log', 'Track blood sugar', 'Droplet', 'Tracking', 27, 0, NOW()),
(@template_id, 'Weight Tracker', 'weight_tracker', 'Monitor weight changes', 'TrendingUp', 'Tracking', 28, 0, NOW()),
(@template_id, 'Medication Tracker', 'medication_tracker', 'Track medication intake', 'Pill', 'Tracking', 29, 0, NOW()),
(@template_id, 'Symptom Checker', 'symptom_checker', 'Check symptoms', 'Search', 'Tracking', 30, 0, NOW()),
(@template_id, 'Health Goals', 'health_goals', 'Set and track health goals', 'Target', 'Tracking', 31, 0, NOW()),
(@template_id, 'Activity Log', 'activity_log', 'Track physical activity', 'Activity', 'Tracking', 32, 0, NOW());

-- PHARMACY (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Pharmacy Locator', 'pharmacy_locator', 'Find nearby pharmacies', 'MapPin', 'Pharmacy', 33, 0, NOW()),
(@template_id, 'Order Medication', 'order_medication', 'Order prescription refills', 'ShoppingCart', 'Pharmacy', 34, 0, NOW()),
(@template_id, 'Medication Reminders', 'medication_reminders', 'Set pill reminders', 'Bell', 'Pharmacy', 35, 0, NOW()),
(@template_id, 'Pharmacy Orders', 'pharmacy_orders', 'Track medication orders', 'Package', 'Pharmacy', 36, 0, NOW());

-- INSURANCE & BILLING (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Insurance Information', 'insurance_information', 'Manage insurance details', 'CreditCard', 'Insurance', 37, 0, NOW()),
(@template_id, 'Insurance Card', 'insurance_card', 'Digital insurance card', 'CreditCard', 'Insurance', 38, 0, NOW()),
(@template_id, 'Bills & Payments', 'bills_payments', 'View and pay medical bills', 'DollarSign', 'Insurance', 39, 0, NOW()),
(@template_id, 'Payment Methods', 'payment_methods', 'Manage payment options', 'CreditCard', 'Insurance', 40, 0, NOW()),
(@template_id, 'Claims History', 'claims_history', 'View insurance claims', 'FileText', 'Insurance', 41, 0, NOW());

-- FAMILY & DEPENDENTS (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Family Members', 'family_members', 'Manage family profiles', 'Users', 'Family', 42, 0, NOW()),
(@template_id, 'Add Family Member', 'add_family_member', 'Add dependent', 'UserPlus', 'Family', 43, 0, NOW()),
(@template_id, 'Switch Profile', 'switch_profile', 'Switch between family members', 'RefreshCw', 'Family', 44, 0, NOW());

-- NOTIFICATIONS & REMINDERS (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'Health alerts and reminders', 'Bell', 'Notifications', 45, 0, NOW()),
(@template_id, 'Appointment Reminders', 'appointment_reminders', 'Upcoming appointment alerts', 'Clock', 'Notifications', 46, 0, NOW());

-- PROFILE & SETTINGS (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'User Profile', 'user_profile', 'View profile', 'User', 'Profile', 47, 0, NOW()),
(@template_id, 'Edit Profile', 'edit_profile', 'Update personal information', 'Edit', 'Profile', 48, 0, NOW()),
(@template_id, 'Settings', 'settings', 'App preferences', 'Settings', 'Settings', 49, 0, NOW()),
(@template_id, 'Privacy Settings', 'privacy_settings', 'Health data privacy', 'Lock', 'Settings', 50, 0, NOW());

-- SUPPORT & INFORMATION (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Help Center', 'help_center', 'FAQ and support', 'HelpCircle', 'Support', 51, 0, NOW()),
(@template_id, 'Contact Support', 'contact_us', 'Contact customer support', 'Mail', 'Support', 52, 0, NOW()),
(@template_id, 'About Us', 'about_us', 'App information', 'Info', 'Information', 53, 0, NOW()),
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms', 'FileText', 'Legal', 54, 0, NOW()),
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy', 'Shield', 'Legal', 55, 0, NOW());

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 
    t.id,
    t.name,
    t.category,
    t.icon,
    COUNT(ts.id) as screen_count
FROM app_templates t
LEFT JOIN app_template_screens ts ON t.id = ts.template_id
WHERE t.id = @template_id
GROUP BY t.id, t.name, t.category, t.icon;

SELECT 
    screen_category,
    COUNT(*) as screen_count
FROM app_template_screens
WHERE template_id = @template_id
GROUP BY screen_category
ORDER BY screen_count DESC;

SELECT 'Healthcare & Telemedicine App Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
