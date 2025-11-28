import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyBookingBarElementProps {
  element: ScreenElement;
  listingData?: any;
  navigation?: any;
}

const PropertyBookingBarElement: React.FC<PropertyBookingBarElementProps> = ({ element, listingData, navigation }) => {
  const config = element.config || element.default_config || {};
  const {
    buttonText = 'Reserve',
    showCleaningFee = true,
    priceColor = '#1C1C1E',
    buttonColor = '#FF385C',
    buttonTextColor = '#fff',
    backgroundColor = '#fff',
    position = 'bottom', // 'bottom' or 'inline'
  } = config;

  if (!listingData) {
    return null;
  }

  const price = parseFloat(listingData.price_per_night?.toString() || '0');
  const cleaningFee = parseFloat(listingData.cleaning_fee?.toString() || '0');

  const handleBook = () => {
    if (navigation) {
      navigation.navigate('DynamicScreen', {
        screenId: 113,
        screenName: 'Book Property',
        listingId: listingData.id,
      });
    }
  };

  const containerStyle = position === 'bottom' 
    ? [styles.containerFixed, { backgroundColor }]
    : [styles.containerInline, { backgroundColor }];

  return (
    <View style={containerStyle}>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: priceColor }]}>${price.toFixed(0)}</Text>
        <Text style={styles.priceLabel}>/night</Text>
        {showCleaningFee && cleaningFee > 0 && (
          <Text style={styles.cleaningFee}>+${cleaningFee.toFixed(0)} cleaning</Text>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.bookButton, { backgroundColor: buttonColor }]} 
        onPress={handleBook}
      >
        <Text style={[styles.bookButtonText, { color: buttonTextColor }]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  containerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  priceLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 4,
  },
  cleaningFee: {
    fontSize: 12,
    color: '#8E8E93',
    width: '100%',
  },
  bookButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PropertyBookingBarElement;
