'use client';

import { useState } from 'react';
import Icon from '@mdi/react';
import * as mdiIcons from '@mdi/js';
import { X, Search } from 'lucide-react';

// Popular MaterialCommunityIcons for mobile apps - organized by category
// These names match react-native-vector-icons/MaterialCommunityIcons
export const MDI_ICONS: { [category: string]: string[] } = {
  'Navigation & Menu': [
    'home', 'home-outline', 'menu', 'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
    'chevron-left', 'chevron-right', 'chevron-up', 'chevron-down', 'close', 'check',
    'dots-horizontal', 'dots-vertical', 'plus', 'minus', 'magnify', 'filter', 'sort',
  ],
  'User & Account': [
    'account', 'account-outline', 'account-circle', 'account-circle-outline',
    'account-group', 'account-group-outline', 'account-plus', 'account-minus',
    'account-edit', 'account-settings', 'account-check', 'account-cancel',
    'face-man', 'face-woman', 'human-male', 'human-female',
  ],
  'Communication': [
    'email', 'email-outline', 'email-open', 'email-send', 'email-receive',
    'message', 'message-outline', 'message-text', 'message-text-outline',
    'chat', 'chat-outline', 'chat-processing', 'forum', 'forum-outline',
    'phone', 'phone-outline', 'phone-in-talk', 'phone-message',
    'bell', 'bell-outline', 'bell-ring', 'bell-off',
  ],
  'Buildings & Places': [
    'home-city', 'home-city-outline', 'office-building', 'office-building-outline',
    'domain', 'city', 'city-variant', 'city-variant-outline',
    'warehouse', 'store', 'store-outline', 'storefront', 'storefront-outline',
    'hospital-building', 'school', 'bank', 'church', 'mosque', 'synagogue',
    'apartment', 'home-modern', 'home-variant', 'home-variant-outline',
    'greenhouse', 'barn', 'silo', 'factory', 'castle', 'tower-fire',
  ],
  'Travel & Transport': [
    'car', 'car-outline', 'bus', 'train', 'airplane', 'ship-wheel',
    'bike', 'motorbike', 'walk', 'run', 'taxi', 'truck',
    'map', 'map-outline', 'map-marker', 'map-marker-outline', 'compass', 'compass-outline',
    'navigation', 'navigation-outline', 'directions', 'road', 'highway',
  ],
  'Shopping & Commerce': [
    'cart', 'cart-outline', 'shopping', 'shopping-outline',
    'basket', 'basket-outline', 'bag-personal', 'bag-personal-outline',
    'cash', 'cash-multiple', 'credit-card', 'credit-card-outline',
    'wallet', 'wallet-outline', 'currency-usd', 'tag', 'tag-outline',
    'sale', 'percent', 'receipt', 'barcode', 'qrcode',
  ],
  'Media & Files': [
    'image', 'image-outline', 'camera', 'camera-outline', 'video', 'video-outline',
    'music', 'music-note', 'microphone', 'microphone-outline',
    'file', 'file-outline', 'file-document', 'file-document-outline',
    'folder', 'folder-outline', 'folder-open', 'folder-open-outline',
    'attachment', 'paperclip', 'download', 'upload', 'cloud-download', 'cloud-upload',
  ],
  'Calendar & Time': [
    'calendar', 'calendar-outline', 'calendar-month', 'calendar-today',
    'calendar-check', 'calendar-clock', 'calendar-plus', 'calendar-edit',
    'clock', 'clock-outline', 'timer', 'timer-outline', 'alarm', 'history',
  ],
  'Social & Sharing': [
    'share', 'share-outline', 'share-variant', 'share-variant-outline',
    'heart', 'heart-outline', 'thumb-up', 'thumb-up-outline', 'thumb-down', 'thumb-down-outline',
    'star', 'star-outline', 'star-half-full', 'bookmark', 'bookmark-outline',
    'comment', 'comment-outline', 'comment-text', 'comment-text-outline',
  ],
  'Settings & Tools': [
    'cog', 'cog-outline', 'wrench', 'wrench-outline', 'hammer', 'screwdriver',
    'tune', 'tune-vertical', 'palette', 'palette-outline',
    'lock', 'lock-outline', 'lock-open', 'lock-open-outline',
    'key', 'key-outline', 'shield', 'shield-outline', 'security',
  ],
  'Status & Info': [
    'information', 'information-outline', 'help-circle', 'help-circle-outline',
    'alert', 'alert-outline', 'alert-circle', 'alert-circle-outline',
    'check-circle', 'check-circle-outline', 'close-circle', 'close-circle-outline',
    'progress-check', 'progress-clock', 'loading', 'sync',
  ],
  'Weather & Nature': [
    'weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy',
    'thermometer', 'water', 'water-outline', 'fire', 'leaf', 'flower', 'tree',
  ],
  'Food & Drink': [
    'food', 'food-outline', 'food-apple', 'food-fork-drink', 'silverware-fork-knife',
    'coffee', 'coffee-outline', 'cup', 'glass-cocktail', 'beer', 'bottle-wine',
    'pizza', 'hamburger', 'ice-cream', 'cake', 'fruit-cherries',
  ],
  'Health & Fitness': [
    'heart-pulse', 'hospital-box', 'medical-bag', 'pill', 'needle',
    'dumbbell', 'weight-lifter', 'run-fast', 'yoga', 'meditation',
  ],
  'Misc': [
    'gift', 'gift-outline', 'party-popper', 'balloon', 'cake-variant',
    'paw', 'dog', 'cat', 'fish', 'bird',
    'lightbulb', 'lightbulb-outline', 'flash', 'flash-outline',
    'book', 'book-outline', 'book-open-page-variant', 'notebook',
    'pencil', 'pencil-outline', 'lead-pencil', 'eraser',
    'printer', 'printer-outline', 'fax', 'scanner',
    'television', 'laptop', 'cellphone', 'tablet', 'desktop-mac',
    'wifi', 'bluetooth', 'signal', 'antenna',
    'power', 'power-plug', 'battery', 'battery-charging',
    'logout', 'login', 'exit-to-app', 'open-in-new',
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

  // Filter icons based on search and category
  const getFilteredIcons = () => {
    let icons: string[] = [];
    
    if (selectedCategory) {
      icons = MDI_ICONS[selectedCategory] || [];
    } else {
      icons = ALL_MDI_ICONS;
    }
    
    if (searchQuery) {
      icons = icons.filter((iconName) =>
        iconName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return icons;
  };

  const filteredIcons = getFilteredIcons();
  const selectedIconPath = value ? getMdiPath(value) : null;

  return (
    <>
      {/* Icon Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50"
      >
        {selectedIconPath ? (
          <>
            <Icon path={selectedIconPath} size={0.8} className="text-gray-700" />
            <span className="text-gray-700">{value}</span>
          </>
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
