'use client';

import { useState, useMemo } from 'react';
import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';
import { X, Search } from 'lucide-react';

// Popular MaterialCommunityIcons for mobile apps - organized by category
// These names match react-native-vector-icons/MaterialCommunityIcons
export const MDI_ICONS: { [category: string]: string[] } = {
  'Navigation & Menu': [
    'home', 'home-outline', 'home-account', 'home-analytics', 'home-assistant',
    'menu', 'menu-open', 'menu-down', 'menu-up', 'menu-left', 'menu-right',
    'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down', 'arrow-all',
    'arrow-left-circle', 'arrow-right-circle', 'arrow-up-circle', 'arrow-down-circle',
    'arrow-left-bold', 'arrow-right-bold', 'arrow-expand', 'arrow-collapse',
    'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'chevron-double-left', 'chevron-double-right',
    'close', 'close-circle', 'close-box', 'check', 'check-circle', 'check-bold',
    'dots-horizontal', 'dots-vertical', 'dots-horizontal-circle', 'dots-vertical-circle',
    'plus', 'plus-circle', 'plus-box', 'minus', 'minus-circle', 'minus-box',
    'magnify', 'magnify-plus', 'magnify-minus', 'magnify-close',
    'filter', 'filter-outline', 'filter-variant', 'sort', 'sort-ascending', 'sort-descending',
    'refresh', 'reload', 'undo', 'redo', 'restore',
  ],
  'User & Account': [
    'account', 'account-outline', 'account-circle', 'account-circle-outline',
    'account-box', 'account-box-outline', 'account-card', 'account-card-outline',
    'account-group', 'account-group-outline', 'account-multiple', 'account-multiple-outline',
    'account-plus', 'account-plus-outline', 'account-minus', 'account-minus-outline',
    'account-edit', 'account-edit-outline', 'account-settings', 'account-settings-outline',
    'account-check', 'account-check-outline', 'account-cancel', 'account-cancel-outline',
    'account-remove', 'account-remove-outline', 'account-search', 'account-search-outline',
    'account-star', 'account-star-outline', 'account-heart', 'account-heart-outline',
    'account-key', 'account-key-outline', 'account-lock', 'account-lock-outline',
    'account-tie', 'account-tie-outline', 'account-supervisor', 'account-supervisor-outline',
    'face-man', 'face-man-outline', 'face-woman', 'face-woman-outline',
    'human-male', 'human-female', 'human-male-female', 'human-greeting',
    'badge-account', 'badge-account-outline', 'card-account-details', 'card-account-details-outline',
  ],
  'Communication': [
    'email', 'email-outline', 'email-open', 'email-open-outline',
    'email-send', 'email-send-outline', 'email-receive', 'email-receive-outline',
    'email-plus', 'email-plus-outline', 'email-check', 'email-check-outline',
    'email-alert', 'email-alert-outline', 'email-newsletter', 'email-fast',
    'message', 'message-outline', 'message-text', 'message-text-outline',
    'message-plus', 'message-plus-outline', 'message-reply', 'message-reply-outline',
    'message-processing', 'message-processing-outline', 'message-alert', 'message-alert-outline',
    'chat', 'chat-outline', 'chat-plus', 'chat-plus-outline',
    'chat-processing', 'chat-processing-outline', 'chat-alert', 'chat-alert-outline',
    'forum', 'forum-outline', 'comment', 'comment-outline',
    'comment-text', 'comment-text-outline', 'comment-multiple', 'comment-multiple-outline',
    'phone', 'phone-outline', 'phone-in-talk', 'phone-in-talk-outline',
    'phone-message', 'phone-message-outline', 'phone-plus', 'phone-plus-outline',
    'phone-dial', 'phone-dial-outline', 'phone-incoming', 'phone-outgoing',
    'bell', 'bell-outline', 'bell-ring', 'bell-ring-outline',
    'bell-off', 'bell-off-outline', 'bell-plus', 'bell-plus-outline',
    'bell-alert', 'bell-alert-outline', 'bell-badge', 'bell-badge-outline',
    'bullhorn', 'bullhorn-outline', 'broadcast', 'broadcast-off',
    'send', 'send-outline', 'send-circle', 'send-circle-outline',
  ],
  'Buildings & Places': [
    'home-city', 'home-city-outline', 'home-group', 'home-group-plus',
    'office-building', 'office-building-outline', 'office-building-marker', 'office-building-marker-outline',
    'domain', 'city', 'city-variant', 'city-variant-outline',
    'warehouse', 'store', 'store-outline', 'store-24-hour',
    'storefront', 'storefront-outline', 'shopping-outline',
    'hospital-building', 'hospital', 'hospital-box', 'hospital-box-outline',
    'school', 'school-outline', 'library', 'library-outline',
    'bank', 'bank-outline', 'bank-transfer', 'bank-check',
    'church', 'church-outline', 'mosque', 'synagogue',
    'stadium', 'stadium-outline', 'stadium-variant',
    'apartment', 'home-modern', 'home-variant', 'home-variant-outline',
    'home-floor-0', 'home-floor-1', 'home-floor-2', 'home-floor-3',
    'greenhouse', 'barn', 'silo', 'silo-outline',
    'factory', 'pier', 'pier-crane', 'bridge',
    'castle', 'tower-fire', 'tower-beach', 'lighthouse',
    'beach', 'island', 'palm-tree', 'pine-tree',
    'pool', 'hot-tub', 'grill', 'grill-outline',
    'parking', 'gas-station', 'ev-station', 'car-wash',
    'bed', 'bed-outline', 'bed-double', 'bed-double-outline',
    'bed-king', 'bed-king-outline', 'bed-queen', 'bed-queen-outline',
    'bunk-bed', 'bunk-bed-outline', 'sofa', 'sofa-outline',
    'toilet', 'shower', 'shower-head', 'bathtub', 'bathtub-outline',
  ],
  'Travel & Transport': [
    'car', 'car-outline', 'car-side', 'car-sports', 'car-estate', 'car-hatchback',
    'car-convertible', 'car-pickup', 'car-electric', 'car-electric-outline',
    'bus', 'bus-side', 'bus-double-decker', 'bus-school', 'bus-stop',
    'train', 'train-car', 'train-variant', 'subway', 'subway-variant', 'tram',
    'airplane', 'airplane-takeoff', 'airplane-landing', 'airplane-marker',
    'helicopter', 'rocket', 'rocket-launch', 'rocket-outline',
    'ship-wheel', 'ferry', 'sail-boat', 'speedboat', 'kayaking', 'rowing',
    'bike', 'bike-fast', 'bicycle', 'bicycle-basket', 'bicycle-electric',
    'motorbike', 'motorbike-electric', 'scooter', 'scooter-electric',
    'walk', 'run', 'run-fast', 'hiking', 'ski', 'ski-water',
    'taxi', 'truck', 'truck-delivery', 'truck-fast', 'truck-outline',
    'van-passenger', 'van-utility', 'caravan', 'rv-truck',
    'map', 'map-outline', 'map-search', 'map-search-outline',
    'map-marker', 'map-marker-outline', 'map-marker-plus', 'map-marker-minus',
    'map-marker-check', 'map-marker-alert', 'map-marker-radius', 'map-marker-distance',
    'compass', 'compass-outline', 'compass-rose', 'crosshairs', 'crosshairs-gps',
    'navigation', 'navigation-outline', 'navigation-variant', 'navigation-variant-outline',
    'directions', 'directions-fork', 'sign-direction', 'sign-direction-plus',
    'road', 'road-variant', 'highway', 'routes', 'transit-connection',
    'gas-station', 'gas-station-outline', 'fuel', 'fuel-cell',
    'passport', 'passport-biometric', 'bag-suitcase', 'bag-suitcase-outline',
    'bag-carry-on', 'bag-carry-on-check', 'bag-checked', 'briefcase-variant',
  ],
  'Shopping & Commerce': [
    'cart', 'cart-outline', 'cart-plus', 'cart-minus', 'cart-check', 'cart-remove',
    'cart-arrow-down', 'cart-arrow-up', 'cart-arrow-right', 'cart-off',
    'shopping', 'shopping-outline', 'shopping-search',
    'basket', 'basket-outline', 'basket-plus', 'basket-minus', 'basket-check', 'basket-remove',
    'bag-personal', 'bag-personal-outline', 'shopping-outline',
    'cash', 'cash-100', 'cash-multiple', 'cash-check', 'cash-fast', 'cash-plus', 'cash-minus',
    'credit-card', 'credit-card-outline', 'credit-card-check', 'credit-card-plus',
    'credit-card-scan', 'credit-card-wireless', 'credit-card-chip', 'credit-card-marker',
    'wallet', 'wallet-outline', 'wallet-plus', 'wallet-plus-outline',
    'wallet-giftcard', 'wallet-membership', 'wallet-travel',
    'currency-usd', 'currency-eur', 'currency-gbp', 'currency-btc', 'currency-eth',
    'tag', 'tag-outline', 'tag-plus', 'tag-plus-outline', 'tag-multiple', 'tag-multiple-outline',
    'tag-heart', 'tag-heart-outline', 'tag-text', 'tag-text-outline',
    'sale', 'sale-outline', 'percent', 'percent-outline', 'percent-box', 'percent-box-outline',
    'receipt', 'receipt-outline', 'receipt-text', 'receipt-text-outline',
    'barcode', 'barcode-scan', 'qrcode', 'qrcode-scan',
    'store', 'store-outline', 'store-check', 'store-plus', 'store-search',
    'gift', 'gift-outline', 'gift-open', 'gift-open-outline',
    'package', 'package-variant', 'package-variant-closed', 'package-down', 'package-up',
  ],
  'Media & Files': [
    'image', 'image-outline', 'image-plus', 'image-edit', 'image-album', 'image-multiple',
    'image-filter-hdr', 'image-area', 'image-auto-adjust', 'panorama', 'panorama-outline',
    'camera', 'camera-outline', 'camera-plus', 'camera-plus-outline',
    'camera-switch', 'camera-switch-outline', 'camera-flip', 'camera-flip-outline',
    'camera-burst', 'camera-timer', 'camera-iris', 'camera-enhance',
    'video', 'video-outline', 'video-plus', 'video-plus-outline',
    'video-off', 'video-off-outline', 'video-box', 'video-box-off',
    'video-vintage', 'video-4k-box', 'video-high-definition',
    'music', 'music-note', 'music-note-outline', 'music-note-plus',
    'music-box', 'music-box-outline', 'music-circle', 'music-circle-outline',
    'microphone', 'microphone-outline', 'microphone-plus', 'microphone-off',
    'microphone-variant', 'microphone-variant-off', 'record', 'record-circle',
    'file', 'file-outline', 'file-plus', 'file-plus-outline',
    'file-document', 'file-document-outline', 'file-document-edit', 'file-document-edit-outline',
    'file-pdf-box', 'file-word', 'file-word-box', 'file-excel', 'file-excel-box',
    'file-powerpoint', 'file-powerpoint-box', 'file-image', 'file-video', 'file-music',
    'folder', 'folder-outline', 'folder-open', 'folder-open-outline',
    'folder-plus', 'folder-plus-outline', 'folder-account', 'folder-account-outline',
    'folder-star', 'folder-star-outline', 'folder-heart', 'folder-heart-outline',
    'attachment', 'paperclip', 'link', 'link-variant', 'link-off',
    'download', 'download-outline', 'download-circle', 'download-circle-outline',
    'upload', 'upload-outline', 'upload-circle', 'upload-circle-outline',
    'cloud', 'cloud-outline', 'cloud-download', 'cloud-download-outline',
    'cloud-upload', 'cloud-upload-outline', 'cloud-check', 'cloud-check-outline',
    'cloud-sync', 'cloud-sync-outline', 'cloud-off', 'cloud-off-outline',
    'play', 'play-circle', 'play-circle-outline', 'pause', 'pause-circle', 'pause-circle-outline',
    'stop', 'stop-circle', 'stop-circle-outline', 'skip-next', 'skip-previous',
    'fast-forward', 'rewind', 'repeat', 'repeat-once', 'shuffle', 'shuffle-variant',
  ],
  'Calendar & Time': [
    'calendar', 'calendar-outline', 'calendar-blank', 'calendar-blank-outline',
    'calendar-month', 'calendar-month-outline', 'calendar-week', 'calendar-week-begin',
    'calendar-today', 'calendar-today-outline', 'calendar-range', 'calendar-range-outline',
    'calendar-check', 'calendar-check-outline', 'calendar-clock', 'calendar-clock-outline',
    'calendar-plus', 'calendar-plus-outline', 'calendar-minus', 'calendar-remove',
    'calendar-edit', 'calendar-edit-outline', 'calendar-text', 'calendar-text-outline',
    'calendar-star', 'calendar-star-outline', 'calendar-heart', 'calendar-heart-outline',
    'calendar-alert', 'calendar-alert-outline', 'calendar-question', 'calendar-question-outline',
    'calendar-account', 'calendar-account-outline', 'calendar-multiple', 'calendar-multiple-check',
    'clock', 'clock-outline', 'clock-digital', 'clock-time-four', 'clock-time-eight',
    'clock-alert', 'clock-alert-outline', 'clock-check', 'clock-check-outline',
    'clock-plus', 'clock-plus-outline', 'clock-minus', 'clock-minus-outline',
    'clock-start', 'clock-end', 'clock-fast', 'clock-in', 'clock-out',
    'timer', 'timer-outline', 'timer-sand', 'timer-sand-empty', 'timer-sand-full',
    'timer-off', 'timer-off-outline', 'timer-10', 'timer-3',
    'alarm', 'alarm-check', 'alarm-plus', 'alarm-off', 'alarm-multiple',
    'history', 'update', 'av-timer', 'timelapse', 'timeline', 'timeline-outline',
  ],
  'Social & Sharing': [
    'share', 'share-outline', 'share-circle', 'share-circle-outline',
    'share-variant', 'share-variant-outline', 'share-all', 'share-all-outline',
    'heart', 'heart-outline', 'heart-plus', 'heart-plus-outline',
    'heart-minus', 'heart-minus-outline', 'heart-off', 'heart-off-outline',
    'heart-circle', 'heart-circle-outline', 'heart-multiple', 'heart-multiple-outline',
    'thumb-up', 'thumb-up-outline', 'thumb-down', 'thumb-down-outline',
    'star', 'star-outline', 'star-plus', 'star-plus-outline',
    'star-minus', 'star-minus-outline', 'star-off', 'star-off-outline',
    'star-half-full', 'star-circle', 'star-circle-outline', 'star-box', 'star-box-outline',
    'bookmark', 'bookmark-outline', 'bookmark-plus', 'bookmark-plus-outline',
    'bookmark-minus', 'bookmark-minus-outline', 'bookmark-check', 'bookmark-check-outline',
    'bookmark-multiple', 'bookmark-multiple-outline', 'bookmark-off', 'bookmark-off-outline',
    'flag', 'flag-outline', 'flag-plus', 'flag-plus-outline',
    'flag-minus', 'flag-minus-outline', 'flag-checkered', 'flag-variant',
    'trophy', 'trophy-outline', 'trophy-award', 'trophy-variant', 'trophy-variant-outline',
    'medal', 'medal-outline', 'podium', 'podium-gold', 'podium-silver', 'podium-bronze',
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'whatsapp',
    'pinterest', 'snapchat', 'reddit', 'discord', 'slack', 'telegram',
    'google', 'apple', 'microsoft', 'github', 'gitlab',
  ],
  'Settings & Tools': [
    'cog', 'cog-outline', 'cog-box', 'cogs', 'cog-transfer', 'cog-transfer-outline',
    'wrench', 'wrench-outline', 'wrench-cog', 'wrench-cog-outline',
    'hammer', 'hammer-wrench', 'screwdriver', 'tools',
    'tune', 'tune-vertical', 'tune-variant', 'equalizer', 'equalizer-outline',
    'palette', 'palette-outline', 'palette-swatch', 'palette-swatch-outline',
    'format-paint', 'brush', 'brush-outline', 'spray', 'spray-bottle',
    'lock', 'lock-outline', 'lock-open', 'lock-open-outline',
    'lock-plus', 'lock-plus-outline', 'lock-check', 'lock-check-outline',
    'lock-alert', 'lock-alert-outline', 'lock-clock', 'lock-reset',
    'key', 'key-outline', 'key-plus', 'key-minus', 'key-variant', 'key-chain', 'key-chain-variant',
    'shield', 'shield-outline', 'shield-check', 'shield-check-outline',
    'shield-plus', 'shield-plus-outline', 'shield-lock', 'shield-lock-outline',
    'shield-account', 'shield-account-outline', 'shield-alert', 'shield-alert-outline',
    'security', 'security-network', 'fingerprint', 'fingerprint-off',
    'eye', 'eye-outline', 'eye-off', 'eye-off-outline', 'eye-check', 'eye-check-outline',
    'incognito', 'incognito-circle', 'incognito-off',
    'database', 'database-outline', 'database-plus', 'database-minus',
    'database-check', 'database-search', 'database-sync', 'database-lock',
    'server', 'server-network', 'server-security', 'nas', 'harddisk',
    'code-tags', 'code-braces', 'code-brackets', 'code-json', 'xml',
    'bug', 'bug-outline', 'bug-check', 'bug-check-outline',
  ],
  'Status & Info': [
    'information', 'information-outline', 'information-variant', 'information-box', 'information-box-outline',
    'help-circle', 'help-circle-outline', 'help-box', 'help-rhombus', 'help-rhombus-outline',
    'alert', 'alert-outline', 'alert-box', 'alert-box-outline',
    'alert-circle', 'alert-circle-outline', 'alert-octagon', 'alert-octagon-outline',
    'alert-rhombus', 'alert-rhombus-outline', 'alert-decagram', 'alert-decagram-outline',
    'check-circle', 'check-circle-outline', 'check-decagram', 'check-decagram-outline',
    'check-bold', 'check-all', 'checkbox-marked', 'checkbox-marked-outline',
    'checkbox-blank', 'checkbox-blank-outline', 'checkbox-intermediate',
    'close-circle', 'close-circle-outline', 'close-octagon', 'close-octagon-outline',
    'close-box', 'close-box-outline', 'cancel',
    'progress-check', 'progress-clock', 'progress-download', 'progress-upload',
    'loading', 'sync', 'sync-circle', 'sync-alert', 'sync-off',
    'cached', 'autorenew', 'rotate-right', 'rotate-left',
    'circle', 'circle-outline', 'circle-slice-1', 'circle-slice-2', 'circle-slice-3',
    'circle-slice-4', 'circle-slice-5', 'circle-slice-6', 'circle-slice-7', 'circle-slice-8',
    'checkbox-blank-circle', 'checkbox-blank-circle-outline',
    'checkbox-marked-circle', 'checkbox-marked-circle-outline',
    'radiobox-blank', 'radiobox-marked', 'toggle-switch', 'toggle-switch-off',
  ],
  'Weather & Nature': [
    'weather-sunny', 'weather-sunny-alert', 'weather-sunny-off',
    'weather-cloudy', 'weather-cloudy-alert', 'weather-partly-cloudy',
    'weather-rainy', 'weather-pouring', 'weather-lightning', 'weather-lightning-rainy',
    'weather-snowy', 'weather-snowy-heavy', 'weather-snowy-rainy',
    'weather-fog', 'weather-hazy', 'weather-windy', 'weather-windy-variant',
    'weather-hurricane', 'weather-tornado', 'weather-night', 'weather-night-partly-cloudy',
    'thermometer', 'thermometer-plus', 'thermometer-minus', 'thermometer-high', 'thermometer-low',
    'temperature-celsius', 'temperature-fahrenheit', 'temperature-kelvin',
    'water', 'water-outline', 'water-off', 'water-off-outline',
    'water-percent', 'water-plus', 'water-minus', 'water-check',
    'waves', 'wave', 'tsunami',
    'fire', 'fire-alert', 'fire-off', 'flame', 'candle',
    'leaf', 'leaf-maple', 'leaf-circle', 'leaf-circle-outline',
    'flower', 'flower-outline', 'flower-tulip', 'flower-tulip-outline',
    'tree', 'tree-outline', 'pine-tree', 'pine-tree-box', 'palm-tree',
    'grass', 'sprout', 'sprout-outline', 'seed', 'seed-outline',
    'sun-compass', 'moon-waning-crescent', 'moon-waxing-crescent', 'moon-full',
    'star-shooting', 'star-crescent', 'earth', 'earth-box', 'globe-model',
    'mountain', 'terrain', 'image-filter-hdr',
  ],
  'Food & Drink': [
    'food', 'food-outline', 'food-variant', 'food-variant-off',
    'food-apple', 'food-apple-outline', 'food-croissant', 'food-drumstick', 'food-drumstick-outline',
    'food-fork-drink', 'food-off', 'food-steak', 'food-steak-off',
    'food-turkey', 'food-hot-dog', 'noodles',
    'silverware', 'silverware-clean', 'silverware-fork', 'silverware-fork-knife', 'silverware-spoon',
    'silverware-variant', 'knife', 'spoon',
    'coffee', 'coffee-outline', 'coffee-maker', 'coffee-maker-outline', 'coffee-to-go', 'coffee-to-go-outline',
    'cup', 'cup-outline', 'cup-water', 'cup-off', 'cup-off-outline',
    'mug', 'mug-outline', 'mug-hot', 'tea', 'tea-outline',
    'glass-cocktail', 'glass-flute', 'glass-mug', 'glass-mug-variant', 'glass-pint-outline',
    'glass-stange', 'glass-tulip', 'glass-wine', 'glass-fragile',
    'beer', 'beer-outline', 'bottle-wine', 'bottle-wine-outline',
    'liquor', 'bottle-soda', 'bottle-soda-classic', 'bottle-soda-outline',
    'pizza', 'hamburger', 'french-fries', 'taco', 'burrito',
    'ice-cream', 'ice-pop', 'cupcake', 'cake', 'cake-layered', 'cake-variant',
    'cookie', 'cookie-outline', 'candy', 'candy-outline', 'candycane',
    'fruit-cherries', 'fruit-citrus', 'fruit-grapes', 'fruit-pineapple', 'fruit-watermelon',
    'carrot', 'corn', 'chili-mild', 'chili-hot', 'peanut', 'peanut-outline',
    'egg', 'egg-outline', 'egg-fried', 'cheese', 'bread-slice', 'bread-slice-outline',
    'baguette', 'pretzel', 'rice', 'sausage', 'pasta',
  ],
  'Health & Fitness': [
    'heart-pulse', 'pulse', 'hospital', 'hospital-box', 'hospital-box-outline',
    'hospital-building', 'hospital-marker', 'ambulance',
    'medical-bag', 'medical-cotton-swab', 'medication', 'medication-outline',
    'pill', 'pill-multiple', 'pill-off', 'prescription',
    'needle', 'needle-off', 'iv-bag', 'blood-bag',
    'bandage', 'band-aid', 'stethoscope', 'thermometer',
    'wheelchair', 'wheelchair-accessibility', 'walk', 'human-cane',
    'dumbbell', 'weight', 'weight-lifter', 'weight-kilogram', 'weight-pound',
    'run', 'run-fast', 'walk', 'hiking', 'bike', 'swim',
    'yoga', 'meditation', 'karate', 'boxing-glove', 'tennis', 'basketball',
    'soccer', 'football', 'baseball', 'golf', 'hockey-sticks',
    'ski', 'ski-cross-country', 'ski-water', 'snowboard', 'skateboard',
    'gymnastics', 'rowing', 'kayaking', 'diving', 'diving-scuba',
    'apple', 'food-apple', 'scale-bathroom', 'tape-measure',
    'sleep', 'sleep-off', 'bed', 'bed-outline',
    'brain', 'emoticon', 'emoticon-happy', 'emoticon-sad', 'emoticon-neutral',
  ],
  'Education & Work': [
    'book', 'book-outline', 'book-open', 'book-open-outline', 'book-open-page-variant',
    'book-plus', 'book-minus', 'book-check', 'book-search', 'book-multiple',
    'book-education', 'book-alphabet', 'bookshelf', 'library', 'library-outline',
    'notebook', 'notebook-outline', 'notebook-multiple', 'notebook-check', 'notebook-edit',
    'school', 'school-outline', 'graduation-cap', 'account-school', 'account-school-outline',
    'pencil', 'pencil-outline', 'pencil-box', 'pencil-box-outline',
    'lead-pencil', 'pen', 'pen-plus', 'pen-minus', 'pen-off',
    'eraser', 'eraser-variant', 'marker', 'highlighter',
    'ruler', 'ruler-square', 'ruler-square-compass', 'compass-outline', 'protractor',
    'calculator', 'calculator-variant', 'calculator-variant-outline',
    'clipboard', 'clipboard-outline', 'clipboard-text', 'clipboard-text-outline',
    'clipboard-check', 'clipboard-check-outline', 'clipboard-list', 'clipboard-list-outline',
    'briefcase', 'briefcase-outline', 'briefcase-variant', 'briefcase-variant-outline',
    'briefcase-check', 'briefcase-download', 'briefcase-upload', 'briefcase-search',
    'desk', 'desk-lamp', 'chair-rolling', 'chair-school',
    'presentation', 'presentation-play', 'projector', 'projector-screen',
    'certificate', 'certificate-outline', 'license', 'card-account-details',
    'id-card', 'badge-account', 'badge-account-outline',
  ],
  'Devices & Electronics': [
    'cellphone', 'cellphone-basic', 'cellphone-link', 'cellphone-off',
    'cellphone-settings', 'cellphone-wireless', 'cellphone-message',
    'tablet', 'tablet-android', 'tablet-cellphone', 'tablet-dashboard',
    'laptop', 'laptop-off', 'laptop-mac', 'laptop-windows', 'laptop-chromebook',
    'desktop-mac', 'desktop-classic', 'desktop-tower', 'desktop-tower-monitor',
    'monitor', 'monitor-multiple', 'monitor-screenshot', 'monitor-speaker',
    'television', 'television-classic', 'television-guide', 'television-off',
    'remote', 'remote-tv', 'remote-off', 'gamepad', 'gamepad-variant',
    'keyboard', 'keyboard-outline', 'keyboard-off', 'keyboard-settings',
    'mouse', 'mouse-bluetooth', 'mouse-variant', 'mouse-off',
    'printer', 'printer-outline', 'printer-3d', 'printer-pos',
    'scanner', 'fax', 'projector', 'webcam', 'webcam-off',
    'headphones', 'headphones-bluetooth', 'headphones-box', 'headphones-off', 'headphones-settings',
    'speaker', 'speaker-bluetooth', 'speaker-multiple', 'speaker-off', 'speaker-wireless',
    'microphone', 'microphone-outline', 'microphone-off', 'microphone-settings',
    'camera', 'camera-outline', 'camera-off', 'camera-wireless', 'camera-gopro',
    'watch', 'watch-variant', 'watch-vibrate', 'watch-export', 'watch-import',
    'usb', 'usb-flash-drive', 'usb-port', 'sd', 'micro-sd',
    'memory', 'chip', 'cpu-32-bit', 'cpu-64-bit', 'expansion-card',
    'battery', 'battery-outline', 'battery-charging', 'battery-plus', 'battery-minus',
    'battery-10', 'battery-20', 'battery-30', 'battery-40', 'battery-50',
    'battery-60', 'battery-70', 'battery-80', 'battery-90', 'battery-100',
    'power-plug', 'power-plug-off', 'power-socket', 'power-socket-us', 'power-socket-eu',
    'wifi', 'wifi-off', 'wifi-strength-1', 'wifi-strength-2', 'wifi-strength-3', 'wifi-strength-4',
    'bluetooth', 'bluetooth-off', 'bluetooth-connect', 'bluetooth-settings',
    'signal', 'signal-off', 'signal-cellular-1', 'signal-cellular-2', 'signal-cellular-3',
    'antenna', 'access-point', 'access-point-network', 'router-wireless', 'router-wireless-settings',
    'ethernet', 'ethernet-cable', 'network', 'network-outline', 'network-off',
  ],
  'Actions & Misc': [
    'logout', 'login', 'exit-to-app', 'exit-run', 'location-exit', 'location-enter',
    'open-in-new', 'open-in-app', 'launch', 'export', 'import',
    'content-copy', 'content-cut', 'content-paste', 'content-save', 'content-save-outline',
    'delete', 'delete-outline', 'delete-forever', 'delete-sweep', 'trash-can', 'trash-can-outline',
    'restore', 'restore-alert', 'backup-restore', 'undo', 'redo', 'undo-variant', 'redo-variant',
    'archive', 'archive-outline', 'archive-arrow-down', 'archive-arrow-up',
    'pin', 'pin-outline', 'pin-off', 'pin-off-outline',
    'gesture-tap', 'gesture-tap-hold', 'gesture-double-tap', 'gesture-swipe',
    'gesture-swipe-left', 'gesture-swipe-right', 'gesture-swipe-up', 'gesture-swipe-down',
    'hand-pointing-right', 'hand-pointing-left', 'hand-pointing-up', 'hand-pointing-down',
    'cursor-default', 'cursor-default-click', 'cursor-pointer', 'cursor-move',
    'drag', 'drag-horizontal', 'drag-vertical', 'drag-variant',
    'resize', 'resize-bottom-right', 'arrow-expand-all', 'arrow-collapse-all',
    'fullscreen', 'fullscreen-exit', 'fit-to-screen', 'fit-to-page',
    'crop', 'crop-free', 'crop-landscape', 'crop-portrait', 'crop-square', 'crop-rotate',
    'rotate-left', 'rotate-right', 'rotate-3d', 'rotate-3d-variant', 'flip-horizontal', 'flip-vertical',
    'format-align-left', 'format-align-center', 'format-align-right', 'format-align-justify',
    'format-bold', 'format-italic', 'format-underline', 'format-strikethrough',
    'format-list-bulleted', 'format-list-numbered', 'format-list-checks',
    'table', 'table-large', 'table-column', 'table-row', 'table-plus', 'table-minus',
    'chart-bar', 'chart-line', 'chart-pie', 'chart-donut', 'chart-areaspline',
    'poll', 'poll-box', 'finance', 'trending-up', 'trending-down', 'trending-neutral',
    'qrcode', 'qrcode-scan', 'barcode', 'barcode-scan', 'nfc', 'nfc-tap',
    'contactless-payment', 'contactless-payment-circle',
    'lightbulb', 'lightbulb-outline', 'lightbulb-on', 'lightbulb-on-outline',
    'lightbulb-off', 'lightbulb-off-outline', 'lightbulb-group', 'lightbulb-group-outline',
    'flash', 'flash-outline', 'flash-off', 'flash-off-outline', 'flash-auto',
    'party-popper', 'balloon', 'cake-variant', 'firework', 'confetti',
    'paw', 'paw-outline', 'paw-off', 'paw-off-outline',
    'dog', 'dog-side', 'cat', 'rabbit', 'turtle', 'fish', 'bird', 'owl', 'duck', 'penguin',
    'emoticon', 'emoticon-outline', 'emoticon-happy', 'emoticon-happy-outline',
    'emoticon-sad', 'emoticon-sad-outline', 'emoticon-neutral', 'emoticon-neutral-outline',
    'emoticon-cool', 'emoticon-cool-outline', 'emoticon-excited', 'emoticon-excited-outline',
    'emoticon-wink', 'emoticon-wink-outline', 'emoticon-tongue', 'emoticon-dead', 'emoticon-devil',
    'robot', 'robot-outline', 'robot-happy', 'robot-happy-outline',
    'alien', 'alien-outline', 'ghost', 'ghost-outline', 'ghost-off', 'ghost-off-outline',
    'skull', 'skull-outline', 'skull-crossbones', 'skull-crossbones-outline',
  ],
};

