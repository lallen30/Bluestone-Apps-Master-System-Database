import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ColumnConfig, PrimitiveProps } from '../types';

interface ColumnProps extends PrimitiveProps {
  config: ColumnConfig;
}

const Column: React.FC<ColumnProps> = ({ config, children }) => {
  const style: ViewStyle = {
    flexDirection: 'column',
    justifyContent: config.justifyContent || 'flex-start',
    alignItems: config.alignItems || 'stretch',
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

  return <View style={[styles.column, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  column: {},
});

export default Column;
