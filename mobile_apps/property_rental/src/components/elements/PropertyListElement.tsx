import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { listingsService } from '../../api/listingsService';
import { useAuth } from '../../context/AuthContext';
import { PropertyListing } from '../../types';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyListElementProps {
  element: ScreenElement;
  navigation: any;
}

const PropertyListElement: React.FC<PropertyListElementProps> = ({ element, navigation }) => {
  const { user } = useAuth();
  
  // Extract config - handle both string and object
  let config = element.config || element.default_config || {};
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (e) {
      config = {};
    }
  }
  
  const {
    ownerOnly = true,
    showFilters = true,
    items_per_page = 20,
  } = config;

  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const filters = ['all', 'active', 'draft', 'inactive'];

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = {
        per_page: items_per_page,
      };
      
      if (ownerOnly && user?.id) {
        params.user_id = user.id;
      }
      
      if (filter !== 'all') {
        params.status = filter;
      }
      
      const response = await listingsService.getListings(params);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Unable to load listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  const handleToggleStatus = async (listing: PropertyListing) => {
    try {
      const newStatus = listing.status === 'active' ? 'draft' : 'active';
      await listingsService.updateListingStatus(listing.id, newStatus);
      Alert.alert('Success', newStatus === 'active' ? 'Listing published!' : 'Listing unpublished');
      fetchListings();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Unable to update listing');
    }
  };

  const handleDelete = (listing: PropertyListing) => {
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
              fetchListings();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.message || 'Unable to delete listing');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (listing: PropertyListing) => {
    navigation.push('DynamicScreen', {
      screenId: 130,
      screenName: 'Edit Listing',
      listingId: listing.id,
    });
  };

  const handleCreate = () => {
    navigation.push('DynamicScreen', {
      screenId: 127,
      screenName: 'Create Listing',
    });
  };

  const handleViewDetails = (listing: PropertyListing) => {
    navigation.navigate('ListingDetail', { listingId: listing.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#34C759';
      case 'draft': return '#FF9500';
      case 'inactive': return '#8E8E93';
      case 'pending_review': return '#007AFF';
      case 'suspended': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const renderFilterTabs = () => {
    if (!showFilters) return null;
    
    return (
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderListingItem = ({ item }: { item: PropertyListing }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardMain} onPress={() => handleViewDetails(item)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitle}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.location}>{item.city}, {item.country}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detail}>
            <Icon name="bed" size={16} color="#666" />
            <Text style={styles.detailText}>{item.bedrooms} bed</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="account-group" size={16} color="#666" />
            <Text style={styles.detailText}>{item.guests_max} guests</Text>
          </View>
          <Text style={styles.price}>${item.price_per_night}/night</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
          <Icon name="pencil" size={18} color="#007AFF" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, item.status === 'active' && styles.actionButtonActive]}
          onPress={() => handleToggleStatus(item)}
        >
          <Icon
            name={item.status === 'active' ? 'eye-off' : 'eye'}
            size={18}
            color={item.status === 'active' ? '#fff' : '#34C759'}
          />
          <Text style={[styles.actionText, item.status === 'active' && styles.actionTextActive]}>
            {item.status === 'active' ? 'Unpublish' : 'Publish'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
          <Icon name="delete" size={18} color="#FF3B30" />
          <Text style={[styles.actionText, { color: '#FF3B30' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="home-group" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No listings yet</Text>
      <Text style={styles.emptySubtext}>Create your first property listing to get started</Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Listing</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && listings.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading listings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
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
    marginLeft: 'auto',
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
    backgroundColor: '#34C759',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 6,
  },
  actionTextActive: {
    color: '#fff',
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

export default PropertyListElement;
