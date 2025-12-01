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
  Switch,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../../api/client';
import { API_CONFIG } from '../../api/config';
import { listingsService } from '../../api/listingsService';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface DynamicPricingElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

interface PricingRule {
  id: number;
  listing_id: number;
  rule_type: string;
  name: string;
  adjustment_type: 'percentage' | 'fixed';
  adjustment_value: number;
  min_nights?: number;
  max_nights?: number;
  days_before_checkin?: number;
  days_of_week?: number[];
  start_date?: string;
  end_date?: string;
  priority: number;
  is_active: boolean;
}

interface PropertyListing {
  id: number;
  title: string;
  price_per_night: string | number;
}

const RULE_TYPES = [
  { value: 'weekend', label: 'Weekend Pricing', icon: 'calendar-weekend', description: 'Adjust prices for weekends' },
  { value: 'seasonal', label: 'Seasonal Pricing', icon: 'weather-sunny', description: 'Set prices for specific date ranges' },
  { value: 'length_of_stay', label: 'Length of Stay Discount', icon: 'calendar-range', description: 'Discount for longer stays' },
  { value: 'last_minute', label: 'Last Minute Discount', icon: 'clock-fast', description: 'Discount for bookings close to check-in' },
  { value: 'early_bird', label: 'Early Bird Discount', icon: 'bird', description: 'Discount for advance bookings' },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const DynamicPricingElement: React.FC<DynamicPricingElementProps> = ({ element, navigation, route }) => {
  const listingIdFromRoute = route.params?.listingId;

  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  // Form state
  const [ruleType, setRuleType] = useState('weekend');
  const [ruleName, setRuleName] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'percentage' | 'fixed'>('percentage');
  const [adjustmentValue, setAdjustmentValue] = useState('');
  const [minNights, setMinNights] = useState('');
  const [maxNights, setMaxNights] = useState('');
  const [daysBeforeCheckin, setDaysBeforeCheckin] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([5, 6]); // Fri, Sat default
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (selectedListing) {
      fetchRules();
    }
  }, [selectedListing]);

  const fetchListings = async () => {
    try {
      const response = await listingsService.getMyListings();
      const myListings = response.data.listings || [];
      setListings(myListings);
      
      if (listingIdFromRoute) {
        const listing = myListings.find((l: PropertyListing) => l.id === listingIdFromRoute);
        if (listing) setSelectedListing(listing);
      } else if (myListings.length === 1) {
        setSelectedListing(myListings[0]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRules = async () => {
    if (!selectedListing) return;
    try {
      const response = await apiClient.get(
        `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing.id}/pricing-rules`
      );
      setRules(response.data.data?.rules || []);
    } catch (error) {
      console.error('Error fetching rules:', error);
    }
  };

  const resetForm = () => {
    setRuleType('weekend');
    setRuleName('');
    setAdjustmentType('percentage');
    setAdjustmentValue('');
    setMinNights('');
    setMaxNights('');
    setDaysBeforeCheckin('');
    setSelectedDays([5, 6]);
    setStartDate('');
    setEndDate('');
    setEditingRule(null);
  };

  const openAddModal = (type?: string) => {
    resetForm();
    if (type) setRuleType(type);
    setShowAddModal(true);
  };

  const openEditModal = (rule: PricingRule) => {
    setEditingRule(rule);
    setRuleType(rule.rule_type);
    setRuleName(rule.name || '');
    setAdjustmentType(rule.adjustment_type);
    setAdjustmentValue(rule.adjustment_value.toString());
    setMinNights(rule.min_nights?.toString() || '');
    setMaxNights(rule.max_nights?.toString() || '');
    setDaysBeforeCheckin(rule.days_before_checkin?.toString() || '');
    setSelectedDays(rule.days_of_week || [5, 6]);
    setStartDate(rule.start_date || '');
    setEndDate(rule.end_date || '');
    setShowAddModal(true);
  };

  const handleSaveRule = async () => {
    if (!selectedListing) return;
    if (!adjustmentValue) {
      Alert.alert('Error', 'Please enter an adjustment value');
      return;
    }

    try {
      const ruleData = {
        rule_type: ruleType,
        name: ruleName || RULE_TYPES.find(r => r.value === ruleType)?.label,
        adjustment_type: adjustmentType,
        adjustment_value: parseFloat(adjustmentValue),
        min_nights: minNights ? parseInt(minNights) : null,
        max_nights: maxNights ? parseInt(maxNights) : null,
        days_before_checkin: daysBeforeCheckin ? parseInt(daysBeforeCheckin) : null,
        days_of_week: ruleType === 'weekend' ? selectedDays : null,
        start_date: startDate || null,
        end_date: endDate || null,
      };

      if (editingRule) {
        await apiClient.put(
          `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing.id}/pricing-rules/${editingRule.id}`,
          ruleData
        );
        Alert.alert('Success', 'Pricing rule updated');
      } else {
        await apiClient.post(
          `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing.id}/pricing-rules`,
          ruleData
        );
        Alert.alert('Success', 'Pricing rule added');
      }

      setShowAddModal(false);
      resetForm();
      fetchRules();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save rule');
    }
  };

  const handleToggleRule = async (rule: PricingRule) => {
    if (!selectedListing) return;
    try {
      await apiClient.put(
        `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing.id}/pricing-rules/${rule.id}`,
        { is_active: !rule.is_active }
      );
      fetchRules();
    } catch (error) {
      Alert.alert('Error', 'Failed to update rule');
    }
  };

  const handleDeleteRule = (rule: PricingRule) => {
    Alert.alert(
      'Delete Rule',
      `Are you sure you want to delete "${rule.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(
                `/apps/${API_CONFIG.APP_ID}/listings/${selectedListing?.id}/pricing-rules/${rule.id}`
              );
              fetchRules();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete rule');
            }
          },
        },
      ]
    );
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const getRuleIcon = (type: string) => {
    return RULE_TYPES.find(r => r.value === type)?.icon || 'tag';
  };

  const formatAdjustment = (rule: PricingRule) => {
    const sign = rule.adjustment_value >= 0 ? '+' : '';
    if (rule.adjustment_type === 'percentage') {
      return `${sign}${rule.adjustment_value}%`;
    }
    return `${sign}$${rule.adjustment_value}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="tag-off" size={64} color="#C7C7CC" />
        <Text style={styles.emptyTitle}>No Listings</Text>
        <Text style={styles.emptySubtitle}>Create a listing first to set up pricing rules</Text>
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
                onPress={() => setSelectedListing(listing)}
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
          {/* Base Price Info */}
          <View style={styles.basePriceCard}>
            <View style={styles.basePriceInfo}>
              <Text style={styles.basePriceLabel}>Base Price</Text>
              <Text style={styles.basePriceValue}>
                ${parseFloat(selectedListing.price_per_night?.toString() || '0').toFixed(2)}/night
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editBaseButton}
              onPress={() => navigation.navigate('DynamicScreen', { 
                screenId: 130, 
                screenName: 'Edit Listing',
                listingId: selectedListing.id 
              })}
            >
              <Icon name="pencil" size={18} color="#007AFF" />
              <Text style={styles.editBaseText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Add Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Pricing Rule</Text>
            <View style={styles.ruleTypesGrid}>
              {RULE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={styles.ruleTypeCard}
                  onPress={() => openAddModal(type.value)}
                >
                  <Icon name={type.icon} size={28} color="#007AFF" />
                  <Text style={styles.ruleTypeLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Active Rules */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Rules</Text>
            {rules.length === 0 ? (
              <View style={styles.noRulesCard}>
                <Icon name="tag-outline" size={32} color="#C7C7CC" />
                <Text style={styles.noRulesText}>No pricing rules set</Text>
                <Text style={styles.noRulesSubtext}>Add rules above to adjust your pricing</Text>
              </View>
            ) : (
              rules.map((rule) => (
                <View key={rule.id} style={styles.ruleCard}>
                  <View style={styles.ruleHeader}>
                    <View style={styles.ruleIconContainer}>
                      <Icon name={getRuleIcon(rule.rule_type)} size={24} color="#007AFF" />
                    </View>
                    <View style={styles.ruleInfo}>
                      <Text style={styles.ruleName}>{rule.name}</Text>
                      <Text style={[
                        styles.ruleAdjustment,
                        { color: rule.adjustment_value >= 0 ? '#34C759' : '#FF9500' }
                      ]}>
                        {formatAdjustment(rule)}
                      </Text>
                    </View>
                    <Switch
                      value={rule.is_active}
                      onValueChange={() => handleToggleRule(rule)}
                      trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    />
                  </View>
                  <View style={styles.ruleActions}>
                    <TouchableOpacity
                      style={styles.ruleActionButton}
                      onPress={() => openEditModal(rule)}
                    >
                      <Icon name="pencil" size={18} color="#007AFF" />
                      <Text style={styles.ruleActionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.ruleActionButton}
                      onPress={() => handleDeleteRule(rule)}
                    >
                      <Icon name="delete" size={18} color="#FF3B30" />
                      <Text style={[styles.ruleActionText, { color: '#FF3B30' }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      )}

      {/* Add/Edit Rule Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingRule ? 'Edit Rule' : 'Add Pricing Rule'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Rule Type */}
              {!editingRule && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Rule Type</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={ruleType}
                      onValueChange={setRuleType}
                      style={styles.picker}
                    >
                      {RULE_TYPES.map((type) => (
                        <Picker.Item key={type.value} label={type.label} value={type.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}

              {/* Rule Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name (optional)</Text>
                <TextInput
                  style={styles.formInput}
                  value={ruleName}
                  onChangeText={setRuleName}
                  placeholder={RULE_TYPES.find(r => r.value === ruleType)?.label}
                />
              </View>

              {/* Adjustment */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Price Adjustment</Text>
                <View style={styles.adjustmentRow}>
                  <View style={styles.adjustmentTypeButtons}>
                    <TouchableOpacity
                      style={[styles.typeButton, adjustmentType === 'percentage' && styles.typeButtonActive]}
                      onPress={() => setAdjustmentType('percentage')}
                    >
                      <Text style={[styles.typeButtonText, adjustmentType === 'percentage' && styles.typeButtonTextActive]}>%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.typeButton, adjustmentType === 'fixed' && styles.typeButtonActive]}
                      onPress={() => setAdjustmentType('fixed')}
                    >
                      <Text style={[styles.typeButtonText, adjustmentType === 'fixed' && styles.typeButtonTextActive]}>$</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[styles.formInput, { flex: 1, marginLeft: 12 }]}
                    value={adjustmentValue}
                    onChangeText={setAdjustmentValue}
                    placeholder="e.g., 20 or -10"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.formHint}>
                  Positive = increase, Negative = discount
                </Text>
              </View>

              {/* Weekend Days */}
              {ruleType === 'weekend' && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Apply on Days</Text>
                  <View style={styles.daysRow}>
                    {DAYS_OF_WEEK.map((day) => (
                      <TouchableOpacity
                        key={day.value}
                        style={[styles.dayButton, selectedDays.includes(day.value) && styles.dayButtonActive]}
                        onPress={() => toggleDay(day.value)}
                      >
                        <Text style={[styles.dayButtonText, selectedDays.includes(day.value) && styles.dayButtonTextActive]}>
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Length of Stay */}
              {ruleType === 'length_of_stay' && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Minimum Nights</Text>
                  <TextInput
                    style={styles.formInput}
                    value={minNights}
                    onChangeText={setMinNights}
                    placeholder="e.g., 7"
                    keyboardType="numeric"
                  />
                </View>
              )}

              {/* Last Minute / Early Bird */}
              {(ruleType === 'last_minute' || ruleType === 'early_bird') && (
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    {ruleType === 'last_minute' ? 'Within X days of check-in' : 'At least X days before check-in'}
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    value={daysBeforeCheckin}
                    onChangeText={setDaysBeforeCheckin}
                    placeholder="e.g., 7"
                    keyboardType="numeric"
                  />
                </View>
              )}

              {/* Seasonal Dates */}
              {ruleType === 'seasonal' && (
                <>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Start Date (YYYY-MM-DD)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={startDate}
                      onChangeText={setStartDate}
                      placeholder="2024-12-20"
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>End Date (YYYY-MM-DD)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={endDate}
                      onChangeText={setEndDate}
                      placeholder="2025-01-05"
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveRule}
              >
                <Text style={styles.saveButtonText}>
                  {editingRule ? 'Update Rule' : 'Add Rule'}
                </Text>
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
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
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
  basePriceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  basePriceInfo: {},
  basePriceLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  basePriceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
  },
  editBaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBaseText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  ruleTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  ruleTypeCard: {
    width: '33.33%',
    padding: 4,
  },
  ruleTypeCardInner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  ruleTypeLabel: {
    fontSize: 11,
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 8,
  },
  noRulesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  noRulesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 12,
  },
  noRulesSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  ruleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ruleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleInfo: {
    flex: 1,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  ruleAdjustment: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  ruleActions: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  ruleActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  ruleActionText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  formHint: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  adjustmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustmentTypeButtons: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DynamicPricingElement;
