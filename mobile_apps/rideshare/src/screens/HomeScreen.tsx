import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {ridesService, RideRequest} from '../api/ridesService';

type RideType = 'standard' | 'premium' | 'xl' | 'luxury';

const RIDE_TYPES: Array<{type: RideType; name: string; multiplier: number}> = [
  {type: 'standard', name: 'Standard', multiplier: 1.0},
  {type: 'premium', name: 'Premium', multiplier: 1.5},
  {type: 'xl', name: 'XL', multiplier: 1.8},
  {type: 'luxury', name: 'Luxury', multiplier: 2.5},
];

const HomeScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user, logout} = useAuth();
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [selectedRideType, setSelectedRideType] = useState<RideType>('standard');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestRide = async () => {
    if (!pickupAddress.trim()) {
      Alert.alert('Error', 'Please enter a pickup address');
      return;
    }
    if (!destinationAddress.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    setIsLoading(true);
    try {
      const rideData: RideRequest = {
        pickup_address: pickupAddress,
        destination_address: destinationAddress,
        ride_type: selectedRideType,
      };

      const result = await ridesService.requestRide(rideData);

      Alert.alert(
        'Ride Requested!',
        `Estimated fare: $${result.estimated_fare.toFixed(2)}`,
        [
          {
            text: 'View Ride',
            onPress: () =>
              navigation.navigate('RideTracking', {rideId: result.ride.id}),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to request ride',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.first_name || 'Rider'}</Text>
          <Text style={styles.subtitle}>Where to?</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
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

        <View style={styles.divider} />

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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose your ride</Text>
        {RIDE_TYPES.map(rideType => (
          <TouchableOpacity
            key={rideType.type}
            style={[
              styles.rideTypeCard,
              selectedRideType === rideType.type && styles.rideTypeCardSelected,
            ]}
            onPress={() => setSelectedRideType(rideType.type)}>
            <Text style={styles.rideTypeName}>{rideType.name}</Text>
            <Text style={styles.rideTypeMultiplier}>
              {rideType.multiplier}x
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.requestButton, isLoading && styles.requestButtonDisabled]}
        onPress={handleRequestRide}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.requestButtonText}>Request Ride</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('RideHistory')}>
        <Text style={styles.historyButtonText}>View Ride History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 24,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
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
  rideTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rideTypeMultiplier: {
    fontSize: 14,
    color: '#666',
  },
  requestButton: {
    backgroundColor: '#000',
    marginHorizontal: 16,
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
  historyButton: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  historyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
