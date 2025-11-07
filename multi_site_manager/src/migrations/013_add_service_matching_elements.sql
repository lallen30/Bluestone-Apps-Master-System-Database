-- ============================================
-- Add Screen Elements to Service Matching Platform Template
-- Migration: 013
-- ============================================

-- Get template ID
SET @template_id = 12;

-- Get screen IDs for Service Matching Platform
SET @splash_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'splash_screen');
SET @onboarding_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'onboarding');
SET @login_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'login');
SET @signup_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'sign_up');
SET @forgot_pwd_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'forgot_password');
SET @email_verify_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'email_verification');
SET @profile_setup_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'profile_setup');
SET @dashboard_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'service_dashboard');
SET @search_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'search_services');
SET @categories_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'service_categories');
SET @provider_profile_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'provider_profile');
SET @service_details_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'service_details');
SET @request_service_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'request_service');
SET @request_details_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'request_details');
SET @send_quote_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'send_quote');
SET @schedule_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'schedule_booking');
SET @booking_confirm_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'booking_confirmation');
SET @messages_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'messages');
SET @notifications_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'notifications');
SET @active_jobs_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'active_jobs');
SET @job_details_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'job_details');
SET @job_history_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'job_history');
SET @job_tracking_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'job_tracking');
SET @payment_methods_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'payment_methods');
SET @make_payment_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'make_payment');
SET @payment_confirm_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'payment_confirmation');
SET @earnings_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'earnings');
SET @payout_settings_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'payout_settings');
SET @write_review_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'write_review');
SET @reviews_list_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'reviews_list');
SET @user_profile_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'user_profile');
SET @edit_profile_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'edit_profile');
SET @settings_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'settings');
SET @become_provider_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'become_provider');
SET @about_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'about_us');
SET @contact_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'contact_us');
SET @terms_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'terms_of_service');
SET @privacy_id = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'privacy_policy');

-- Get element IDs
SET @logo = (SELECT id FROM screen_elements WHERE element_type = 'logo_display');
SET @text = (SELECT id FROM screen_elements WHERE element_type = 'text_display');
SET @button = (SELECT id FROM screen_elements WHERE element_type = 'button');
SET @text_input = (SELECT id FROM screen_elements WHERE element_type = 'text_input');
SET @email_input = (SELECT id FROM screen_elements WHERE element_type = 'email_input');
SET @password_input = (SELECT id FROM screen_elements WHERE element_type = 'password_input');
SET @phone_input = (SELECT id FROM screen_elements WHERE element_type = 'phone_input');
SET @image = (SELECT id FROM screen_elements WHERE element_type = 'image_display');
SET @search_bar = (SELECT id FROM screen_elements WHERE element_type = 'search_bar');
SET @list_view = (SELECT id FROM screen_elements WHERE element_type = 'list_view');
SET @card = (SELECT id FROM screen_elements WHERE element_type = 'card');
SET @textarea = (SELECT id FROM screen_elements WHERE element_type = 'textarea');
SET @dropdown = (SELECT id FROM screen_elements WHERE element_type = 'dropdown');
SET @date_picker = (SELECT id FROM screen_elements WHERE element_type = 'date_picker');
SET @time_picker = (SELECT id FROM screen_elements WHERE element_type = 'time_picker');
SET @checkbox = (SELECT id FROM screen_elements WHERE element_type = 'checkbox');
SET @radio = (SELECT id FROM screen_elements WHERE element_type = 'radio_button');
SET @image_upload = (SELECT id FROM screen_elements WHERE element_type = 'image_upload');
SET @star_rating = (SELECT id FROM screen_elements WHERE element_type = 'star_rating_display');
SET @service_card = (SELECT id FROM screen_elements WHERE element_type = 'service_card');
SET @job_status = (SELECT id FROM screen_elements WHERE element_type = 'job_status_badge');
SET @availability = (SELECT id FROM screen_elements WHERE element_type = 'availability_grid');
SET @quote_builder = (SELECT id FROM screen_elements WHERE element_type = 'quote_builder');
SET @payment_card = (SELECT id FROM screen_elements WHERE element_type = 'payment_method_card');
SET @badge_display = (SELECT id FROM screen_elements WHERE element_type = 'badge_display');
SET @review_card = (SELECT id FROM screen_elements WHERE element_type = 'review_card');

