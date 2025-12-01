import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinkConfig, PrimitiveProps } from '../types';

interface LinkProps extends PrimitiveProps {
  config: LinkConfig;
}

const Link: React.FC<LinkProps> = ({ config, onAction }) => {
  const handlePress = () => {
    if (config.action && onAction) {
      onAction(config.action, { target: config.target });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Text
        style={[
          styles.link,
          {
            color: config.color ?? '#007AFF',
            fontSize: config.fontSize ?? 16,
          },
        ]}
      >
        {config.text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});

export default Link;
