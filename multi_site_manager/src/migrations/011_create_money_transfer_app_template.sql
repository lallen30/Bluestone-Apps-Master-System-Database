-- ============================================
-- Money Transfer App Template
-- Migration: 011
-- Created: Nov 7, 2025
-- Description: Complete template for money transfer and remittance apps
--              (like Wise, Remitly, Western Union, PayPal, Venmo)
-- ============================================

-- Create the Money Transfer App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at) VALUES
('Money Transfer App', 'Complete template for money transfer and remittance applications. Includes multi-currency support, recipient management, transaction tracking, and secure payments.', 'Finance & Banking', 'DollarSign', 1, NOW());

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- ADD SCREENS TO TEMPLATE
-- ============================================

-- AUTHENTICATION & ONBOARDING (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Splash Screen', 'splash_screen', 'App logo and branding', 'Zap', 'Onboarding', 1, 0, NOW()),
(@template_id, 'Onboarding', 'onboarding', 'Tutorial slides about sending money', 'BookOpen', 'Onboarding', 2, 0, NOW()),
(@template_id, 'Login', 'login', 'Secure login with email/phone', 'LogIn', 'Authentication', 3, 0, NOW()),
(@template_id, 'Sign Up', 'sign_up', 'Create new account', 'UserPlus', 'Authentication', 4, 0, NOW()),
(@template_id, 'Phone Verification', 'phone_verification', 'Verify phone with OTP', 'Smartphone', 'Authentication', 5, 0, NOW()),
(@template_id, 'Email Verification', 'email_verification', 'Verify email address', 'Mail', 'Authentication', 6, 0, NOW());

-- MAIN DASHBOARD & NAVIGATION (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Home Dashboard', 'home_dashboard', 'Main screen with balance and quick actions', 'Home', 'Navigation', 7, 1, NOW()),
(@template_id, 'Transaction History', 'transaction_history', 'List of all transactions', 'List', 'Transactions', 8, 0, NOW()),
(@template_id, 'Transaction Details', 'transaction_details', 'Detailed view of a transaction', 'FileText', 'Transactions', 9, 0, NOW());

-- SEND MONEY FLOW (8 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Send Money', 'send_money', 'Start money transfer - select recipient', 'Send', 'Transfer', 10, 0, NOW()),
(@template_id, 'Select Recipient', 'select_recipient', 'Choose from saved recipients or add new', 'Users', 'Transfer', 11, 0, NOW()),
(@template_id, 'Add Recipient', 'add_recipient', 'Add new recipient details', 'UserPlus', 'Transfer', 12, 0, NOW()),
(@template_id, 'Enter Amount', 'enter_amount', 'Enter transfer amount and select currency', 'DollarSign', 'Transfer', 13, 0, NOW()),
(@template_id, 'Select Currency', 'select_currency', 'Choose sending and receiving currency', 'Globe', 'Transfer', 14, 0, NOW()),
(@template_id, 'Review Transfer', 'review_transfer', 'Review transfer details and fees', 'Eye', 'Transfer', 15, 0, NOW()),
(@template_id, 'Payment Method', 'payment_method', 'Choose payment method', 'CreditCard', 'Transfer', 16, 0, NOW()),
(@template_id, 'Transfer Confirmation', 'transfer_confirmation', 'Transfer successful confirmation', 'CheckCircle', 'Transfer', 17, 0, NOW());

-- RECIPIENT MANAGEMENT (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Recipients List', 'recipients_list', 'Manage saved recipients', 'Users', 'Recipients', 18, 0, NOW()),
(@template_id, 'Recipient Details', 'recipient_details', 'View recipient information', 'User', 'Recipients', 19, 0, NOW()),
(@template_id, 'Edit Recipient', 'edit_recipient', 'Update recipient details', 'Edit', 'Recipients', 20, 0, NOW());

-- PAYMENT & WALLET (7 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Wallet', 'wallet', 'View balance and manage funds', 'Wallet', 'Wallet', 21, 0, NOW()),
(@template_id, 'Add Funds', 'add_funds', 'Top up wallet balance', 'Plus', 'Wallet', 22, 0, NOW()),
(@template_id, 'Withdraw Funds', 'withdraw_funds', 'Cash out to bank account', 'Minus', 'Wallet', 23, 0, NOW()),
(@template_id, 'Payment Methods', 'payment_methods', 'Manage cards and bank accounts', 'CreditCard', 'Payment', 24, 0, NOW()),
(@template_id, 'Add Payment Method', 'add_payment_method', 'Link new card or bank', 'Plus', 'Payment', 25, 0, NOW()),
(@template_id, 'Bank Accounts', 'bank_accounts', 'Linked bank accounts', 'Building', 'Payment', 26, 0, NOW()),
(@template_id, 'Add Bank Account', 'add_bank_account', 'Link bank account', 'Plus', 'Payment', 27, 0, NOW());

-- EXCHANGE RATES & FEES (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Exchange Rates', 'exchange_rates', 'View current exchange rates', 'TrendingUp', 'Rates', 28, 0, NOW()),
(@template_id, 'Rate Alerts', 'rate_alerts', 'Set alerts for favorable rates', 'Bell', 'Rates', 29, 0, NOW()),
(@template_id, 'Fee Calculator', 'fee_calculator', 'Calculate transfer fees', 'Calculator', 'Rates', 30, 0, NOW());

-- SECURITY & VERIFICATION (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Identity Verification', 'identity_verification', 'Verify identity with documents', 'Shield', 'Security', 31, 0, NOW()),
(@template_id, 'Upload Documents', 'upload_documents', 'Upload ID and proof of address', 'Upload', 'Security', 32, 0, NOW()),
(@template_id, 'Two-Factor Authentication', 'two_factor_auth', 'Enable 2FA for security', 'Lock', 'Security', 33, 0, NOW()),
(@template_id, 'Security Settings', 'security_settings', 'Manage security preferences', 'Shield', 'Security', 34, 0, NOW()),
(@template_id, 'Transaction PIN', 'transaction_pin', 'Set PIN for transactions', 'Key', 'Security', 35, 0, NOW());

-- PROFILE & SETTINGS (6 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Profile', 'profile', 'View user profile', 'User', 'Profile', 36, 0, NOW()),
(@template_id, 'Edit Profile', 'edit_profile', 'Update profile information', 'Edit', 'Profile', 37, 0, NOW()),
(@template_id, 'Settings', 'settings', 'App settings and preferences', 'Settings', 'Settings', 38, 0, NOW()),
(@template_id, 'Notifications Settings', 'notifications_settings', 'Manage notification preferences', 'Bell', 'Settings', 39, 0, NOW()),
(@template_id, 'Language & Currency', 'language_currency', 'Set preferred language and currency', 'Globe', 'Settings', 40, 0, NOW()),
(@template_id, 'Change Password', 'change_password', 'Update account password', 'Lock', 'Settings', 41, 0, NOW());

-- SUPPORT & HELP (5 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Help Center', 'help_center', 'FAQ and support articles', 'HelpCircle', 'Support', 42, 0, NOW()),
(@template_id, 'Contact Support', 'contact_support', 'Get help from support team', 'MessageCircle', 'Support', 43, 0, NOW()),
(@template_id, 'Live Chat', 'live_chat', 'Chat with support agent', 'MessageSquare', 'Support', 44, 0, NOW()),
(@template_id, 'Report Issue', 'report_issue', 'Report a problem', 'AlertCircle', 'Support', 45, 0, NOW()),
(@template_id, 'Transaction Dispute', 'transaction_dispute', 'Dispute a transaction', 'AlertTriangle', 'Support', 46, 0, NOW());

-- NOTIFICATIONS & ACTIVITY (2 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Notifications', 'notifications', 'All notifications and alerts', 'Bell', 'Notifications', 47, 0, NOW()),
(@template_id, 'Activity Log', 'activity_log', 'Account activity history', 'Activity', 'Notifications', 48, 0, NOW());

-- REFERRAL & REWARDS (3 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'Referral Program', 'referral_program', 'Invite friends and earn rewards', 'Gift', 'Rewards', 49, 0, NOW()),
(@template_id, 'Rewards', 'rewards', 'View earned rewards and bonuses', 'Award', 'Rewards', 50, 0, NOW()),
(@template_id, 'Promo Codes', 'promo_codes', 'Enter promotional codes', 'Tag', 'Rewards', 51, 0, NOW());

-- LEGAL & INFORMATION (4 screens)
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at) VALUES
(@template_id, 'About Us', 'about_us', 'Company information', 'Info', 'Information', 52, 0, NOW()),
(@template_id, 'Terms of Service', 'terms_of_service', 'Legal terms and conditions', 'FileText', 'Legal', 53, 0, NOW()),
(@template_id, 'Privacy Policy', 'privacy_policy', 'Privacy policy and data usage', 'Shield', 'Legal', 54, 0, NOW()),
(@template_id, 'Compliance', 'compliance', 'Regulatory compliance information', 'CheckSquare', 'Legal', 55, 0, NOW());

-- ============================================
-- VERIFICATION
-- ============================================

-- Show template info
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

-- Show screens by category
SELECT 
    screen_category,
    COUNT(*) as screen_count
FROM app_template_screens
WHERE template_id = @template_id
GROUP BY screen_category
ORDER BY screen_count DESC;

-- Show all screens
SELECT 
    display_order,
    screen_name,
    screen_key,
    screen_category,
    is_home_screen
FROM app_template_screens
WHERE template_id = @template_id
ORDER BY display_order;

-- Success message
SELECT 'Money Transfer App Template created successfully!' as message,
       @template_id as template_id,
       COUNT(*) as total_screens
FROM app_template_screens
WHERE template_id = @template_id;
