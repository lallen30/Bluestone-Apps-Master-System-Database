import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RatingDisplayConfig, PrimitiveProps } from '../types';

interface RatingDisplayProps extends PrimitiveProps {
  config: RatingDisplayConfig;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ config }) => {
  const rating = config.rating ?? 0;
  const maxRating = config.maxRating ?? 5;
  const size = config.size ?? 16;
  const color = config.color ?? '#FFD700';

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(fullStars)].map((_, i) => (
        <Icon key={`full-${i}`} name="star" size={size} color={color} />
      ))}
      {hasHalfStar && <Icon name="star-half-full" size={size} color={color} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Icon key={`empty-${i}`} name="star-outline" size={size} color={color} />
      ))}
      {rating > 0 && (
        <Text style={[styles.rating, { fontSize: size }]}>{rating.toFixed(1)}</Text>
      )}
      {config.reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>
          ({config.reviewCount} review{config.reviewCount !== 1 ? 's' : ''})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 4,
  },
  count: {
    color: '#8E8E93',
    marginLeft: 4,
  },
});

export default RatingDisplay;
