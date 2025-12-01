import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ContainerConfig, PrimitiveProps } from '../types';

interface ContainerProps extends PrimitiveProps {
  config: ContainerConfig;
}

const Container: React.FC<ContainerProps> = ({ config, children }) => {
  const style: ViewStyle = {
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

  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default Container;
