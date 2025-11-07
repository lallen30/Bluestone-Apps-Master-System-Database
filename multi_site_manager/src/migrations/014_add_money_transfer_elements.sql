-- ============================================
-- Add Screen Elements to Money Transfer App Template
-- Migration: 014
-- ============================================

SET @template_id = 13;

-- Common elements
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
SET @checkbox = (SELECT id FROM screen_elements WHERE element_type = 'checkbox');
SET @image_upload = (SELECT id FROM screen_elements WHERE element_type = 'image_upload');

-- Money transfer specific elements
SET @balance = (SELECT id FROM screen_elements WHERE element_type = 'account_balance_display');
SET @transaction_item = (SELECT id FROM screen_elements WHERE element_type = 'transaction_list_item');
SET @currency_selector = (SELECT id FROM screen_elements WHERE element_type = 'currency_selector');
SET @amount_input = (SELECT id FROM screen_elements WHERE element_type = 'amount_input_currency');
SET @recipient_card = (SELECT id FROM screen_elements WHERE element_type = 'recipient_card');
SET @status_timeline = (SELECT id FROM screen_elements WHERE element_type = 'transaction_status_timeline');
SET @exchange_rate = (SELECT id FROM screen_elements WHERE element_type = 'exchange_rate_display');
SET @fee_breakdown = (SELECT id FROM screen_elements WHERE element_type = 'fee_breakdown');
SET @payment_card = (SELECT id FROM screen_elements WHERE element_type = 'payment_method_card');

-- Get all screen IDs
SET @splash = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'splash_screen');
SET @onboarding = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'onboarding');
SET @login = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'login');
SET @signup = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'sign_up');
SET @phone_verify = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'phone_verification');
SET @email_verify = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'email_verification');
SET @forgot_pwd = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'forgot_password');
SET @home = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'home_dashboard');
SET @tx_history = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'transaction_history');
SET @tx_details = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'transaction_details');
SET @send_money = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'send_money');
SET @select_recipient = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'select_recipient');
SET @add_recipient = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'add_recipient');
SET @enter_amount = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'enter_amount');
SET @select_currency = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'select_currency');
SET @review_transfer = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'review_transfer');
SET @payment_method = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'payment_method');
SET @transfer_confirm = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'transfer_confirmation');
SET @recipients_list = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'recipients_list');
SET @recipient_details = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'recipient_details');
SET @edit_recipient = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'edit_recipient');
SET @wallet = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'wallet');
SET @add_funds = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'add_funds');
SET @withdraw = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'withdraw_funds');
SET @payment_methods = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'payment_methods');
SET @add_payment = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'add_payment_method');
SET @bank_accounts = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'bank_accounts');
SET @add_bank = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'add_bank_account');
SET @exchange_rates = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'exchange_rates');
SET @rate_alerts = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'rate_alerts');
SET @fee_calc = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'fee_calculator');
SET @identity_verify = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'identity_verification');
SET @upload_docs = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'upload_documents');
SET @two_fa = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'two_factor_auth');
SET @security_settings = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'security_settings');
SET @tx_pin = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'transaction_pin');
SET @profile = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'profile');
SET @edit_profile = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'edit_profile');
SET @settings = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'settings');
SET @notif_settings = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'notifications_settings');
SET @lang_currency = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'language_currency');
SET @change_pwd = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'change_password');
SET @help = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'help_center');
SET @contact = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'contact_support');
SET @live_chat = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'live_chat');
SET @report = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'report_issue');
SET @dispute = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'transaction_dispute');
SET @notifications = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'notifications');
SET @activity = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'activity_log');
SET @referral = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'referral_program');
SET @rewards = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'rewards');
SET @promo = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'promo_codes');
SET @about = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'about_us');
SET @terms = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'terms_of_service');
SET @privacy = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'privacy_policy');
SET @compliance = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'compliance');
SET @contact_us = (SELECT id FROM app_template_screens WHERE template_id = @template_id AND screen_key = 'contact_us');

