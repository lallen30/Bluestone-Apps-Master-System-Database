import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { HeadingConfig, PrimitiveProps } from '../types';

interface HeadingProps extends PrimitiveProps {
  config: HeadingConfig;
}

const HEADING_SIZES = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 28, fontWeight: '700' as const },
  h3: { fontSize: 24, fontWeight: '600' as const },
  h4: { fontSize: 20, fontWeight: '600' as const },
  h5: { fontSize: 18, fontWeight: '600' as const },
  h6: { fontSize: 16, fontWeight: '600' as const },
};

const Heading: React.FC<HeadingProps> = ({ config }) => {
  const level = config.level ?? 'h2';
  const sizeConfig = HEADING_SIZES[level];

  const style: TextStyle = {
    fontSize: config.fontSize ?? sizeConfig.fontSize,
    fontWeight: config.fontWeight ?? sizeConfig.fontWeight,
    color: config.color ?? '#1C1C1E',
    textAlign: config.textAlign ?? 'left',
    lineHeight: config.lineHeight,
  };

  return (
    <Text style={[styles.heading, style]} numberOfLines={config.numberOfLines}>
      {config.text}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginBottom: 8,
  },
});

export default Heading;
