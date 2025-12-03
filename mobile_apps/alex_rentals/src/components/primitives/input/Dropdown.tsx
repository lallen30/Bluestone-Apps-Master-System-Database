import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DropdownConfig, PrimitiveProps } from '../types';

interface DropdownProps extends PrimitiveProps {
  config: DropdownConfig;
  value?: string;
  onChange?: (field_key: string, value: string) => void;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ config, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Use value prop, or fall back to defaultValue from config
  const currentValue = value ?? config.defaultValue;
  const selectedOption = config.options?.find(opt => opt.value === currentValue);

  const handleSelect = (optionValue: string) => {
    onChange?.(config.field_key, optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {config.label && (
        <Text style={styles.label}>
          {config.label}
          {config.required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => !config.disabled && setIsOpen(true)}
        disabled={config.disabled}
      >
        <Text style={[styles.selectorText, !selectedOption && styles.placeholder]}>
          {selectedOption?.label ?? config.placeholder ?? 'Select...'}
        </Text>
        <Icon name="chevron-down" size={20} color="#8E8E93" />
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.overlay} onPress={() => setIsOpen(false)} activeOpacity={1}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{config.label ?? 'Select'}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Icon name="close" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={config.options || []}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === currentValue && styles.optionSelected]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[styles.optionText, item.value === currentValue && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {item.value === currentValue && <Icon name="check" size={20} color="#007AFF" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  selector: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectorError: {
    borderColor: '#FF3B30',
  },
  selectorText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  placeholder: {
    color: '#8E8E93',
  },
  error: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  optionSelected: {
    backgroundColor: '#F2F2F7',
  },
  optionText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default Dropdown;
