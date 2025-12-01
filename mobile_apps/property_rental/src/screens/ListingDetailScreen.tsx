import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { listingsService } from '../api/listingsService';
import { PropertyListing } from '../types';

const ListingDetailScreen = ({ route, navigation }: any) => {
  const { listingId } = route.params;
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading property...</Text>
      </View>
    );
  }

  if (!listing) {
    return null;
  }

  const propertyTypes: Record<string, string> = {
    house: 'House',
    apartment: 'Apartment',
    condo: 'Condo',
    villa: 'Villa',
    cabin: 'Cabin',
    cottage: 'Cottage',
    townhouse: 'Townhouse',
    loft: 'Loft',
    other: 'Other',
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Icon name="home-work" size={80} color="#ccc" />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.propertyType}>
            {propertyTypes[listing.property_type] || listing.property_type}
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Icon name="place" size={20} color="#666" />
          <Text style={styles.location}>
            {listing.address_line1 && `${listing.address_line1}, `}
            {listing.city}, {listing.state && `${listing.state}, `}
            {listing.country}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${listing.price_per_night}</Text>
          <Text style={styles.priceUnit}> / night</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Icon name="hotel" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Bedrooms</Text>
            <Text style={styles.detailValue}>{listing.bedrooms}</Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="bathroom" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Bathrooms</Text>
            <Text style={styles.detailValue}>{listing.bathrooms}</Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="people" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Guests</Text>
            <Text style={styles.detailValue}>{listing.guests_max}</Text>
          </View>

          <View style={styles.detailItem}>
            <Icon name="king-bed" size={24} color="#007AFF" />
            <Text style={styles.detailLabel}>Beds</Text>
            <Text style={styles.detailValue}>{listing.beds}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {listing.description || 'No description available'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Min Nights:</Text>
            <Text style={styles.infoValue}>{listing.min_nights}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max Nights:</Text>
            <Text style={styles.infoValue}>{listing.max_nights}</Text>
          </View>

          {listing.check_in_time && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Check-in:</Text>
              <Text style={styles.infoValue}>{listing.check_in_time}</Text>
            </View>
          )}

          {listing.check_out_time && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Check-out:</Text>
              <Text style={styles.infoValue}>{listing.check_out_time}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cleaning Fee:</Text>
            <Text style={styles.infoValue}>
              ${listing.cleaning_fee || '0'} {listing.currency}
            </Text>
          </View>
        </View>

        {listing.house_rules && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>House Rules</Text>
            <Text style={styles.description}>{listing.house_rules}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Host Information</Text>
          <View style={styles.hostInfo}>
            <View style={styles.hostAvatar}>
              <Icon name="person" size={30} color="#007AFF" />
            </View>
            <View style={styles.hostDetails}>
              <Text style={styles.hostName}>
                {listing.host_first_name} {listing.host_last_name}
              </Text>
              <Text style={styles.hostEmail}>{listing.host_email}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Icon name="message" size={20} color="#fff" />
          <Text style={styles.contactButtonText}>Contact Host</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  propertyType: {
    fontSize: 16,
    color: '#666',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceUnit: {
    fontSize: 16,
    color: '#666',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  hostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  hostEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ListingDetailScreen;
