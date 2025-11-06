-- Finance App Template Migration
-- Creates a comprehensive finance/banking app template with 6 screens

-- Insert Finance App Template
INSERT INTO app_templates (name, description, category, icon, is_active, created_at)
VALUES (
  'Finance & Banking App',
  'Complete banking and finance management app with account dashboard, transactions, transfers, bill payments, and card management',
  'Finance & Banking',
  'DollarSign',
  1,
  NOW()
);

SET @template_id = LAST_INSERT_ID();

-- ============================================
-- SCREEN 1: Account Dashboard
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Account Dashboard',
  'account_dashboard',
  'Main dashboard showing account balance, recent transactions, and quick actions',
  'LayoutDashboard',
  'Finance',
  1,
  1,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Dashboard Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'dashboard_title', 'Dashboard', '', 'My Account', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'welcome_message', 'Welcome Message', '', 'Welcome back! Here\'s your account overview.', 0, 1, 2, '{}', NOW()),
  
  -- Account Balance Section
  (@screen_id, 27, 'balance_heading', 'Balance Section', '', 'Account Balance', 0, 1, 3, '{"level": "h2"}', NOW()),
  (@screen_id, 8, 'current_balance', 'Current Balance', '', '0.00', 0, 1, 4, '{"prefix": "$", "decimals": 2}', NOW()),
  (@screen_id, 8, 'available_balance', 'Available Balance', '', '0.00', 0, 1, 5, '{"prefix": "$", "decimals": 2}', NOW()),
  
  -- Quick Actions
  (@screen_id, 27, 'quick_actions_heading', 'Quick Actions', '', 'Quick Actions', 0, 1, 6, '{"level": "h3"}', NOW()),
  (@screen_id, 33, 'transfer_button', 'Transfer Money', '', 'Transfer', 0, 0, 7, '{"variant": "primary", "action": "navigate", "target": "/transfer"}', NOW()),
  (@screen_id, 33, 'pay_bills_button', 'Pay Bills', '', 'Pay Bills', 0, 0, 8, '{"variant": "secondary", "action": "navigate", "target": "/bills"}', NOW()),
  
  -- Recent Transactions
  (@screen_id, 27, 'recent_transactions_heading', 'Recent Activity', '', 'Recent Transactions', 0, 1, 9, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'transactions_list', 'Transactions', '', 'Your recent transactions will appear here.', 0, 1, 10, '{"type": "list"}', NOW());

-- ============================================
-- SCREEN 2: Transaction History
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Transaction History',
  'transaction_history',
  'Complete list of all account transactions with search and filter options',
  'Receipt',
  'Finance',
  2,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Transaction History Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'transactions_title', 'Page Title', '', 'Transaction History', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'transactions_description', 'Description', '', 'View all your account transactions', 0, 1, 2, '{}', NOW()),
  
  -- Filters
  (@screen_id, 17, 'start_date', 'Start Date', 'Select start date', '', 0, 0, 3, '{}', NOW()),
  (@screen_id, 17, 'end_date', 'End Date', 'Select end date', '', 0, 0, 4, '{}', NOW()),
  (@screen_id, 10, 'transaction_type', 'Transaction Type', 'All Types', '', 0, 0, 5, '{"options": [{"label": "All", "value": "all"}, {"label": "Debit", "value": "debit"}, {"label": "Credit", "value": "credit"}, {"label": "Transfer", "value": "transfer"}]}', NOW()),
  (@screen_id, 33, 'apply_filters', 'Apply Filters', '', 'Apply', 0, 0, 6, '{"variant": "primary"}', NOW()),
  
  -- Transaction List
  (@screen_id, 27, 'transactions_list_heading', 'Transactions', '', 'All Transactions', 0, 1, 7, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'transactions_data', 'Transaction List', '', 'Your transactions will appear here.', 0, 1, 8, '{"type": "list"}', NOW());

