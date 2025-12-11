import React from 'react';
import { Image, View, StyleSheet, ImageStyle, ViewStyle, DimensionValue } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageConfig, PrimitiveProps } from '../types';
import { API_CONFIG } from '../../../api/config';

interface PrimitiveImageProps extends PrimitiveProps {
  config: ImageConfig;
}

// Transform relative URLs to absolute
const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_CONFIG.SERVER_URL}${url}`;
};

const PrimitiveImage: React.FC<PrimitiveImageProps> = ({ config }) => {
  const imageUrl = getImageUrl(config.source);

  const containerStyle: ViewStyle = {
    height: config.height,
    width: (config.width ?? '100%') as DimensionValue,
    borderRadius: config.borderRadius,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
  };

  const imageStyle: ImageStyle = {
    height: config.height,
    width: (config.width ?? '100%') as DimensionValue,
    aspectRatio: config.aspectRatio,
  };

  if (!imageUrl) {
    return (
      <View style={[styles.placeholder, containerStyle]}>
        <Icon name="image-off" size={48} color="#C7C7CC" />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Image
        source={{ uri: imageUrl }}
        style={imageStyle}
        resizeMode={config.resizeMode ?? 'cover'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PrimitiveImage;
