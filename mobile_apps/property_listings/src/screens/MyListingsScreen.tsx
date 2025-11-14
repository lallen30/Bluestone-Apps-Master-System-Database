import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { listingsService } from '../api/listingsService';
import { PropertyListing } from '../types';
import { useAuth } from '../context/AuthContext';

const MyListingsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const response = await listingsService.getListings({
        user_id: user?.id,
        per_page: 100,
      });
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error fetching my listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyListings();
  };

  const handleTogglePublish = async (listing: PropertyListing) => {
    try {
      await listingsService.publishListing(listing.id, !listing.is_published);
      Alert.alert(
        'Success',
        listing.is_published ? 'Listing unpublished' : 'Listing published'
      );
      fetchMyListings();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Unable to update listing');
    }
  };

  const handleDelete = async (listing: PropertyListing) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${listing.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await listingsService.deleteListing(listing.id);
              Alert.alert('Success', 'Listing deleted');
              fetchMyListings();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Unable to delete listing');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'draft':
        return '#FFA726';
      case 'inactive':
        return '#EF5350';
      default:
        return '#999';
    }
  };

  const renderListingItem = ({ item }: { item: PropertyListing }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardMain}
        onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitle}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.location}>
              {item.city}, {item.country}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detail}>
            <Icon name="hotel" size={16} color="#666" />
            <Text style={styles.detailText}>{item.bedrooms} bed</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="people" size={16} color="#666" />
            <Text style={styles.detailText}>{item.guests_max} guests</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.price}>${item.price_per_night}/night</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, item.is_published && styles.actionButtonActive]}
          onPress={() => handleTogglePublish(item)}
        >
          <Icon
            name={item.is_published ? 'visibility-off' : 'visibility'}
            size={20}
            color={item.is_published ? '#fff' : '#666'}
          />
          <Text style={[styles.actionText, item.is_published && styles.actionTextActive]}>
            {item.is_published ? 'Unpublish' : 'Publish'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item)}
        >
          <Icon name="delete" size={20} color="#EF5350" />
          <Text style={[styles.actionText, styles.actionTextDelete]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="home-work" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No listings yet</Text>
      <Text style={styles.emptySubtext}>Create your first property listing to get started</Text>
      <TouchableOpacity style={styles.createButton}>
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Listing</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardMain: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionButtonActive: {
    backgroundColor: '#007AFF',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  actionTextActive: {
    color: '#fff',
  },
  actionTextDelete: {
    color: '#EF5350',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MyListingsScreen;
