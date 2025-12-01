import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { TextConfig, PrimitiveProps } from '../types';

interface PrimitiveTextProps extends PrimitiveProps {
  config: TextConfig;
}

const PrimitiveText: React.FC<PrimitiveTextProps> = ({ config }) => {
  const style: TextStyle = {
    fontSize: config.fontSize ?? 16,
    fontWeight: config.fontWeight ?? 'normal',
    color: config.color ?? '#1C1C1E',
    textAlign: config.textAlign ?? 'left',
    lineHeight: config.lineHeight,
  };

  return (
    <Text style={[styles.text, style]} numberOfLines={config.numberOfLines}>
      {config.text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {},
});

export default PrimitiveText;
