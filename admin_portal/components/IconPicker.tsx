'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

// Common icons that work in both Ionicons (mobile) and are easy to represent
export const AVAILABLE_ICONS = [
  { name: 'home', label: 'Home', symbol: '🏠' },
  { name: 'search', label: 'Search', symbol: '🔍' },
  { name: 'heart', label: 'Heart / Favorites', symbol: '❤️' },
  { name: 'person', label: 'Person / Profile', symbol: '👤' },
  { name: 'settings', label: 'Settings', symbol: '⚙️' },
  { name: 'list', label: 'List', symbol: '📋' },
  { name: 'grid', label: 'Grid', symbol: '▦' },
  { name: 'map', label: 'Map', symbol: '🗺️' },
  { name: 'calendar', label: 'Calendar', symbol: '📅' },
  { name: 'time', label: 'Time', symbol: '🕐' },
  { name: 'notifications', label: 'Notifications', symbol: '🔔' },
  { name: 'mail', label: 'Mail / Messages', symbol: '✉️' },
  { name: 'chatbubble', label: 'Chat', symbol: '💬' },
  { name: 'camera', label: 'Camera', symbol: '📷' },
  { name: 'image', label: 'Image / Photos', symbol: '🖼️' },
  { name: 'star', label: 'Star / Rating', symbol: '⭐' },
  { name: 'location', label: 'Location', symbol: '📍' },
  { name: 'navigate', label: 'Navigate', symbol: '🧭' },
  { name: 'book', label: 'Book', symbol: '📖' },
  { name: 'bookmark', label: 'Bookmark', symbol: '🔖' },
  { name: 'cart', label: 'Cart', symbol: '🛒' },
  { name: 'card', label: 'Card / Payment', symbol: '💳' },
  { name: 'cash', label: 'Cash / Money', symbol: '💵' },
  { name: 'gift', label: 'Gift', symbol: '🎁' },
  { name: 'pricetag', label: 'Price Tag', symbol: '🏷️' },
  { name: 'menu', label: 'Menu', symbol: '☰' },
  { name: 'more', label: 'More Options', symbol: '⋯' },
  { name: 'add', label: 'Add', symbol: '➕' },
  { name: 'create', label: 'Create', symbol: '✏️' },
  { name: 'trash', label: 'Delete', symbol: '🗑️' },
  { name: 'close', label: 'Close', symbol: '✕' },
  { name: 'checkmark', label: 'Checkmark', symbol: '✓' },
  { name: 'key', label: 'Key / Security', symbol: '🔑' },
  { name: 'lock-closed', label: 'Lock', symbol: '🔒' },
  { name: 'shield', label: 'Shield', symbol: '🛡️' },
  { name: 'eye', label: 'Eye / View', symbol: '👁️' },
  { name: 'download', label: 'Download', symbol: '⬇️' },
  { name: 'upload', label: 'Upload', symbol: '⬆️' },
  { name: 'share', label: 'Share', symbol: '↗️' },
  { name: 'document', label: 'Document', symbol: '📄' },
  { name: 'folder', label: 'Folder', symbol: '📁' },
  { name: 'cloud', label: 'Cloud', symbol: '☁️' },
  { name: 'wifi', label: 'WiFi', symbol: '📶' },
  { name: 'phone-portrait', label: 'Phone', symbol: '📱' },
  { name: 'call', label: 'Call', symbol: '📞' },
  { name: 'videocam', label: 'Video', symbol: '🎥' },
  { name: 'play', label: 'Play', symbol: '▶️' },
  { name: 'pause', label: 'Pause', symbol: '⏸️' },
  { name: 'musical-notes', label: 'Music', symbol: '🎵' },
  { name: 'happy', label: 'Happy', symbol: '😊' },
  { name: 'help-circle', label: 'Help', symbol: '❓' },
  { name: 'information-circle', label: 'Information', symbol: 'ℹ️' },
  { name: 'warning', label: 'Warning', symbol: '⚠️' },
  { name: 'business', label: 'Business', symbol: '💼' },
  { name: 'storefront', label: 'Store', symbol: '🏪' },
  { name: 'restaurant', label: 'Restaurant', symbol: '🍽️' },
  { name: 'bed', label: 'Hotel / Bed', symbol: '🛏️' },
  { name: 'car', label: 'Car', symbol: '🚗' },
  { name: 'airplane', label: 'Airplane', symbol: '✈️' },
  { name: 'train', label: 'Train', symbol: '🚆' },
  { name: 'bicycle', label: 'Bicycle', symbol: '🚲' },
  { name: 'walk', label: 'Walk', symbol: '🚶' },
  { name: 'fitness', label: 'Fitness', symbol: '💪' },
  { name: 'barbell', label: 'Gym', symbol: '🏋️' },
  { name: 'trophy', label: 'Trophy', symbol: '🏆' },
  { name: 'flag', label: 'Flag', symbol: '🚩' },
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

export default function IconPicker({ value, onChange, placeholder = 'Select icon' }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredIcons = AVAILABLE_ICONS.filter(
    (icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedIcon = AVAILABLE_ICONS.find((icon) => icon.name === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white flex items-center justify-between hover:bg-gray-50"
      >
        <span className="flex items-center gap-2">
          {selectedIcon ? (
            <>
              <span className="text-lg">{selectedIcon.symbol}</span>
              <span className="text-gray-700">{selectedIcon.name}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Icon List */}
          <div className="overflow-y-auto p-2">
            {filteredIcons.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">No icons found</div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => {
                      onChange(icon.name);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 px-2 py-2 rounded text-left text-sm hover:bg-blue-50 ${
                      value === icon.name ? 'bg-blue-100' : ''
                    }`}
                  >
                    <span className="text-lg">{icon.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{icon.label}</div>
                      <div className="text-xs text-gray-500 truncate">{icon.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