-- Splash Screen
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@splash_id, @logo, 1),
(@splash_id, @text, 2);

-- Onboarding
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@onboarding_id, @image, 1),
(@onboarding_id, @text, 2),
(@onboarding_id, @button, 3);

-- Login
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@login_id, @logo, 1),
(@login_id, @text, 2),
(@login_id, @email_input, 3),
(@login_id, @password_input, 4),
(@login_id, @button, 5),
(@login_id, @button, 6);

-- Sign Up
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@signup_id, @logo, 1),
(@signup_id, @text, 2),
(@signup_id, @text_input, 3),
(@signup_id, @email_input, 4),
(@signup_id, @phone_input, 5),
(@signup_id, @password_input, 6),
(@signup_id, @radio, 7),
(@signup_id, @checkbox, 8),
(@signup_id, @button, 9);

-- Forgot Password
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@forgot_pwd_id, @text, 1),
(@forgot_pwd_id, @email_input, 2),
(@forgot_pwd_id, @button, 3);

-- Email Verification
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@email_verify_id, @text, 1),
(@email_verify_id, @text_input, 2),
(@email_verify_id, @button, 3);

-- Profile Setup
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@profile_setup_id, @text, 1),
(@profile_setup_id, @image_upload, 2),
(@profile_setup_id, @text_input, 3),
(@profile_setup_id, @textarea, 4),
(@profile_setup_id, @radio, 5),
(@profile_setup_id, @button, 6);

-- Service Dashboard
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@dashboard_id, @text, 1),
(@dashboard_id, @search_bar, 2),
(@dashboard_id, @service_card, 3),
(@dashboard_id, @list_view, 4),
(@dashboard_id, @button, 5);

-- Search Services
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@search_id, @search_bar, 1),
(@search_id, @dropdown, 2),
(@search_id, @service_card, 3),
(@search_id, @list_view, 4);

-- Service Categories
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@categories_id, @text, 1),
(@categories_id, @card, 2),
(@categories_id, @list_view, 3);

-- Provider Profile
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@provider_profile_id, @image, 1),
(@provider_profile_id, @text, 2),
(@provider_profile_id, @star_rating, 3),
(@provider_profile_id, @badge_display, 4),
(@provider_profile_id, @service_card, 5),
(@provider_profile_id, @review_card, 6),
(@provider_profile_id, @button, 7);

-- Service Details
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@service_details_id, @image, 1),
(@service_details_id, @text, 2),
(@service_details_id, @star_rating, 3),
(@service_details_id, @text, 4),
(@service_details_id, @button, 5);

-- Request Service
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@request_service_id, @text, 1),
(@request_service_id, @textarea, 2),
(@request_service_id, @date_picker, 3),
(@request_service_id, @time_picker, 4),
(@request_service_id, @image_upload, 5),
(@request_service_id, @button, 6);

-- Request Details
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@request_details_id, @text, 1),
(@request_details_id, @job_status, 2),
(@request_details_id, @card, 3),
(@request_details_id, @list_view, 4),
(@request_details_id, @button, 5);

-- Send Quote
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@send_quote_id, @text, 1),
(@send_quote_id, @quote_builder, 2),
(@send_quote_id, @textarea, 3),
(@send_quote_id, @button, 4);

-- Schedule Booking
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@schedule_id, @text, 1),
(@schedule_id, @date_picker, 2),
(@schedule_id, @time_picker, 3),
(@schedule_id, @availability, 4),
(@schedule_id, @button, 5);

-- Booking Confirmation
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@booking_confirm_id, @image, 1),
(@booking_confirm_id, @text, 2),
(@booking_confirm_id, @card, 3),
(@booking_confirm_id, @button, 4);

-- Messages
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@messages_id, @list_view, 1),
(@messages_id, @text_input, 2),
(@messages_id, @button, 3);

