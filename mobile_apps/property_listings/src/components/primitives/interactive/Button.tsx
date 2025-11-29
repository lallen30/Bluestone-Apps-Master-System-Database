import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonConfig, PrimitiveProps } from '../types';

interface ButtonProps extends PrimitiveProps {
  config: ButtonConfig;
}

const VARIANT_STYLES = {
  primary: {
    backgroundColor: '#007AFF',
    textColor: '#FFFFFF',
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: '#E5E5EA',
    textColor: '#1C1C1E',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    textColor: '#007AFF',
    borderColor: '#007AFF',
  },
  ghost: {
    backgroundColor: 'transparent',
    textColor: '#007AFF',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: '#FF3B30',
    textColor: '#FFFFFF',
    borderColor: 'transparent',
  },
};

const SIZE_STYLES = {
  small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 },
  large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 18 },
};

const Button: React.FC<ButtonProps> = ({ config, onAction }) => {
  const variant = config.variant ?? 'primary';
  const size = config.size ?? 'medium';
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const handlePress = () => {
    if (config.disabled || config.loading) return;
    
    // Support both new format (action/target) and old format (actionType/screenId)
    const action = config.action || (config.actionType === 'screen' ? 'navigate' : config.actionType);
    const target = config.target || config.screenId;
    
    if (action && onAction) {
      onAction(action, { target: String(target) });
    }
  };

  const backgroundColor = config.backgroundColor ?? variantStyle.backgroundColor;
  const textColor = config.textColor ?? variantStyle.textColor;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          borderColor: variantStyle.borderColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          opacity: config.disabled ? 0.5 : 1,
        },
      ]}
      onPress={handlePress}
      disabled={config.disabled || config.loading}
      activeOpacity={0.7}
    >
      {config.loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {config.icon && config.iconPosition !== 'right' && (
            <Icon name={config.icon} size={sizeStyle.fontSize + 2} color={textColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: textColor, fontSize: sizeStyle.fontSize }]}>
            {config.label}
          </Text>
          {config.icon && config.iconPosition === 'right' && (
            <Icon name={config.icon} size={sizeStyle.fontSize + 2} color={textColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
