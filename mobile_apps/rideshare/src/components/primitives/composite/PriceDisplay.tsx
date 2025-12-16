import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PriceDisplayConfig, PrimitiveProps } from '../types';

interface PriceDisplayProps extends PrimitiveProps {
  config: PriceDisplayConfig;
}

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ config }) => {
  const amount = config.amount ?? 0;
  const currency = config.currency ?? 'USD';
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const fontSize = config.fontSize ?? 24;

  return (
    <View style={styles.container}>
      {config.originalAmount && config.originalAmount > amount && (
        <Text style={[styles.original, { fontSize: fontSize * 0.6 }]}>
          {symbol}{config.originalAmount.toFixed(0)}
        </Text>
      )}
      <Text style={[styles.price, { fontSize }]}>
        {symbol}{amount.toFixed(0)}
      </Text>
      {config.period && (
        <Text style={[styles.period, { fontSize: fontSize * 0.6 }]}>
          /{config.period}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  original: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
  period: {
    color: '#8E8E93',
    marginLeft: 2,
  },
});

export default PriceDisplay;