-- Notifications
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@notifications_id, @text, 1),
(@notifications_id, @list_view, 2),
(@notifications_id, @card, 3);

-- Active Jobs
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@active_jobs_id, @text, 1),
(@active_jobs_id, @job_status, 2),
(@active_jobs_id, @card, 3),
(@active_jobs_id, @list_view, 4);

-- Job Details
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@job_details_id, @text, 1),
(@job_details_id, @job_status, 2),
(@job_details_id, @card, 3),
(@job_details_id, @image, 4),
(@job_details_id, @button, 5);

-- Job History
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@job_history_id, @text, 1),
(@job_history_id, @search_bar, 2),
(@job_history_id, @card, 3),
(@job_history_id, @list_view, 4);

-- Job Tracking
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@job_tracking_id, @text, 1),
(@job_tracking_id, @job_status, 2),
(@job_tracking_id, @card, 3),
(@job_tracking_id, @button, 4);

-- Payment Methods
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@payment_methods_id, @text, 1),
(@payment_methods_id, @payment_card, 2),
(@payment_methods_id, @list_view, 3),
(@payment_methods_id, @button, 4);

-- Make Payment
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@make_payment_id, @text, 1),
(@make_payment_id, @card, 2),
(@make_payment_id, @payment_card, 3),
(@make_payment_id, @button, 4);

-- Payment Confirmation
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@payment_confirm_id, @image, 1),
(@payment_confirm_id, @text, 2),
(@payment_confirm_id, @card, 3),
(@payment_confirm_id, @button, 4);

-- Earnings
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@earnings_id, @text, 1),
(@earnings_id, @card, 2),
(@earnings_id, @list_view, 3),
(@earnings_id, @button, 4);

-- Payout Settings
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@payout_settings_id, @text, 1),
(@payout_settings_id, @text_input, 2),
(@payout_settings_id, @dropdown, 3),
(@payout_settings_id, @button, 4);

-- Write Review
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@write_review_id, @text, 1),
(@write_review_id, @star_rating, 2),
(@write_review_id, @textarea, 3),
(@write_review_id, @image_upload, 4),
(@write_review_id, @button, 5);

-- Reviews List
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@reviews_list_id, @text, 1),
(@reviews_list_id, @star_rating, 2),
(@reviews_list_id, @review_card, 3),
(@reviews_list_id, @list_view, 4);

-- User Profile
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@user_profile_id, @image, 1),
(@user_profile_id, @text, 2),
(@user_profile_id, @star_rating, 3),
(@user_profile_id, @badge_display, 4),
(@user_profile_id, @button, 5);

-- Edit Profile
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@edit_profile_id, @image_upload, 1),
(@edit_profile_id, @text_input, 2),
(@edit_profile_id, @email_input, 3),
(@edit_profile_id, @phone_input, 4),
(@edit_profile_id, @textarea, 5),
(@edit_profile_id, @button, 6);

-- Settings
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@settings_id, @text, 1),
(@settings_id, @list_view, 2),
(@settings_id, @checkbox, 3),
(@settings_id, @button, 4);

-- Become Provider
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@become_provider_id, @text, 1),
(@become_provider_id, @text_input, 2),
(@become_provider_id, @textarea, 3),
(@become_provider_id, @image_upload, 4),
(@become_provider_id, @availability, 5),
(@become_provider_id, @checkbox, 6),
(@become_provider_id, @button, 7);

-- About Us
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@about_id, @text, 1),
(@about_id, @image, 2);

-- Contact Us
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@contact_id, @text, 1),
(@contact_id, @text_input, 2),
(@contact_id, @email_input, 3),
(@contact_id, @textarea, 4),
(@contact_id, @button, 5);

-- Terms of Service
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@terms_id, @text, 1);

-- Privacy Policy
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
(@privacy_id, @text, 1);

SELECT 'Service Matching Platform elements added!' as message,
       COUNT(*) as total_elements
FROM app_template_screen_elements tse
JOIN app_template_screens ts ON tse.template_screen_id = ts.id
WHERE ts.template_id = @template_id;
