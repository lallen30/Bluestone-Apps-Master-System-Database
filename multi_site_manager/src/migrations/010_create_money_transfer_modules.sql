-- ============================================
-- Money Transfer App - New Modules/Elements
-- Migration: 010
-- Created: Nov 7, 2025
-- ============================================

-- Add new element types for Money Transfer App
INSERT INTO screen_elements (name, element_type, category, icon, description, is_input_field, display_order, default_config) VALUES

-- 1. Account Balance Display
('Account Balance Display', 'account_balance_display', 'Display', 'DollarSign', 'Display account balance with currency', 0, 55, JSON_OBJECT(
    'show_currency_symbol', true,
    'show_currency_code', true,
    'show_available_balance', true,
    'show_pending_balance', false,
    'decimal_places', 2,
    'font_size', 'large',
    'show_eye_toggle', true
)),

-- 2. Transaction List Item
('Transaction List Item', 'transaction_list_item', 'Display', 'ArrowRightLeft', 'Display transaction with amount, date, and status', 0, 56, JSON_OBJECT(
    'show_avatar', true,
    'show_recipient_name', true,
    'show_date', true,
    'show_status_badge', true,
    'show_amount', true,
    'show_currency', true,
    'date_format', 'relative',
    'highlight_incoming', true
)),

-- 3. Currency Selector
('Currency Selector', 'currency_selector', 'Input', 'Globe', 'Select currency with flags and exchange rates', 1, 57, JSON_OBJECT(
    'show_flags', true,
    'show_currency_name', true,
    'show_currency_code', true,
    'show_exchange_rate', true,
    'searchable', true,
    'popular_currencies', JSON_ARRAY('USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD')
)),

-- 4. Amount Input with Currency
('Amount Input with Currency', 'amount_input_currency', 'Input', 'DollarSign', 'Large amount input with currency symbol', 1, 58, JSON_OBJECT(
    'show_currency_symbol', true,
    'show_currency_code', true,
    'allow_decimal', true,
    'decimal_places', 2,
    'min_amount', 1,
    'max_amount', 10000,
    'font_size', 'xlarge',
    'show_word_format', true
)),

-- 5. Recipient Card
('Recipient Card', 'recipient_card', 'Display', 'User', 'Display saved recipient with avatar and details', 0, 59, JSON_OBJECT(
    'show_avatar', true,
    'show_name', true,
    'show_account_number', true,
    'show_bank_name', true,
    'show_favorite_badge', true,
    'show_last_sent', true,
    'card_style', 'elevated'
)),

-- 6. Transaction Status Timeline
('Transaction Status Timeline', 'transaction_status_timeline', 'Display', 'GitBranch', 'Show transaction progress steps', 0, 60, JSON_OBJECT(
    'steps', JSON_ARRAY(
        JSON_OBJECT('key', 'initiated', 'label', 'Initiated', 'icon', 'Circle'),
        JSON_OBJECT('key', 'processing', 'label', 'Processing', 'icon', 'Clock'),
        JSON_OBJECT('key', 'completed', 'label', 'Completed', 'icon', 'CheckCircle'),
        JSON_OBJECT('key', 'failed', 'label', 'Failed', 'icon', 'XCircle')
    ),
    'show_timestamps', true,
    'show_descriptions', true,
    'orientation', 'vertical'
)),

-- 7. Exchange Rate Display
('Exchange Rate Display', 'exchange_rate_display', 'Display', 'TrendingUp', 'Show current exchange rate with live updates', 0, 61, JSON_OBJECT(
    'show_from_currency', true,
    'show_to_currency', true,
    'show_rate', true,
    'show_last_updated', true,
    'show_trend', true,
    'decimal_places', 4,
    'auto_refresh', true,
    'refresh_interval', 30
)),

-- 8. Fee Breakdown
('Fee Breakdown', 'fee_breakdown', 'Display', 'Receipt', 'Itemized fee display', 0, 62, JSON_OBJECT(
    'show_transfer_fee', true,
    'show_exchange_fee', true,
    'show_service_fee', true,
    'show_subtotal', true,
    'show_total', true,
    'show_you_send', true,
    'show_recipient_gets', true,
    'highlight_total', true
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
    'account_balance_display',
    'transaction_list_item',
    'currency_selector',
    'amount_input_currency',
    'recipient_card',
    'transaction_status_timeline',
    'exchange_rate_display',
    'fee_breakdown'
)
ORDER BY display_order;
