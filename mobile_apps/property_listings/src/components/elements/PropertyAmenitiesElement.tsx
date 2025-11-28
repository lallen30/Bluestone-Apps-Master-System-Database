import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyAmenitiesElementProps {
  element: ScreenElement;
  listingData?: any;
}

// Map amenity names to icons
const AMENITY_ICONS: { [key: string]: string } = {
  'wifi': 'wifi',
  'pool': 'pool',
  'kitchen': 'stove',
  'parking': 'parking',
  'air conditioning': 'air-conditioner',
  'heating': 'radiator',
  'washer': 'washing-machine',
  'dryer': 'tumble-dryer',
  'tv': 'television',
  'gym': 'dumbbell',
  'hot tub': 'hot-tub',
  'fireplace': 'fireplace',
  'beach access': 'beach',
  'pet friendly': 'paw',
  'smoking allowed': 'smoking',
  'elevator': 'elevator',
  'wheelchair accessible': 'wheelchair-accessibility',
  'breakfast': 'food-croissant',
  'workspace': 'desk',
  'balcony': 'balcony',
  'garden': 'flower',
  'bbq': 'grill',
};

const getAmenityIcon = (amenity: string): string => {
  const lowerAmenity = amenity.toLowerCase();
  for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
    if (lowerAmenity.includes(key)) {
      return icon;
    }
  }
  return 'check-circle';
};

const PropertyAmenitiesElement: React.FC<PropertyAmenitiesElementProps> = ({ element, listingData }) => {
  const config = element.config || element.default_config || {};
  const {
    title = 'What this place offers',
    showTitle = true,
    maxVisible = 8,
    columns = 2,
    showIcons = true,
    iconColor = '#34C759',
    titleFontSize = 18,
    textColor = '#1C1C1E',
    titleColor = '#1C1C1E',
  } = config;

  const [showAll, setShowAll] = useState(false);

  if (!listingData?.amenities || listingData.amenities.length === 0) {
    return null;
  }

  const amenities = listingData.amenities;
  const visibleAmenities = amenities.slice(0, maxVisible);
  const hasMore = amenities.length > maxVisible;

  const renderAmenity = (amenity: string, index: number) => (
    <View key={index} style={[styles.amenityItem, { width: `${100 / columns}%` }]}>
      {showIcons && (
        <Icon name={getAmenityIcon(amenity)} size={18} color={iconColor} />
      )}
      <Text style={[styles.amenityText, { color: textColor, marginLeft: showIcons ? 8 : 0 }]}>
        {amenity}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={[styles.title, { fontSize: titleFontSize, color: titleColor }]}>
          {title}
        </Text>
      )}
      <View style={styles.amenitiesGrid}>
        {visibleAmenities.map(renderAmenity)}
      </View>
      {hasMore && (
        <TouchableOpacity style={styles.showMoreButton} onPress={() => setShowAll(true)}>
          <Text style={styles.showMoreText}>
            Show all {amenities.length} amenities
          </Text>
        </TouchableOpacity>
      )}

      {/* Full Amenities Modal */}
      <Modal
        visible={showAll}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAll(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setShowAll(false)}>
                <Icon name="close" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.amenitiesGrid}>
                {amenities.map(renderAmenity)}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: '600',
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 8,
  },
  amenityText: {
    fontSize: 14,
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalBody: {
    padding: 16,
  },
});

export default PropertyAmenitiesElement;
