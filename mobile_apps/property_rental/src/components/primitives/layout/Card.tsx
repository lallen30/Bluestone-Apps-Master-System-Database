import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { CardConfig, PrimitiveProps } from '../types';

interface CardProps extends PrimitiveProps {
  config: CardConfig;
}

const Card: React.FC<CardProps> = ({ config, children, onAction }) => {
  const style: ViewStyle = {
    padding: config.padding ?? 16,
    margin: config.margin,
    marginHorizontal: config.marginHorizontal,
    marginVertical: config.marginVertical ?? 8,
    backgroundColor: config.backgroundColor ?? '#FFFFFF',
    borderRadius: config.borderRadius ?? 12,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    ...(config.shadow !== false && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  };

  if (config.onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={() => onAction?.(config.onPress!)}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {},
});

export default Card;