// Flatten all icons for search
export const ALL_MDI_ICONS = Object.values(MDI_ICONS).flat();

// Convert icon name to mdi path key (e.g., 'home' -> 'mdiHome')
const toMdiKey = (iconName: string): string => {
  return 'mdi' + iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Get MDI path by icon name
const getMdiPath = (iconName: string): string | null => {
  const key = toMdiKey(iconName);
  return (mdiIcons as any)[key] || null;
};

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

export default function IconPicker({ value, onChange, placeholder = 'Select icon' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter icons based on search and category - use useMemo for proper reactivity
  const filteredIcons = useMemo(() => {
    let icons: string[] = [];
    
    if (selectedCategory) {
      icons = MDI_ICONS[selectedCategory] || [];
    } else {
      icons = ALL_MDI_ICONS;
    }
    
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      icons = icons.filter((iconName) =>
        iconName.toLowerCase().includes(query)
      );
    }
    
    // Remove duplicates
    return Array.from(new Set(icons));
  }, [searchQuery, selectedCategory]);

  const selectedIconPath = value ? getMdiPath(value) : null;

  return (
    <>
      {/* Icon Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
        title={value || placeholder}
      >
        {selectedIconPath ? (
          <Icon path={selectedIconPath} size={0.8} className="text-gray-700" />
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="ml-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Select Icon</h2>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Categories */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {Object.keys(MDI_ICONS).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <p className="mt-3 text-xs text-gray-500">
                {filteredIcons.length} icons • MaterialCommunityIcons (same icons in mobile app)
              </p>
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredIcons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No icons found matching "{searchQuery}"</div>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredIcons.map((iconName) => {
                    const iconPath = getMdiPath(iconName);
                    if (!iconPath) return null;
                    
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => {
                          onChange(iconName);
                          setIsOpen(false);
                          setSearchQuery('');
                          setSelectedCategory(null);
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50 transition-colors ${
                          value === iconName ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50'
                        }`}
                        title={iconName}
                      >
                        <Icon path={iconPath} size={1} className="text-gray-700" />
                        <span className="mt-1 text-[10px] text-gray-500 truncate w-full text-center">
                          {iconName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {value ? (
                  <span className="flex items-center gap-2">
                    Selected: <strong>{value}</strong>
                    {selectedIconPath && <Icon path={selectedIconPath} size={0.7} />}
                  </span>
                ) : (
                  'No icon selected'
                )}
              </div>
              <div className="flex gap-2">
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
