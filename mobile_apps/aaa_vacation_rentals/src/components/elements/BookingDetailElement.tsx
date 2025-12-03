import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { bookingsService, Booking } from '../../api/bookingsService';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface BookingDetailElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

const BookingDetailElement: React.FC<BookingDetailElementProps> = ({ element, navigation, route }) => {
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    booking_id_source = 'route_param',
    sections = ['property', 'trip', 'guest', 'host', 'price', 'timeline'],
    show_timeline = true,
    enable_cancel = true,
    enable_contact_host = true,
  } = config;

  // Get booking ID from route params or config
  const bookingId = booking_id_source === 'route_param' 
    ? route.params?.bookingId 
    : config.booking_id;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingsService.getBookingById(bookingId);
      setBooking(response.data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      Alert.alert('Error', 'Unable to load booking details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await bookingsService.cancelBooking(bookingId, 'Cancelled by guest');
              Alert.alert('Success', 'Booking cancelled successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Unable to cancel booking');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#34C759';
      case 'pending': return '#FF9500';
      case 'cancelled': return '#FF3B30';
      case 'completed': return '#007AFF';
      case 'rejected': return '#8E8E93';
      default: return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const checkIn = new Date(booking.check_in_date);
  const checkOut = new Date(booking.check_out_date);
  const canCancel = enable_cancel && (booking.status === 'pending' || booking.status === 'confirmed');
  const subtotal = booking.price_per_night * booking.nights;

  return (
    <ScrollView style={styles.container}>
      {/* Status Header */}
      <View style={styles.statusHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Icon name="check-circle" size={20} color="#fff" />
          <Text style={styles.statusText}>{getStatusLabel(booking.status)}</Text>
        </View>
        <Text style={styles.bookingId}>Booking #{booking.id}</Text>
      </View>

      {/* Property Info */}
      {sections.includes('property') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property</Text>
          <Text style={styles.propertyName}>{booking.listing_title || 'Property'}</Text>
          <Text style={styles.propertyLocation}>
            {booking.city}, {booking.country}
          </Text>
        </View>
      )}

      {/* Trip Details */}
      {sections.includes('trip') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="login" size={20} color="#007AFF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{checkIn.toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="logout" size={20} color="#007AFF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{checkOut.toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="people" size={20} color="#007AFF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Guests</Text>
              <Text style={styles.detailValue}>{booking.guests_count}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="nights-stay" size={20} color="#007AFF" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Nights</Text>
              <Text style={styles.detailValue}>{booking.nights}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Guest Information */}
      {sections.includes('guest') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {booking.guest_first_name} {booking.guest_last_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{booking.guest_email}</Text>
          </View>

          {booking.guest_phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{booking.guest_phone}</Text>
            </View>
          )}

          {booking.special_requests && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Special Requests</Text>
              <Text style={styles.infoValue}>{booking.special_requests}</Text>
            </View>
          )}
        </View>
      )}

      {/* Host Information */}
      {sections.includes('host') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Host Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {booking.host_first_name} {booking.host_last_name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{booking.host_email}</Text>
          </View>
        </View>
      )}

      {/* Price Breakdown */}
      {sections.includes('price') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${booking.price_per_night.toFixed(2)} × {booking.nights} nights
            </Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>

          {booking.cleaning_fee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Cleaning fee</Text>
              <Text style={styles.priceValue}>${booking.cleaning_fee.toFixed(2)}</Text>
            </View>
          )}

          {booking.service_fee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>${booking.service_fee.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${booking.total_price.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {/* Booking Timeline */}
      {show_timeline && sections.includes('timeline') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>

          <View style={styles.timelineItem}>
            <Icon name="add-circle" size={20} color="#007AFF" />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Booking Created</Text>
              <Text style={styles.timelineValue}>
                {new Date(booking.created_at).toLocaleString()}
              </Text>
            </View>
          </View>

          {booking.confirmed_at && (
            <View style={styles.timelineItem}>
              <Icon name="check-circle" size={20} color="#34C759" />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Confirmed</Text>
                <Text style={styles.timelineValue}>
                  {new Date(booking.confirmed_at).toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {booking.cancelled_at && (
            <View style={styles.timelineItem}>
              <Icon name="cancel" size={20} color="#FF3B30" />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Cancelled</Text>
                <Text style={styles.timelineValue}>
                  {new Date(booking.cancelled_at).toLocaleString()}
                </Text>
                {booking.cancellation_reason && (
                  <Text style={styles.timelineReason}>{booking.cancellation_reason}</Text>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      {canCancel && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, cancelling && styles.cancelButtonDisabled]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="cancel" size={20} color="#fff" />
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomSpacer} />
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
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  statusHeader: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  bookingId: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 16,
    color: '#8E8E93',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  priceValue: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timelineReason: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionsContainer: {
    padding: 20,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default BookingDetailElement;
