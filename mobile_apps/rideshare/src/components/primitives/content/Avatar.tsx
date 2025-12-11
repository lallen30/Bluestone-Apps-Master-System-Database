import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AvatarConfig, PrimitiveProps } from '../types';
import { API_CONFIG } from '../../../api/config';

interface AvatarProps extends PrimitiveProps {
  config: AvatarConfig;
}

const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_CONFIG.SERVER_URL}${url}`;
};

const Avatar: React.FC<AvatarProps> = ({ config }) => {
  const size = config.size ?? 48;
  const imageUrl = getImageUrl(config.source);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: config.borderWidth ?? 0,
    borderColor: config.borderColor ?? '#E5E5EA',
    backgroundColor: '#E5E5EA',
    overflow: 'hidden' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  };

  if (imageUrl) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Icon
        name={config.fallbackIcon ?? 'account'}
        size={size * 0.6}
        color="#8E8E93"
      />
    </View>
  );
};

export default Avatar;
