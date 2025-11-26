import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import Button from './ui/Button';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownOptionsManagerProps {
  options: DropdownOption[];
  onChange: (options: DropdownOption[]) => void;
  disabled?: boolean;
}

export default function DropdownOptionsManager({ 
  options, 
  onChange, 
  disabled = false 
}: DropdownOptionsManagerProps) {
  const [localOptions, setLocalOptions] = useState<DropdownOption[]>(options || []);

  useEffect(() => {
    setLocalOptions(options || []);
  }, [options]);

  const handleAddOption = () => {
    const newOptions = [...localOptions, { label: '', value: '' }];
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const handleUpdateOption = (index: number, field: 'label' | 'value', value: string) => {
    const newOptions = [...localOptions];
    newOptions[index][field] = value;
    
    // Auto-generate value from label if value is empty
    if (field === 'label' && !newOptions[index].value) {
      newOptions[index].value = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localOptions.length - 1)
    ) {
      return;
    }

    const newOptions = [...localOptions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];
    
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Dropdown Options
        </label>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddOption}
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Option
        </Button>
      </div>

      {localOptions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No options yet. Click "Add Option" to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {localOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <button
                type="button"
                className="cursor-move text-gray-400 hover:text-gray-600"
                disabled={disabled}
              >
                <GripVertical className="w-4 h-4" />
              </button>

              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
                    placeholder="Display text (e.g., House)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={disabled}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
                    placeholder="Saved value (e.g., house)"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveOption(index, 'up')}
                  disabled={disabled || index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveOption(index, 'down')}
                  disabled={disabled || index === localOptions.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  disabled={disabled}
                  className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500">
        <strong>Label:</strong> What users see in the dropdown<br />
        <strong>Value:</strong> What gets saved to the database (auto-generated from label if empty)
      </p>
    </div>
  );
}
