import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_CONFIG } from '../../api/config';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyImageGalleryElementProps {
  element: ScreenElement;
  listingData?: any;
}

const { width: screenWidth } = Dimensions.get('window');

// Helper to transform relative URLs to absolute
const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${API_CONFIG.SERVER_URL}${url}`;
};

const PropertyImageGalleryElement: React.FC<PropertyImageGalleryElementProps> = ({ element, listingData }) => {
  const config = element.config || element.default_config || {};
  const {
    height = 300,
    showPagination = true,
    showFavoriteButton = true,
    backgroundColor = '#F2F2F7',
  } = config;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!listingData) {
    return (
      <View style={[styles.container, { height, backgroundColor }]}>
        <Icon name="image-off" size={64} color="#C7C7CC" />
      </View>
    );
  }

  // Extract and transform image URLs
  const imageUrls: string[] = [];
  if (listingData.images && listingData.images.length > 0) {
    listingData.images.forEach((img: any) => {
      const url = getImageUrl(img.image_url || img);
      if (url) imageUrls.push(url);
    });
  } else if (listingData.primary_image) {
    const url = getImageUrl(listingData.primary_image);
    if (url) imageUrls.push(url);
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorites API
  };

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      {imageUrls.length > 0 ? (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
          >
            {imageUrls.map((imageUrl: string, index: number) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={[styles.image, { height }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {showPagination && imageUrls.length > 1 && (
            <View style={styles.pagination}>
              {imageUrls.map((_: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <Icon name="image-off" size={64} color="#C7C7CC" />
      )}

      {showFavoriteButton && (
        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF3B30' : '#fff'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
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

export default PropertyImageGalleryElement;
