import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DataFieldConfig, PrimitiveProps } from '../types';

interface DataFieldProps extends PrimitiveProps {
  config: DataFieldConfig;
}

const formatValue = (value: any, format?: string, prefix?: string, suffix?: string): string => {
  if (value === null || value === undefined) return '-';

  let formatted = String(value);

  switch (format) {
    case 'currency':
      formatted = `$${parseFloat(value).toFixed(2)}`;
      break;
    case 'number':
      formatted = parseFloat(value).toLocaleString();
      break;
    case 'percentage':
      formatted = `${parseFloat(value).toFixed(1)}%`;
      break;
    case 'date':
      formatted = new Date(value).toLocaleDateString();
      break;
    default:
      formatted = String(value);
  }

  return `${prefix ?? ''}${formatted}${suffix ?? ''}`;
};

const DataField: React.FC<DataFieldProps> = ({ config, data }) => {
  // Resolve field path from data
  let value = data;
  if (config.field && data) {
    const path = config.field.replace('$.', '').split('.');
    for (const key of path) {
      if (value && typeof value === 'object') {
        value = value[key];
      }
    }
  }

  const formattedValue = formatValue(value, config.format, config.prefix, config.suffix);

  return (
    <View style={styles.container}>
      {config.label && <Text style={styles.label}>{config.label}</Text>}
      <Text style={styles.value}>{formattedValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '500',
  },
});

export default DataField;
