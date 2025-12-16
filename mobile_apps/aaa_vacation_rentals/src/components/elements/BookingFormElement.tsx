import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useStripe } from '@stripe/stripe-react-native';
import { bookingsService } from '../../api/bookingsService';
import { listingsService } from '../../api/listingsService';
import { useAuth } from '../../context/AuthContext';
import { PropertyListing } from '../../types';
import {
  createCheckoutSessionWithCheck,
  isStripeEnabled,
} from '../../api/stripeServices';
import { API_CONFIG } from '../../api/config';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface BookingFormElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

const BookingFormElement: React.FC<BookingFormElementProps> = ({
  element,
  navigation,
  route,
}) => {
  const { user, token } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // Extract config
  const config = element.config || element.default_config || {};
  const {
    listing_id_source = 'route_param',
    show_price_breakdown = true,
    enable_special_requests = true,
    success_navigation = 'MyBookings',
    min_nights = 1,
    max_nights = 365,
    require_phone = false,
  } = config;

  // Get listing ID from route params or config
  const listingId =
    listing_id_source === 'route_param'
      ? route.params?.listingId
      : config.listing_id;

  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Booking details
  const checkInParam = route.params?.checkIn;
  const checkOutParam = route.params?.checkOut;
  const guestsParam = route.params?.guests;

  const [checkInDate, setCheckInDate] = useState(
    checkInParam ? new Date(checkInParam) : new Date(),
  );
  const [checkOutDate, setCheckOutDate] = useState(
    checkOutParam ? new Date(checkOutParam) : new Date(Date.now() + 86400000),
  );
  const [guestsCount, setGuestsCount] = useState(
    guestsParam?.toString() || '1',
  );
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Date picker visibility
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    } else {
      setLoading(false);
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsService.getListingById(listingId);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      Alert.alert('Error', 'Unable to load property details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!listing) return 0;
    const nights = calculateNights();
    const pricePerNight =
      typeof listing.price_per_night === 'string'
        ? parseFloat(listing.price_per_night)
        : listing.price_per_night || 0;
    const subtotal = pricePerNight * nights;
    const cleaningFee =
      typeof listing.cleaning_fee === 'string'
        ? parseFloat(listing.cleaning_fee)
        : listing.cleaning_fee || 0;
    const serviceFeePercent =
      typeof listing.service_fee_percentage === 'string'
        ? parseFloat(listing.service_fee_percentage)
        : listing.service_fee_percentage || 0;
    const serviceFee = (subtotal * serviceFeePercent) / 100;
    return subtotal + cleaningFee + serviceFee;
  };

  const handleSubmit = async () => {
    // Validation
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (require_phone && !phone) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    const guests = parseInt(guestsCount);
    if (isNaN(guests) || guests < 1) {
      Alert.alert('Error', 'Please enter a valid number of guests');
      return;
    }

    if (listing && guests > listing.guests_max) {
      Alert.alert('Error', `Maximum ${listing.guests_max} guests allowed`);
      return;
    }

    const nights = calculateNights();
    const configMinNights = listing?.min_nights || min_nights;
    const configMaxNights = listing?.max_nights || max_nights;

    if (nights < configMinNights) {
      Alert.alert('Error', `Minimum stay is ${configMinNights} nights`);
      return;
    }

    if (nights > configMaxNights) {
      Alert.alert('Error', `Maximum stay is ${configMaxNights} nights`);
      return;
    }

    try {
      setSubmitting(true);

      // Prepare booking payload used both for creating a booking and for the payment proxy.
      const bookingPayload = {
        listing_id: listingId,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guests_count: guests,
        guest_first_name: firstName,
        guest_last_name: lastName,
        guest_email: email,
        guest_phone: phone,
        special_requests: specialRequests,
        // Price breakdown so server can validate and create the Stripe session
        price: {
          nights,
          price_per_night: pricePerNight,
          subtotal,
          cleaning_fee: cleaningFee,
          service_fee: serviceFee,
          total,
          currency: listing?.currency || 'USD',
        },
      };

      // Check if Stripe (payments) is enabled for this app
      const appId = String(API_CONFIG.APP_ID);
      const stripeEnabled = await isStripeEnabled(appId, token ?? undefined);
      console.log(
        '[BookingForm] Stripe enabled check:',
        stripeEnabled,
        'for appId:',
        appId,
      );

      if (!stripeEnabled) {
        // Stripe is required - do not allow booking without payment
        Alert.alert(
          'Payment Required',
          'Payment processing is currently unavailable. Please try again later or contact support.',
        );
        return;
      }

      const response = await createCheckoutSessionWithCheck(
        appId,
        token ?? '',
        bookingPayload,
        true,
      );

      const sessionData = response.session || response;
      const clientSecret =
        sessionData.clientSecret || sessionData.client_secret;
      const bookingId = response.booking_id;

      if (!clientSecret) {
        console.error('[BookingForm] No clientSecret in response:', response);
        Alert.alert(
          'Payment Error',
          'Payment service did not return a valid payment session.',
        );
        return;
      }

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'AAA Vacation Rentals',
        paymentIntentClientSecret: clientSecret,
        returnURL: 'aaarentals://payment-complete',
        defaultBillingDetails: {
          name: `${firstName} ${lastName}`,
          email: email,
        },
      });

      if (initError) {
        console.error(
          '[BookingForm] Error initializing payment sheet:',
          initError,
        );
        Alert.alert('Payment Error', initError.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.error(
          '[BookingForm] Error presenting payment sheet:',
          presentError,
        );
        Alert.alert('Payment Cancelled', presentError.message);
        return;
      }

      Alert.alert('Payment Successful!', 'Your booking has been confirmed.', [
        {
          text: 'View Bookings',
          onPress: () =>
            navigation.navigate('DynamicScreen', {
              screenId: 114,
              screenName: 'My Bookings',
            }),
        },
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error creating booking/payment:', error);
      const message =
        error.response?.data?.message ||
        error.message ||
        'Unable to create booking or start payment. Please try again.';
      console.log('Extracted error message:', message);
      Alert.alert('Booking Failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Property not found</Text>
      </View>
    );
  }

  const nights = calculateNights();
  const pricePerNight =
    typeof listing.price_per_night === 'string'
      ? parseFloat(listing.price_per_night)
      : listing.price_per_night || 0;
  const subtotal = pricePerNight * nights;
  const cleaningFee =
    typeof listing.cleaning_fee === 'string'
      ? parseFloat(listing.cleaning_fee)
      : listing.cleaning_fee || 0;
  const serviceFeePercent =
    typeof listing.service_fee_percentage === 'string'
      ? parseFloat(listing.service_fee_percentage)
      : listing.service_fee_percentage || 0;
  const serviceFee = (subtotal * serviceFeePercent) / 100;
  const total = calculateTotal();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Your Stay</Text>
        <Text style={styles.propertyName}>{listing.title}</Text>
        <Text style={styles.location}>
          {listing.city}, {listing.country}
        </Text>
      </View>

      {/* Trip Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-in Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckInPicker(true)}
          >
            <Text style={styles.dateText}>
              {checkInDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showCheckInPicker && (
            <DateTimePicker
              value={checkInDate}
              mode="date"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowCheckInPicker(false);
                if (date) setCheckInDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-out Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckOutPicker(true)}
          >
            <Text style={styles.dateText}>
              {checkOutDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showCheckOutPicker && (
            <DateTimePicker
              value={checkOutDate}
              mode="date"
              minimumDate={new Date(checkInDate.getTime() + 86400000)}
              onChange={(event, date) => {
                setShowCheckOutPicker(false);
                if (date) setCheckOutDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Guests *</Text>
          <TextInput
            style={styles.input}
            value={guestsCount}
            onChangeText={setGuestsCount}
            keyboardType="number-pad"
            placeholder="1"
          />
          <Text style={styles.hint}>Maximum {listing.guests_max} guests</Text>
        </View>
      </View>

      {/* Guest Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guest Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="john@example.com"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone {require_phone && '*'}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+1 (555) 123-4567"
          />
        </View>
      </View>

      {/* Special Requests */}
      {enable_special_requests && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requests</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={specialRequests}
            onChangeText={setSpecialRequests}
            multiline
            numberOfLines={4}
            placeholder="Any special requests or questions?"
          />
        </View>
      )}

      {/* Price Summary */}
      {show_price_breakdown && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${pricePerNight.toFixed(2)} × {nights} nights
            </Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>

          {cleaningFee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Cleaning fee</Text>
              <Text style={styles.priceValue}>${cleaningFee.toFixed(2)}</Text>
            </View>
          )}

          {serviceFee > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>

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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  location: {
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  hint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
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
  submitButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default BookingFormElement;
