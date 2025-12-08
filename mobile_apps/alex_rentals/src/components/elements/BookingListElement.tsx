import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { bookingsService, Booking } from '../../api/bookingsService';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface BookingListElementProps {
  element: ScreenElement;
  navigation: any;
  route?: any;
}

const BookingListElement: React.FC<BookingListElementProps> = ({ element, navigation, route }) => {
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    filters = ['all', 'pending', 'confirmed', 'cancelled'],
    default_filter = 'all',
    show_status_badges = true,
    enable_cancel = true,
    card_layout = 'compact',
    pull_to_refresh = true,
    items_per_page = 20,
    viewType = 'guest', // 'guest' or 'host'
    showPending = false,
  } = config;

  // Check for defaultFilter from route params (overrides config)
  const routeDefaultFilter = route?.params?.defaultFilter;
  
  const isHostView = viewType === 'host';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>(routeDefaultFilter || (showPending ? 'pending' : default_filter));

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        status: filter === 'all' ? undefined : filter,
        per_page: items_per_page,
      };
      
      // Use different API based on view type
      const response = isHostView 
        ? await bookingsService.getMyReservations(params)
        : await bookingsService.getMyBookings(params);
      
      // Handle both 'bookings' and 'reservations' response keys
      const bookingsList = response.data.bookings || response.data.reservations || [];
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Unable to load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking at ${booking.listing_title}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingsService.cancelBooking(booking.id, 'Changed plans');
              Alert.alert('Success', 'Booking cancelled successfully');
              fetchBookings();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Unable to cancel booking');
            }
          },
        },
      ]
    );
  };

  const handleConfirmBooking = (booking: Booking) => {
    Alert.alert(
      'Confirm Booking',
      `Confirm booking from ${booking.guest_first_name} ${booking.guest_last_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await bookingsService.confirmBooking(booking.id);
              Alert.alert('Success', 'Booking confirmed!');
              fetchBookings();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Unable to confirm booking');
            }
          },
        },
      ]
    );
  };

  const handleRejectBooking = (booking: Booking) => {
    Alert.alert(
      'Reject Booking',
      `Are you sure you want to reject this booking request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingsService.rejectBooking(booking.id, 'Not available');
              Alert.alert('Success', 'Booking rejected');
              fetchBookings();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Unable to reject booking');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'cancelled':
        return '#FF3B30';
      case 'completed':
        return '#007AFF';
      case 'rejected':
        return '#8E8E93';
      default:
        return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderBookingCard = ({ item }: { item: Booking }) => {
    const checkIn = new Date(item.check_in_date);
    const checkOut = new Date(item.check_out_date);
    const canCancel = enable_cancel && (item.status === 'pending' || item.status === 'confirmed');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.listing_title || 'Property'}
            </Text>
            <Text style={styles.cardLocation}>
              {item.city}, {item.country}
            </Text>
          </View>
          {show_status_badges && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.dateRow}>
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>{checkIn.toLocaleDateString()}</Text>
            </View>
            <Icon name="arrow-right" size={20} color="#8E8E93" style={styles.arrowIcon} />
            <View style={styles.dateColumn}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>{checkOut.toLocaleDateString()}</Text>
            </View>
          </View>

          {card_layout === 'detailed' && (
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Icon name="account-group" size={16} color="#8E8E93" />
                <Text style={styles.detailText}>{item.guests_count} guests</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="weather-night" size={16} color="#8E8E93" />
                <Text style={styles.detailText}>{item.nights} nights</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="currency-usd" size={16} color="#8E8E93" />
                <Text style={styles.detailText}>${item.total_price.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Host actions for pending bookings */}
        {isHostView && item.status === 'pending' && (
          <View style={styles.cardFooter}>
            <View style={styles.hostActions}>
              <TouchableOpacity
                style={[styles.hostActionButton, styles.confirmButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleConfirmBooking(item);
                }}
              >
                <Icon name="check" size={18} color="#fff" />
                <Text style={styles.hostActionText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.hostActionButton, styles.rejectButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleRejectBooking(item);
                }}
              >
                <Icon name="close" size={18} color="#fff" />
                <Text style={styles.hostActionText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Guest cancel action */}
        {!isHostView && canCancel && (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={(e) => {
                e.stopPropagation();
                handleCancelBooking(item);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="calendar-remove" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No Bookings</Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all'
          ? "You haven't made any bookings yet"
          : `No ${filter} bookings found`}
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('PropertyListings')}
      >
        <Text style={styles.browseButtonText}>Browse Properties</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      {filters.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filterOption: string) => (
            <TouchableOpacity
              key={filterOption}
              style={[styles.filterTab, filter === filterOption && styles.filterTabActive]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[styles.filterText, filter === filterOption && styles.filterTextActive]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.list}
          refreshControl={
            pull_to_refresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#007AFF"
              />
            ) : undefined
          }
        >
          {bookings.map((item) => (
            <View key={item.id.toString()}>
              {renderBookingCard({ item })}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
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
  filterScrollView: {
    flexGrow: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 70,
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardBody: {
    padding: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateColumn: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 4,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hostActionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  hostActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingListElement;
