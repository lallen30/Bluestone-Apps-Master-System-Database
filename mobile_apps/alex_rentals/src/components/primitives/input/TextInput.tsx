import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { TextInputConfig, PrimitiveProps } from '../types';

interface TextInputProps extends PrimitiveProps {
  config: TextInputConfig;
  value?: string;
  onChange?: (field_key: string, value: string) => void;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({ config, value, onChange, error }) => {
  const handleChange = (text: string) => {
    onChange?.(config.field_key, text);
  };

  return (
    <View style={styles.container}>
      {config.label && (
        <Text style={styles.label}>
          {config.label}
          {config.required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      )}
      <RNTextInput
        style={[
          styles.input,
          config.multiline && { height: (config.numberOfLines ?? 4) * 24, textAlignVertical: 'top' },
          error && styles.inputError,
        ]}
        value={value ?? config.defaultValue}
        onChangeText={handleChange}
        placeholder={config.placeholder}
        placeholderTextColor="#8E8E93"
        secureTextEntry={config.secureTextEntry}
        keyboardType={config.keyboardType}
        autoCapitalize={config.autoCapitalize}
        multiline={config.multiline}
        numberOfLines={config.numberOfLines}
        editable={!config.disabled}
        maxLength={config.validation?.maxLength}
      />
      {error && <Text style={styles.error}>{error}</Text>}
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
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  error: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
});

export default TextInput;
