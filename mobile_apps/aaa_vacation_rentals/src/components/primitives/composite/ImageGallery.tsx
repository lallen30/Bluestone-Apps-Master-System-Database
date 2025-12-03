import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ImageGalleryConfig, PrimitiveProps } from '../types';
import { API_CONFIG } from '../../../api/config';

interface ImageGalleryProps extends PrimitiveProps {
  config: ImageGalleryConfig;
}

const { width: screenWidth } = Dimensions.get('window');

const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_CONFIG.SERVER_URL}${url}`;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ config, data, onAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const height = config.height ?? 300;
  
  // Get images from data using dataSource path or directly from config
  let images: string[] = [];
  if (data && config.dataSource) {
    // Simple path resolution (e.g., "images" or "listing.images")
    const path = config.dataSource.replace('$.', '').split('.');
    let value = data;
    for (const key of path) {
      if (value && typeof value === 'object') {
        value = value[key];
      }
    }
    if (Array.isArray(value)) {
      images = value.map((item: any) => {
        if (typeof item === 'string') return getImageUrl(item);
        if (item.image_url) return getImageUrl(item.image_url);
        if (item.url) return getImageUrl(item.url);
        return null;
      }).filter(Boolean) as string[];
    }
  }

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onAction?.('toggle_favorite', { isFavorite: !isFavorite });
  };

  if (images.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Icon name="image-off" size={64} color="#C7C7CC" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {images.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={[styles.image, { height }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {config.showPagination !== false && images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}

      {config.showFavoriteButton !== false && (
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF3B30' : '#FFFFFF'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageGallery;