-- ============================================
-- SCREEN 3: Transfer Money
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Transfer Money',
  'transfer_money',
  'Send money to another account or contact',
  'Send',
  'Finance',
  3,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Transfer Money Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'transfer_title', 'Page Title', '', 'Transfer Money', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'transfer_description', 'Description', '', 'Send money to another account', 0, 1, 2, '{}', NOW()),
  
  -- Transfer Form
  (@screen_id, 10, 'from_account', 'From Account', 'Select account', '', 1, 0, 3, '{"options": [{"label": "Checking Account", "value": "checking"}, {"label": "Savings Account", "value": "savings"}]}', NOW()),
  (@screen_id, 1, 'recipient_account', 'Recipient Account Number', 'Enter account number', '', 1, 0, 4, '{}', NOW()),
  (@screen_id, 1, 'recipient_name', 'Recipient Name', 'Enter recipient name', '', 1, 0, 5, '{}', NOW()),
  (@screen_id, 8, 'transfer_amount', 'Amount', 'Enter amount', '', 1, 0, 6, '{"prefix": "$", "decimals": 2, "min": 0.01}', NOW()),
  (@screen_id, 1, 'transfer_note', 'Note (Optional)', 'Add a note', '', 0, 0, 7, '{}', NOW()),
  
  -- Summary
  (@screen_id, 27, 'summary_heading', 'Transfer Summary', '', 'Summary', 0, 1, 8, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'transfer_fee', 'Transfer Fee', '', 'Fee: $0.00', 0, 1, 9, '{}', NOW()),
  (@screen_id, 28, 'total_amount', 'Total Amount', '', 'Total: $0.00', 0, 1, 10, '{}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'transfer_submit', 'Transfer Button', '', 'Transfer Now', 0, 0, 11, '{"variant": "primary", "action": "submit"}', NOW()),
  (@screen_id, 33, 'transfer_cancel', 'Cancel Button', '', 'Cancel', 0, 0, 12, '{"variant": "secondary", "action": "cancel"}', NOW());

-- ============================================
-- SCREEN 4: Bill Payment
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Bill Payment',
  'bill_payment',
  'Pay utility bills, credit cards, and other recurring payments',
  'FileText',
  'Finance',
  4,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Bill Payment Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'bills_title', 'Page Title', '', 'Pay Bills', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'bills_description', 'Description', '', 'Pay your bills quickly and securely', 0, 1, 2, '{}', NOW()),
  
  -- Bill Payment Form
  (@screen_id, 10, 'bill_category', 'Bill Category', 'Select category', '', 1, 0, 3, '{"options": [{"label": "Utilities", "value": "utilities"}, {"label": "Credit Card", "value": "credit_card"}, {"label": "Insurance", "value": "insurance"}, {"label": "Phone/Internet", "value": "telecom"}, {"label": "Other", "value": "other"}]}', NOW()),
  (@screen_id, 1, 'biller_name', 'Biller Name', 'Enter biller name', '', 1, 0, 4, '{}', NOW()),
  (@screen_id, 1, 'account_number', 'Account/Reference Number', 'Enter account number', '', 1, 0, 5, '{}', NOW()),
  (@screen_id, 8, 'bill_amount', 'Amount', 'Enter amount', '', 1, 0, 6, '{"prefix": "$", "decimals": 2, "min": 0.01}', NOW()),
  (@screen_id, 17, 'payment_date', 'Payment Date', 'Select date', '', 0, 0, 7, '{}', NOW()),
  (@screen_id, 10, 'payment_account', 'Pay From', 'Select account', '', 1, 0, 8, '{"options": [{"label": "Checking Account", "value": "checking"}, {"label": "Savings Account", "value": "savings"}]}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'pay_bill_button', 'Pay Bill', '', 'Pay Now', 0, 0, 9, '{"variant": "primary", "action": "submit"}', NOW()),
  (@screen_id, 33, 'save_biller_button', 'Save Biller', '', 'Save for Later', 0, 0, 10, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 5: Cards Management
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Cards Management',
  'cards_management',
  'Manage debit and credit cards, view limits, and control card settings',
  'CreditCard',
  'Finance',
  5,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Cards Management Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'cards_title', 'Page Title', '', 'My Cards', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'cards_description', 'Description', '', 'Manage your debit and credit cards', 0, 1, 2, '{}', NOW()),
  
  -- Card List
  (@screen_id, 27, 'active_cards_heading', 'Active Cards', '', 'Your Cards', 0, 1, 3, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'cards_list', 'Cards List', '', 'Your cards will appear here.', 0, 1, 4, '{"type": "list"}', NOW()),
  
  -- Card Actions
  (@screen_id, 33, 'add_card_button', 'Add Card', '', 'Add New Card', 0, 0, 5, '{"variant": "primary", "action": "navigate", "target": "/add-card"}', NOW()),
  (@screen_id, 33, 'request_card_button', 'Request Card', '', 'Request Physical Card', 0, 0, 6, '{"variant": "secondary"}', NOW()),
  
  -- Card Settings
  (@screen_id, 27, 'card_settings_heading', 'Card Settings', '', 'Settings', 0, 1, 7, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'daily_limit', 'Daily Limit', '', 'Daily spending limit: $1,000', 0, 1, 8, '{}', NOW()),
  (@screen_id, 28, 'international_usage', 'International Transactions', '', 'Enabled', 0, 1, 9, '{}', NOW()),
  (@screen_id, 33, 'manage_limits_button', 'Manage Limits', '', 'Manage Limits', 0, 0, 10, '{"variant": "secondary"}', NOW());

-- ============================================
-- SCREEN 6: Account Statements
-- ============================================
INSERT INTO app_template_screens (template_id, screen_name, screen_key, screen_description, screen_icon, screen_category, display_order, is_home_screen, created_at)
VALUES (
  @template_id,
  'Account Statements',
  'account_statements',
  'View and download monthly account statements',
  'FileBarChart',
  'Finance',
  6,
  0,
  NOW()
);

SET @screen_id = LAST_INSERT_ID();

-- Account Statements Elements
INSERT INTO app_template_screen_elements (template_screen_id, element_id, field_key, label, placeholder, default_value, is_required, is_readonly, display_order, config, created_at)
VALUES
  -- Header
  (@screen_id, 27, 'statements_title', 'Page Title', '', 'Account Statements', 0, 1, 1, '{}', NOW()),
  (@screen_id, 28, 'statements_description', 'Description', '', 'View and download your account statements', 0, 1, 2, '{}', NOW()),
  
  -- Filters
  (@screen_id, 10, 'statement_account', 'Account', 'Select account', '', 0, 0, 3, '{"options": [{"label": "All Accounts", "value": "all"}, {"label": "Checking Account", "value": "checking"}, {"label": "Savings Account", "value": "savings"}]}', NOW()),
  (@screen_id, 10, 'statement_year', 'Year', 'Select year', '', 0, 0, 4, '{"options": [{"label": "2025", "value": "2025"}, {"label": "2024", "value": "2024"}, {"label": "2023", "value": "2023"}]}', NOW()),
  
  -- Statements List
  (@screen_id, 27, 'statements_list_heading', 'Available Statements', '', 'Statements', 0, 1, 5, '{"level": "h3"}', NOW()),
  (@screen_id, 28, 'statements_data', 'Statements List', '', 'Your statements will appear here.', 0, 1, 6, '{"type": "list"}', NOW()),
  
  -- Actions
  (@screen_id, 33, 'download_all_button', 'Download All', '', 'Download All', 0, 0, 7, '{"variant": "secondary"}', NOW()),
  (@screen_id, 33, 'email_statement_button', 'Email Statement', '', 'Email Statement', 0, 0, 8, '{"variant": "secondary"}', NOW());

-- Success message
SELECT CONCAT('✅ Finance & Banking App template created successfully! Template ID: ', @template_id) AS Result;
SELECT 'Created 6 screens: Account Dashboard, Transaction History, Transfer Money, Bill Payment, Cards Management, Account Statements' AS Screens;
