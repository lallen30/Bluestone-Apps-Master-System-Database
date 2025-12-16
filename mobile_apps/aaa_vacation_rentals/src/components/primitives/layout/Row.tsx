import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { RowConfig, PrimitiveProps } from '../types';

interface RowProps extends PrimitiveProps {
  config: RowConfig;
}

const Row: React.FC<RowProps> = ({ config, children }) => {
  const style: ViewStyle = {
    flexDirection: 'row',
    justifyContent: config.justifyContent || 'flex-start',
    alignItems: config.alignItems || 'center',
    flexWrap: config.wrap ? 'wrap' : 'nowrap',
    gap: config.gap,
    padding: config.padding,
    paddingHorizontal: config.paddingHorizontal,
    paddingVertical: config.paddingVertical,
    margin: config.margin,
    marginHorizontal: config.marginHorizontal,
    marginVertical: config.marginVertical,
    backgroundColor: config.backgroundColor,
    borderRadius: config.borderRadius,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    flex: config.flex,
  };

  return <View style={[styles.row, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  row: {},
});

export default Row;
