import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyInfoCardElementProps {
  element: ScreenElement;
  listingData?: any;
  navigation?: any;
}

const PropertyInfoCardElement: React.FC<PropertyInfoCardElementProps> = ({ element, listingData, navigation }) => {
  const config = element.config || element.default_config || {};
  const {
    showTitle = true,
    showLocation = true,
    showRating = true,
    showPropertyType = true,
    showDetails = true,
    titleFontSize = 24,
    backgroundColor = '#F2F2F7',
    textColor = '#1C1C1E',
    accentColor = '#007AFF',
  } = config;

  if (!listingData) {
    return null;
  }

  const location = [listingData.city, listingData.state, listingData.country].filter(Boolean).join(', ');

  const handleViewReviews = () => {
    if (navigation) {
      navigation.navigate('DynamicScreen', {
        screenId: 135,
        screenName: 'Reviews',
        listingId: listingData.id,
      });
    }
  };

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={[styles.title, { fontSize: titleFontSize, color: textColor }]}>
          {listingData.title}
        </Text>
      )}

      {showLocation && location && (
        <View style={styles.locationRow}>
          <Icon name="map-marker" size={16} color="#8E8E93" />
          <Text style={styles.location}>{location}</Text>
        </View>
      )}

      {showRating && listingData.average_rating > 0 && (
        <TouchableOpacity style={styles.ratingRow} onPress={handleViewReviews}>
          <Icon name="star" size={18} color="#FFD700" />
          <Text style={styles.rating}>{listingData.average_rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>
            ({listingData.total_reviews || 0} review{listingData.total_reviews !== 1 ? 's' : ''})
          </Text>
          <Icon name="chevron-right" size={18} color="#8E8E93" />
        </TouchableOpacity>
      )}

      {(showPropertyType || showDetails) && (
        <View style={[styles.detailsCard, { backgroundColor }]}>
          {showPropertyType && (
            <Text style={[styles.propertyType, { color: accentColor }]}>
              {listingData.property_type}
            </Text>
          )}
          {showDetails && (
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Icon name="bed" size={20} color={accentColor} />
                <Text style={[styles.detailValue, { color: textColor }]}>{listingData.bedrooms}</Text>
                <Text style={styles.detailLabel}>Bedrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="shower" size={20} color={accentColor} />
                <Text style={[styles.detailValue, { color: textColor }]}>{listingData.bathrooms}</Text>
                <Text style={styles.detailLabel}>Bathrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="account-group" size={20} color={accentColor} />
                <Text style={[styles.detailValue, { color: textColor }]}>{listingData.guests_max || listingData.max_guests}</Text>
                <Text style={styles.detailLabel}>Guests</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
  },
  propertyType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
});

export default PropertyInfoCardElement;
