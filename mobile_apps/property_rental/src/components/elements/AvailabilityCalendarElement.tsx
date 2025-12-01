import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { listingsService } from '../../api/listingsService';
import apiClient from '../../api/client';
import { API_CONFIG } from '../../api/config';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface AvailabilityCalendarElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

interface PropertyListing {
  id: number;
  title: string;
}

interface AvailabilityDate {
  date: string;
  is_available: boolean;
  price_override?: number;
  notes?: string;
  has_booking?: boolean;
}

const AvailabilityCalendarElement: React.FC<AvailabilityCalendarElementProps> = ({ 
  element, 
  navigation,
  route 
}) => {
  const config = element.config || element.default_config || {};
  const { showLegend = true, allowMultiSelect = true } = config;

  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<{ [key: string]: AvailabilityDate }>({});
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [priceOverride, setPriceOverride] = useState('');

  // Get listing ID from route params if provided
  const listingIdFromRoute = route.params?.listingId;

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (selectedListing) {
      fetchAvailability();
    }
  }, [selectedListing, currentMonth]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsService.getMyListings();
      const myListings = response.data.listings || [];
      setListings(myListings);
      
      // Auto-select listing if provided in route or if only one listing
      if (listingIdFromRoute) {
        const listing = myListings.find((l: PropertyListing) => l.id === listingIdFromRoute);
        if (listing) setSelectedListing(listing);
      } else if (myListings.length === 1) {
        setSelectedListing(myListings[0]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Unable to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    if (!selectedListing) return;
    
    try {
      setLoadingAvailability(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await apiClient.get(
        `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing.id}/availability`,
        { params: { year, month } }
      );
      
      const availabilityMap: { [key: string]: AvailabilityDate } = {};
      (response.data.data?.availability || []).forEach((item: AvailabilityDate) => {
        availabilityMap[item.date] = item;
      });
      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleDatePress = (dateStr: string) => {
    if (!allowMultiSelect) {
      setSelectedDates([dateStr]);
      setShowActionModal(true);
      return;
    }

    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      }
      return [...prev, dateStr];
    });
  };

  const handleApplyAction = async (action: 'block' | 'unblock') => {
    if (selectedDates.length === 0 || !selectedListing) return;

    try {
      await apiClient.post(
        `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing.id}/availability`,
        {
          dates: selectedDates,
          is_available: action === 'unblock',
          price_override: priceOverride ? parseFloat(priceOverride) : null,
        }
      );
      
      Alert.alert('Success', `${selectedDates.length} date(s) ${action === 'block' ? 'blocked' : 'unblocked'}`);
      setSelectedDates([]);
      setPriceOverride('');
      setShowActionModal(false);
      fetchAvailability();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update availability');
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const formatDateStr = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateStr(day);
      const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isPast = dateObj < today;
      const availData = availability[dateStr];
      const isBlocked = availData?.is_available === false;
      const hasBooking = availData?.has_booking;
      const isSelected = selectedDates.includes(dateStr);
      const hasOverride = availData?.price_override;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isPast && styles.dayCellPast,
            isBlocked && styles.dayCellBlocked,
            hasBooking && styles.dayCellBooked,
            isSelected && styles.dayCellSelected,
          ]}
          onPress={() => !isPast && !hasBooking && handleDatePress(dateStr)}
          disabled={isPast || hasBooking}
        >
          <Text style={[
            styles.dayText,
            isPast && styles.dayTextPast,
            isBlocked && styles.dayTextBlocked,
            hasBooking && styles.dayTextBooked,
            isSelected && styles.dayTextSelected,
          ]}>
            {day}
          </Text>
          {hasOverride && !isBlocked && (
            <Text style={styles.priceOverrideText}>${availData.price_override}</Text>
          )}
          {hasBooking && (
            <Icon name="account" size={12} color="#fff" style={styles.bookingIcon} />
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading listings...</Text>
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="calendar-remove" size={64} color="#C7C7CC" />
        <Text style={styles.emptyTitle}>No Listings</Text>
        <Text style={styles.emptySubtitle}>
          Create a listing first to manage availability
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('DynamicScreen', { screenId: 127, screenName: 'Create Listing' })}
        >
          <Text style={styles.createButtonText}>Create Listing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Listing Selector */}
      {listings.length > 1 && (
        <View style={styles.listingSelector}>
          <Text style={styles.selectorLabel}>Select Property</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {listings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={[
                  styles.listingChip,
                  selectedListing?.id === listing.id && styles.listingChipActive,
                ]}
                onPress={() => {
                  setSelectedListing(listing);
                  setSelectedDates([]);
                }}
              >
                <Text style={[
                  styles.listingChipText,
                  selectedListing?.id === listing.id && styles.listingChipTextActive,
                ]} numberOfLines={1}>
                  {listing.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {selectedListing && (
        <>
          {/* Calendar Header */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
              <Icon name="chevron-left" size={28} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
              <Icon name="chevron-right" size={28} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {/* Day Labels */}
          <View style={styles.dayLabels}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          {loadingAvailability ? (
            <View style={styles.calendarLoading}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : (
            <View style={styles.calendarGrid}>
              {renderCalendar()}
            </View>
          )}

          {/* Legend */}
          {showLegend && (
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5EA' }]} />
                <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={styles.legendText}>Blocked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.legendText}>Booked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
                <Text style={styles.legendText}>Selected</Text>
              </View>
            </View>
          )}

          {/* Selected Dates Actions */}
          {selectedDates.length > 0 && (
            <View style={styles.actionsContainer}>
              <Text style={styles.selectedCount}>
                {selectedDates.length} date(s) selected
              </Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.blockButton]}
                  onPress={() => setShowActionModal(true)}
                >
                  <Icon name="block-helper" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Block Dates</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.unblockButton]}
                  onPress={() => handleApplyAction('unblock')}
                >
                  <Icon name="check" size={18} color="#fff" />
                  <Text style={styles.actionButtonText}>Unblock</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.clearSelection}
                onPress={() => setSelectedDates([])}
              >
                <Text style={styles.clearSelectionText}>Clear Selection</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Block Dates Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Block Dates</Text>
            <Text style={styles.modalSubtitle}>
              {selectedDates.length} date(s) will be blocked
            </Text>
            
            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Custom Price (optional)</Text>
              <TextInput
                style={styles.modalInput}
                value={priceOverride}
                onChangeText={setPriceOverride}
                placeholder="Leave empty to use default"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setShowActionModal(false);
                  setPriceOverride('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={() => handleApplyAction('block')}
              >
                <Text style={styles.modalConfirmText}>Block Dates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#F2F2F7',
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
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listingSelector: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
  },
  listingChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
    maxWidth: 200,
  },
  listingChipActive: {
    backgroundColor: '#007AFF',
  },
  listingChipText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  listingChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  dayLabels: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  calendarLoading: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 4,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dayCellPast: {
    opacity: 0.3,
  },
  dayCellBlocked: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  dayCellBooked: {
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  dayCellSelected: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  dayTextPast: {
    color: '#C7C7CC',
  },
  dayTextBlocked: {
    color: '#FF3B30',
  },
  dayTextBooked: {
    color: '#fff',
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  priceOverrideText: {
    fontSize: 8,
    color: '#007AFF',
    marginTop: 2,
  },
  bookingIcon: {
    position: 'absolute',
    bottom: 4,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  blockButton: {
    backgroundColor: '#FF3B30',
  },
  unblockButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearSelection: {
    marginTop: 12,
    alignItems: 'center',
  },
  clearSelectionText: {
    color: '#007AFF',
    fontSize: 14,
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
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
  },
  modalField: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalCancelButton: {
    backgroundColor: '#F2F2F7',
  },
  modalCancelText: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AvailabilityCalendarElement;
