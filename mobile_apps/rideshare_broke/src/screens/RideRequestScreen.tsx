import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ridesService, RideRequest } from '../api/ridesService';

type RideType = 'standard' | 'premium' | 'xl' | 'luxury';

interface RideTypeOption {
  type: RideType;
  name: string;
  description: string;
  multiplier: number;
}

const RIDE_TYPES: RideTypeOption[] = [
  { type: 'standard', name: 'Standard', description: '4 seats, affordable', multiplier: 1.0 },
  { type: 'premium', name: 'Premium', description: '4 seats, nicer cars', multiplier: 1.5 },
  { type: 'xl', name: 'XL', description: '6 seats, more space', multiplier: 1.8 },
  { type: 'luxury', name: 'Luxury', description: 'Premium experience', multiplier: 2.5 },
];

const RideRequestScreen: React.FC = () => {
  const navigation = useNavigation();
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedRideType, setSelectedRideType] = useState<RideType>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);

  const calculateEstimate = () => {
    // Simple estimate based on ride type
    const baseFare = 10;
    const selectedType = RIDE_TYPES.find(t => t.type === selectedRideType);
    const estimate = baseFare * (selectedType?.multiplier || 1);
    setEstimatedFare(estimate);
  };

  useEffect(() => {
    if (pickupAddress && destinationAddress) {
      calculateEstimate();
    }
  }, [pickupAddress, destinationAddress, selectedRideType]);

  const handleRequestRide = async () => {
    if (!pickupAddress.trim()) {
      Alert.alert('Error', 'Please enter a pickup address');
      return;
    }
    if (!destinationAddress.trim()) {
      Alert.alert('Error', 'Please enter a destination address');
      return;
    }

    setIsLoading(true);
    try {
      const rideData: RideRequest = {
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        ride_type: selectedRideType,
        promo_code: promoCode || undefined,
        ride_notes: notes || undefined,
      };

      const result = await ridesService.requestRide(rideData);
      
      Alert.alert(
        'Ride Requested!',
        `Estimated fare: $${result.estimated_fare.toFixed(2)}${result.promo_discount > 0 ? `\nDiscount: -$${result.promo_discount.toFixed(2)}` : ''}`,
        [
          {
            text: 'Track Ride',
            onPress: () => navigation.navigate('RideTracking' as never, { rideId: result.ride.id } as never),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to request ride');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request a Ride</Text>
        <Text style={styles.subtitle}>Where would you like to go?</Text>
      </View>

      {/* Location Inputs */}
      <View style={styles.section}>
        <View style={styles.inputContainer}>
          <View style={styles.locationDot} />
          <TextInput
            style={styles.input}
            placeholder="Pickup location"
            value={pickupAddress}
            onChangeText={setPickupAddress}
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.locationLine} />
        
        <View style={styles.inputContainer}>
          <View style={[styles.locationDot, styles.destinationDot]} />
          <TextInput
            style={styles.input}
            placeholder="Where to?"
            value={destinationAddress}
            onChangeText={setDestinationAddress}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Ride Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose your ride</Text>
        {RIDE_TYPES.map((rideType) => (
          <TouchableOpacity
            key={rideType.type}
            style={[
              styles.rideTypeCard,
              selectedRideType === rideType.type && styles.rideTypeCardSelected,
            ]}
            onPress={() => setSelectedRideType(rideType.type)}
          >
            <View style={styles.rideTypeInfo}>
              <Text style={styles.rideTypeName}>{rideType.name}</Text>
              <Text style={styles.rideTypeDescription}>{rideType.description}</Text>
            </View>
            {estimatedFare && (
              <Text style={styles.rideTypePrice}>
                ${(estimatedFare * rideType.multiplier).toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Promo Code */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Promo Code</Text>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          autoCapitalize="characters"
          placeholderTextColor="#999"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes for driver (optional)</Text>
        <TextInput
          style={[styles.promoInput, styles.notesInput]}
          placeholder="Any special instructions?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor="#999"
        />
      </View>

      {/* Request Button */}
      <TouchableOpacity
        style={[styles.requestButton, isLoading && styles.requestButtonDisabled]}
        onPress={handleRequestRide}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.requestButtonText}>
            Request {RIDE_TYPES.find(t => t.type === selectedRideType)?.name}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  rideTypeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#eee',
    marginBottom: 8,
  },
  rideTypeCardSelected: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  rideTypeInfo: {
    flex: 1,
  },
  rideTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rideTypeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rideTypePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  promoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  requestButton: {
    backgroundColor: '#000',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  requestButtonDisabled: {
    backgroundColor: '#666',
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});

export default RideRequestScreen;
