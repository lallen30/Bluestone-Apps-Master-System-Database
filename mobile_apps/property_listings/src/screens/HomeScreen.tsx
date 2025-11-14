import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { listingsService } from '../api/listingsService';
import { PropertyListing } from '../types';

const HomeScreen = ({ navigation }: any) => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (pageNum = 1, search = searchText) => {
    try {
      if (pageNum === 1) setLoading(true);
      
      const response = await listingsService.getListings({
        page: pageNum,
        per_page: 20,
        search: search || undefined,
        status: 'active', // Only show active listings
      });

      const newListings = response.data.listings || [];
      
      if (pageNum === 1) {
        setListings(newListings);
      } else {
        setListings(prev => [...prev, ...newListings]);
      }

      setHasMore(response.data.pagination.page < response.data.pagination.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListings(page + 1);
    }
  };

  const handleSearch = () => {
    fetchListings(1, searchText);
  };

  const renderListingItem = ({ item }: { item: PropertyListing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
    >
      <View style={styles.imagePlaceholder}>
        {item.primary_image ? (
          <Image source={{ uri: item.primary_image }} style={styles.image} />
        ) : (
          <Icon name="home" size={60} color="#ccc" />
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        
        <View style={styles.locationRow}>
          <Icon name="place" size={16} color="#666" />
          <Text style={styles.location}>
            {item.city}, {item.country}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detail}>
            <Icon name="hotel" size={16} color="#666" />
            <Text style={styles.detailText}>{item.bedrooms} bed</Text>
          </View>
          <View style={styles.detail}>
            <Icon name="people" size={16} color="#666" />
            <Text style={styles.detailText}>{item.guests_max} guests</Text>
          </View>
        </View>

        <Text style={styles.price}>
          ${item.price_per_night}
          <Text style={styles.priceUnit}> / night</Text>
        </Text>

        {item.is_published && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Available</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="home-work" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No properties found</Text>
      <Text style={styles.emptySubtext}>
        {searchText ? 'Try a different search' : 'Check back later for new listings'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Properties</Text>
        
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city, title..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                fetchListings(1, '');
              }}
            >
              <Icon name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading properties...</Text>
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
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
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
