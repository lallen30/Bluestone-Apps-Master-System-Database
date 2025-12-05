import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/client';
import { API_CONFIG } from '../../api/config';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface HostDashboardElementProps {
  element: ScreenElement;
  navigation: any;
}

interface DashboardStats {
  listings: {
    total: number;
    active: number;
    draft: number;
  };
  bookings: {
    pending: number;
    confirmed: number;
    completed: number;
    total: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    pending: number;
  };
  reviews: {
    average: number;
    total: number;
  };
}

interface RecentBooking {
  id: number;
  listing_title: string;
  guest_first_name: string;
  guest_last_name: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
}

const HostDashboardElement: React.FC<HostDashboardElementProps> = ({ element, navigation }) => {
  const config = element.config || element.default_config || {};
  const {
    showListings = true,
    showBookings = true,
    showEarnings = true,
    showReviews = true,
  } = config;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get(`/apps/${API_CONFIG.APP_ID}/host/dashboard`);
      setStats(response.data.data?.stats || null);
      setRecentBookings(response.data.data?.recent_bookings || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#34C759';
      case 'pending': return '#FF9500';
      case 'completed': return '#007AFF';
      case 'cancelled': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {showListings && (
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 129, screenName: 'My Listings' })}
          >
            <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="home-city" size={28} color="#1976D2" />
            </View>
            <Text style={styles.statValue}>{stats?.listings.total || 0}</Text>
            <Text style={styles.statLabel}>Listings</Text>
            <View style={styles.statSubRow}>
              <Text style={styles.statSub}>{stats?.listings.active || 0} active</Text>
              <Text style={styles.statSubDivider}>•</Text>
              <Text style={styles.statSub}>{stats?.listings.draft || 0} draft</Text>
            </View>
          </TouchableOpacity>
        )}

        {showBookings && (
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 132, screenName: 'Host Bookings' })}
          >
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="calendar-check" size={28} color="#F57C00" />
            </View>
            <Text style={styles.statValue}>{stats?.bookings.total || 0}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
            <View style={styles.statSubRow}>
              <Text style={[styles.statSub, { color: '#FF9500' }]}>{stats?.bookings.pending || 0} pending</Text>
            </View>
          </TouchableOpacity>
        )}

        {showEarnings && (
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 133, screenName: 'Earnings' })}
          >
            <View style={[styles.statIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="cash-multiple" size={28} color="#388E3C" />
            </View>
            <Text style={styles.statValue}>${(stats?.earnings.total || 0).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
            <View style={styles.statSubRow}>
              <Text style={styles.statSub}>${(stats?.earnings.thisMonth || 0).toLocaleString()} this month</Text>
            </View>
          </TouchableOpacity>
        )}

        {showReviews && (
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF8E1' }]}>
              <Icon name="star" size={28} color="#FFA000" />
            </View>
            <Text style={styles.statValue}>{(stats?.reviews.average || 0).toFixed(1)}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
            <View style={styles.statSubRow}>
              <Text style={styles.statSub}>{stats?.reviews.total || 0} reviews</Text>
            </View>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 127, screenName: 'Create Listing' })}
          >
            <Icon name="plus-circle" size={24} color="#007AFF" />
            <Text style={styles.actionText}>New Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 134, screenName: 'Availability Calendar' })}
          >
            <Icon name="calendar-edit" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 116, screenName: 'Messages' })}
          >
            <Icon name="message-text" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pending Bookings Alert */}
      {(stats?.bookings.pending || 0) > 0 && (
        <TouchableOpacity
          style={styles.alertCard}
          onPress={() => navigation.navigate('DynamicScreen', { screenId: 132, screenName: 'Host Bookings' })}
        >
          <View style={styles.alertIcon}>
            <Icon name="bell-ring" size={24} color="#FF9500" />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Pending Booking Requests</Text>
            <Text style={styles.alertText}>
              You have {stats?.bookings.pending} booking request{stats?.bookings.pending !== 1 ? 's' : ''} waiting for your response
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#8E8E93" />
        </TouchableOpacity>
      )}

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('DynamicScreen', { screenId: 132, screenName: 'Host Bookings', defaultFilter: 'all' })}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentBookings.slice(0, 3).map((booking) => (
            <TouchableOpacity
              key={booking.id}
              style={styles.bookingCard}
              onPress={() => navigation.navigate('DynamicScreen', { 
                screenId: 115, 
                screenName: 'Booking Details',
                bookingId: booking.id 
              })}
            >
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle} numberOfLines={1}>{booking.listing_title}</Text>
                <Text style={styles.bookingGuest}>
                  {booking.guest_first_name} {booking.guest_last_name}
                </Text>
                <Text style={styles.bookingDates}>
                  {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.bookingRight}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
                <Text style={styles.bookingPrice}>${booking.total_price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Empty State */}
      {!stats?.listings.total && (
        <View style={styles.emptyState}>
          <Icon name="home-plus" size={64} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>Start Hosting</Text>
          <Text style={styles.emptyText}>
            Create your first listing and start earning money
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('DynamicScreen', { screenId: 127, screenName: 'Create Listing' })}
          >
            <Text style={styles.createButtonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statCardInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
  },
  statSub: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statSubDivider: {
    fontSize: 12,
    color: '#C7C7CC',
    marginHorizontal: 6,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '500',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  alertIcon: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  bookingCard: {
    flexDirection: 'row',
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
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  bookingGuest: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  bookingDates: {
    fontSize: 12,
    color: '#8E8E93',
  },
  bookingRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HostDashboardElement;
