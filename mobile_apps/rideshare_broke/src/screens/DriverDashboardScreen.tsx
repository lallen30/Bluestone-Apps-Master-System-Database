import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { driversService, DriverProfile, AvailableRide } from '../api/driversService';
import { ridesService } from '../api/ridesService';

const DriverDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [availableRides, setAvailableRides] = useState<AvailableRide[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const profileResult = await driversService.getProfile();
      setProfile(profileResult.profile);
      setIsOnline(profileResult.profile.is_online);

      if (profileResult.profile.is_online) {
        const ridesResult = await driversService.getAvailableRides();
        setAvailableRides(ridesResult.rides);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Not registered as driver
        Alert.alert(
          'Not a Driver',
          'You are not registered as a driver. Would you like to register?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
            { text: 'Register', onPress: () => navigation.navigate('BecomeDriver' as never) },
          ]
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    fetchData();
    // Poll for new rides when online
    const interval = setInterval(() => {
      if (isOnline) {
        driversService.getAvailableRides().then(result => {
          setAvailableRides(result.rides);
        }).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchData, isOnline]);

  const handleToggleOnline = async (value: boolean) => {
    setIsTogglingStatus(true);
    try {
      // In production, get actual location
      const result = await driversService.toggleStatus(value, 40.7128, -74.0060);
      setIsOnline(result.is_online);
      
      if (result.is_online) {
        const ridesResult = await driversService.getAvailableRides();
        setAvailableRides(ridesResult.rides);
      } else {
        setAvailableRides([]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleAcceptRide = async (rideId: number) => {
    try {
      await ridesService.acceptRide(rideId);
      Alert.alert('Success', 'Ride accepted!', [
        { text: 'OK', onPress: () => navigation.navigate('RideTracking' as never, { rideId } as never) },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept ride');
    }
  };

  const renderRideRequest = ({ item }: { item: AvailableRide }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.rideType}>{item.ride_type.toUpperCase()}</Text>
        <Text style={styles.rideFare}>${item.estimated_fare.toFixed(2)}</Text>
      </View>
      
      <View style={styles.rideLocations}>
        <View style={styles.locationRow}>
          <View style={styles.locationDot} />
          <Text style={styles.locationText} numberOfLines={1}>{item.pickup_address}</Text>
        </View>
        <View style={styles.locationLine} />
        <View style={styles.locationRow}>
          <View style={[styles.locationDot, styles.destinationDot]} />
          <Text style={styles.locationText} numberOfLines={1}>{item.destination_address}</Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <Text style={styles.riderName}>
          {item.rider_first_name} {item.rider_last_name?.[0]}.
        </Text>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRide(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Status Toggle */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Hello, {profile?.first_name || 'Driver'}
            </Text>
            <Text style={styles.vehicleInfo}>
              {profile?.vehicle_make} {profile?.vehicle_model}
            </Text>
          </View>
          <View style={styles.statusToggle}>
            <Text style={[styles.statusLabel, isOnline && styles.statusLabelOnline]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              disabled={isTogglingStatus}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isOnline ? '#2196F3' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⭐ {profile?.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.total_rides || 0}</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.acceptance_rate?.toFixed(0) || 0}%</Text>
            <Text style={styles.statLabel}>Acceptance</Text>
          </View>
        </View>
      </View>

      {/* Available Rides */}
      {isOnline ? (
        <FlatList
          data={availableRides}
          renderItem={renderRideRequest}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => {
              setIsRefreshing(true);
              fetchData();
            }} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🚗</Text>
              <Text style={styles.emptyTitle}>No ride requests</Text>
              <Text style={styles.emptySubtitle}>
                Stay online and new requests will appear here
              </Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Available Rides</Text>
          }
        />
      ) : (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineIcon}>🌙</Text>
          <Text style={styles.offlineTitle}>You're Offline</Text>
          <Text style={styles.offlineSubtitle}>
            Go online to start receiving ride requests
          </Text>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DriverEarnings' as never)}
        >
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionLabel}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('DriverRides' as never)}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionLabel}>My Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Profile' as never)}
        >
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionLabel}>Profile</Text>
        </TouchableOpacity>
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
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  statusToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  statusLabelOnline: {
    color: '#4CAF50',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rideType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rideFare: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  rideLocations: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  locationLine: {
    width: 2,
    height: 16,
    backgroundColor: '#ddd',
    marginLeft: 4,
    marginVertical: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  riderName: {
    fontSize: 14,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  offlineIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  offlineTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  offlineSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default DriverDashboardScreen;