-- Add elements to screens
INSERT INTO app_template_screen_elements (template_screen_id, element_id, display_order) VALUES
-- Splash
(@splash, @logo, 1), (@splash, @text, 2),
-- Onboarding
(@onboarding, @image, 1), (@onboarding, @text, 2), (@onboarding, @button, 3),
-- Login
(@login, @logo, 1), (@login, @text, 2), (@login, @email_input, 3), (@login, @password_input, 4), (@login, @button, 5),
-- Sign Up
(@signup, @logo, 1), (@signup, @text, 2), (@signup, @text_input, 3), (@signup, @email_input, 4), (@signup, @phone_input, 5), (@signup, @password_input, 6), (@signup, @checkbox, 7), (@signup, @button, 8),
-- Phone Verification
(@phone_verify, @text, 1), (@phone_verify, @text_input, 2), (@phone_verify, @button, 3),
-- Email Verification
(@email_verify, @text, 1), (@email_verify, @text_input, 2), (@email_verify, @button, 3),
-- Forgot Password
(@forgot_pwd, @text, 1), (@forgot_pwd, @email_input, 2), (@forgot_pwd, @button, 3),
-- Home Dashboard
(@home, @balance, 1), (@home, @text, 2), (@home, @button, 3), (@home, @transaction_item, 4), (@home, @list_view, 5),
-- Transaction History
(@tx_history, @text, 1), (@tx_history, @search_bar, 2), (@tx_history, @transaction_item, 3), (@tx_history, @list_view, 4),
-- Transaction Details
(@tx_details, @text, 1), (@tx_details, @status_timeline, 2), (@tx_details, @card, 3), (@tx_details, @button, 4),
-- Send Money
(@send_money, @text, 1), (@send_money, @recipient_card, 2), (@send_money, @button, 3),
-- Select Recipient
(@select_recipient, @text, 1), (@select_recipient, @search_bar, 2), (@select_recipient, @recipient_card, 3), (@select_recipient, @list_view, 4), (@select_recipient, @button, 5),
-- Add Recipient
(@add_recipient, @text, 1), (@add_recipient, @text_input, 2), (@add_recipient, @email_input, 3), (@add_recipient, @phone_input, 4), (@add_recipient, @dropdown, 5), (@add_recipient, @button, 6),
-- Enter Amount
(@enter_amount, @text, 1), (@enter_amount, @amount_input, 2), (@enter_amount, @exchange_rate, 3), (@enter_amount, @fee_breakdown, 4), (@enter_amount, @button, 5),
-- Select Currency
(@select_currency, @text, 1), (@select_currency, @search_bar, 2), (@select_currency, @currency_selector, 3), (@select_currency, @list_view, 4),
-- Review Transfer
(@review_transfer, @text, 1), (@review_transfer, @recipient_card, 2), (@review_transfer, @amount_input, 3), (@review_transfer, @fee_breakdown, 4), (@review_transfer, @button, 5),
-- Payment Method
(@payment_method, @text, 1), (@payment_method, @payment_card, 2), (@payment_method, @list_view, 3), (@payment_method, @button, 4),
-- Transfer Confirmation
(@transfer_confirm, @image, 1), (@transfer_confirm, @text, 2), (@transfer_confirm, @card, 3), (@transfer_confirm, @button, 4),
-- Recipients List
(@recipients_list, @text, 1), (@recipients_list, @search_bar, 2), (@recipients_list, @recipient_card, 3), (@recipients_list, @list_view, 4), (@recipients_list, @button, 5),
-- Recipient Details
(@recipient_details, @text, 1), (@recipient_details, @recipient_card, 2), (@recipient_details, @card, 3), (@recipient_details, @button, 4),
-- Edit Recipient
(@edit_recipient, @text, 1), (@edit_recipient, @text_input, 2), (@edit_recipient, @email_input, 3), (@edit_recipient, @phone_input, 4), (@edit_recipient, @button, 5),
-- Wallet
(@wallet, @balance, 1), (@wallet, @text, 2), (@wallet, @card, 3), (@wallet, @button, 4),
-- Add Funds
(@add_funds, @text, 1), (@add_funds, @amount_input, 2), (@add_funds, @payment_card, 3), (@add_funds, @button, 4),
-- Withdraw Funds
(@withdraw, @text, 1), (@withdraw, @amount_input, 2), (@withdraw, @card, 3), (@withdraw, @button, 4),
-- Payment Methods
(@payment_methods, @text, 1), (@payment_methods, @payment_card, 2), (@payment_methods, @list_view, 3), (@payment_methods, @button, 4),
-- Add Payment Method
(@add_payment, @text, 1), (@add_payment, @text_input, 2), (@add_payment, @date_picker, 3), (@add_payment, @button, 4),
-- Bank Accounts
(@bank_accounts, @text, 1), (@bank_accounts, @card, 2), (@bank_accounts, @list_view, 3), (@bank_accounts, @button, 4),
-- Add Bank Account
(@add_bank, @text, 1), (@add_bank, @text_input, 2), (@add_bank, @dropdown, 3), (@add_bank, @button, 4),
-- Exchange Rates
(@exchange_rates, @text, 1), (@exchange_rates, @exchange_rate, 2), (@exchange_rates, @list_view, 3),
-- Rate Alerts
(@rate_alerts, @text, 1), (@rate_alerts, @currency_selector, 2), (@rate_alerts, @text_input, 3), (@rate_alerts, @button, 4),
-- Fee Calculator
(@fee_calc, @text, 1), (@fee_calc, @amount_input, 2), (@fee_calc, @currency_selector, 3), (@fee_calc, @fee_breakdown, 4),
-- Identity Verification
(@identity_verify, @text, 1), (@identity_verify, @image, 2), (@identity_verify, @button, 3),
-- Upload Documents
(@upload_docs, @text, 1), (@upload_docs, @image_upload, 2), (@upload_docs, @button, 3),
-- Two-Factor Auth
(@two_fa, @text, 1), (@two_fa, @text_input, 2), (@two_fa, @button, 3),
-- Security Settings
(@security_settings, @text, 1), (@security_settings, @list_view, 2), (@security_settings, @checkbox, 3), (@security_settings, @button, 4),
-- Transaction PIN
(@tx_pin, @text, 1), (@tx_pin, @password_input, 2), (@tx_pin, @button, 3),
-- Profile
(@profile, @image, 1), (@profile, @text, 2), (@profile, @card, 3), (@profile, @button, 4),
-- Edit Profile
(@edit_profile, @image_upload, 1), (@edit_profile, @text_input, 2), (@edit_profile, @email_input, 3), (@edit_profile, @phone_input, 4), (@edit_profile, @button, 5),
-- Settings
(@settings, @text, 1), (@settings, @list_view, 2), (@settings, @button, 3),
-- Notifications Settings
(@notif_settings, @text, 1), (@notif_settings, @checkbox, 2), (@notif_settings, @list_view, 3), (@notif_settings, @button, 4),
-- Language & Currency
(@lang_currency, @text, 1), (@lang_currency, @dropdown, 2), (@lang_currency, @currency_selector, 3), (@lang_currency, @button, 4),
-- Change Password
(@change_pwd, @text, 1), (@change_pwd, @password_input, 2), (@change_pwd, @button, 3),
-- Help Center
(@help, @text, 1), (@help, @search_bar, 2), (@help, @card, 3), (@help, @list_view, 4),
-- Contact Support
(@contact, @text, 1), (@contact, @text_input, 2), (@contact, @email_input, 3), (@contact, @textarea, 4), (@contact, @button, 5),
-- Live Chat
(@live_chat, @text, 1), (@live_chat, @list_view, 2), (@live_chat, @text_input, 3), (@live_chat, @button, 4),
-- Report Issue
(@report, @text, 1), (@report, @dropdown, 2), (@report, @textarea, 3), (@report, @image_upload, 4), (@report, @button, 5),
-- Transaction Dispute
(@dispute, @text, 1), (@dispute, @card, 2), (@dispute, @textarea, 3), (@dispute, @image_upload, 4), (@dispute, @button, 5),
-- Notifications
(@notifications, @text, 1), (@notifications, @list_view, 2), (@notifications, @card, 3),
-- Activity Log
(@activity, @text, 1), (@activity, @list_view, 2), (@activity, @card, 3),
-- Referral Program
(@referral, @text, 1), (@referral, @text_input, 2), (@referral, @button, 3), (@referral, @card, 4),
-- Rewards
(@rewards, @text, 1), (@rewards, @card, 2), (@rewards, @list_view, 3),
-- Promo Codes
(@promo, @text, 1), (@promo, @text_input, 2), (@promo, @button, 3),
-- About Us
(@about, @text, 1), (@about, @image, 2),
-- Terms of Service
(@terms, @text, 1),
-- Privacy Policy
(@privacy, @text, 1),
-- Compliance
(@compliance, @text, 1), (@compliance, @card, 2),
-- Contact Us
(@contact_us, @text, 1), (@contact_us, @text_input, 2), (@contact_us, @email_input, 3), (@contact_us, @textarea, 4), (@contact_us, @button, 5);

SELECT 'Money Transfer App elements added!' as message,
       COUNT(*) as total_elements
FROM app_template_screen_elements tse
JOIN app_template_screens ts ON tse.template_screen_id = ts.id
WHERE ts.template_id = @template_id;
