import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { ridesService, Ride } from '../api/ridesService';

type RideTrackingRouteProp = RouteProp<{ RideTracking: { rideId: number } }, 'RideTracking'>;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  requested: { label: 'Finding your driver...', color: '#FF9800' },
  searching: { label: 'Searching for drivers...', color: '#FF9800' },
  driver_assigned: { label: 'Driver assigned!', color: '#2196F3' },
  driver_arriving: { label: 'Driver is on the way', color: '#2196F3' },
  arrived: { label: 'Driver has arrived', color: '#4CAF50' },
  in_progress: { label: 'On your way', color: '#4CAF50' },
  completed: { label: 'Ride completed', color: '#4CAF50' },
  cancelled: { label: 'Ride cancelled', color: '#F44336' },
};

const RideTrackingScreen: React.FC = () => {
  const route = useRoute<RideTrackingRouteProp>();
  const navigation = useNavigation();
  const { rideId } = route.params;

  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchRide = useCallback(async () => {
    try {
      const result = await ridesService.getRideById(rideId);
      setRide(result.ride);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load ride details');
    } finally {
      setIsLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    fetchRide();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchRide, 10000);
    return () => clearInterval(interval);
  }, [fetchRide]);

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsCancelling(true);
            try {
              await ridesService.cancelRide(rideId, 'Cancelled by rider');
              Alert.alert('Cancelled', 'Your ride has been cancelled');
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to cancel ride');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  const handleCallDriver = () => {
    if (ride?.driver_phone) {
      Linking.openURL(`tel:${ride.driver_phone}`);
    }
  };

  const handleRateRide = () => {
    navigation.navigate('RateRide' as never, { rideId } as never);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ride not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = STATUS_LABELS[ride.status] || { label: ride.status, color: '#666' };
  const isActive = ['requested', 'searching', 'driver_assigned', 'driver_arriving', 'arrived', 'in_progress'].includes(ride.status);
  const canCancel = ['requested', 'searching', 'driver_assigned', 'driver_arriving'].includes(ride.status);
  const isCompleted = ride.status === 'completed';

  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>🗺️ Map View</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          {ride.driver_latitude && ride.driver_longitude
            ? 'Driver location available'
            : 'Waiting for driver location...'}
        </Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>

        {/* Driver Info */}
        {ride.driver_id && (
          <View style={styles.driverSection}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>
                {ride.driver_first_name?.[0] || '?'}
              </Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {ride.driver_first_name} {ride.driver_last_name}
              </Text>
              <Text style={styles.driverRating}>⭐ {ride.driver_rating?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.vehicleInfo}>
                {ride.vehicle_color} {ride.vehicle_make} {ride.vehicle_model}
              </Text>
              <Text style={styles.licensePlate}>{ride.license_plate}</Text>
            </View>
            {ride.driver_phone && (
              <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
                <Text style={styles.callButtonText}>📞</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.tripLocation}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={2}>{ride.pickup_address}</Text>
          </View>
          <View style={styles.tripLine} />
          <View style={styles.tripLocation}>
            <View style={[styles.locationDot, styles.destinationDot]} />
            <Text style={styles.locationText} numberOfLines={2}>{ride.destination_address}</Text>
          </View>
        </View>

        {/* Fare Info */}
        <View style={styles.fareSection}>
          <Text style={styles.fareLabel}>
            {isCompleted ? 'Total Fare' : 'Estimated Fare'}
          </Text>
          <Text style={styles.fareAmount}>
            ${(ride.actual_fare || ride.estimated_fare || 0).toFixed(2)}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {canCancel && (
            <TouchableOpacity
              style={[styles.cancelButton, isCancelling && styles.buttonDisabled]}
              onPress={handleCancelRide}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <ActivityIndicator color="#F44336" />
              ) : (
                <Text style={styles.cancelButtonText}>Cancel Ride</Text>
              )}
            </TouchableOpacity>
          )}

          {isCompleted && (
            <TouchableOpacity style={styles.rateButton} onPress={handleRateRide}>
              <Text style={styles.rateButtonText}>Rate Your Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 48,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  driverRating: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  licensePlate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 24,
  },
  tripDetails: {
    marginBottom: 20,
  },
  tripLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
    marginTop: 4,
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  tripLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  fareSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  fareLabel: {
    fontSize: 16,
    color: '#666',
  },
  fareAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    gap: 12,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#F44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  rateButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RideTrackingScreen;
