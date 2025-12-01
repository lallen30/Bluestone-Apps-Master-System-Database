import React from 'react';
import { View, Text, Switch as RNSwitch, StyleSheet } from 'react-native';
import { SwitchConfig, PrimitiveProps } from '../types';

interface SwitchProps extends PrimitiveProps {
  config: SwitchConfig;
  value?: boolean;
  onChange?: (field_key: string, value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ config, value, onChange }) => {
  const handleChange = (newValue: boolean) => {
    onChange?.(config.field_key, newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{config.label}</Text>
      <RNSwitch
        value={value ?? false}
        onValueChange={handleChange}
        trackColor={{
          false: config.offColor ?? '#E5E5EA',
          true: config.onColor ?? '#34C759',
        }}
        thumbColor="#FFFFFF"
        disabled={config.disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
});

export default Switch;
