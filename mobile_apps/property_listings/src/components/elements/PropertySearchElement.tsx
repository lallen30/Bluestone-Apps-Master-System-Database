import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { listingsService } from '../../api/listingsService';
import { PropertyListing } from '../../types';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertySearchElementProps {
  element: ScreenElement;
  navigation: any;
}

const PropertySearchElement: React.FC<PropertySearchElementProps> = ({ element, navigation }) => {
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    filters = ['location', 'dates', 'guests', 'price'],
    sort_options = ['price_asc', 'price_desc', 'newest', 'rating'],
    default_sort = 'newest',
    show_map = false,
    card_layout = 'grid',
    items_per_page = 20,
    enable_favorites = true,
  } = config;

  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(default_sort);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [guests, setGuests] = useState('');

  useEffect(() => {
    fetchListings();
  }, [sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params: any = {
        per_page: items_per_page,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (minPrice) {
        params.min_price = parseFloat(minPrice);
      }

      if (maxPrice) {
        params.max_price = parseFloat(maxPrice);
      }

      if (guests) {
        params.min_guests = parseInt(guests);
      }

      // Map sort options
      if (sortBy === 'price_asc') {
        params.sort_by = 'price';
        params.order = 'asc';
      } else if (sortBy === 'price_desc') {
        params.sort_by = 'price';
        params.order = 'desc';
      } else if (sortBy === 'newest') {
        params.sort_by = 'created_at';
        params.order = 'desc';
      }

      const response = await listingsService.getListings(params);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Alert.alert('Error', 'Unable to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setGuests('');
    setSortBy(default_sort);
    fetchListings();
  };

  const renderPropertyCard = ({ item }: { item: PropertyListing }) => {
    const pricePerNight = typeof item.price_per_night === 'string' 
      ? parseFloat(item.price_per_night) 
      : item.price_per_night || 0;

    if (card_layout === 'list') {
      return (
        <TouchableOpacity
          style={styles.listCard}
          onPress={() => navigation.navigate('DynamicScreen', { 
            screenId: 97, 
            screenName: 'Property Details',
            listingId: item.id 
          })}
        >
          {item.primary_image ? (
            <Image
              source={{ uri: item.primary_image }}
              style={styles.listImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.listImage, styles.placeholderImage]}>
              <Icon name="home" size={48} color="#C7C7CC" />
            </View>
          )}
          <View style={styles.listCardContent}>
            <Text style={styles.listTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.listLocation}>
              {item.city}, {item.country}
            </Text>
            <View style={styles.listDetails}>
              <View style={styles.detailItem}>
                <Icon name="people" size={14} color="#8E8E93" />
                <Text style={styles.detailText}>{item.guests_max} guests</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="hotel" size={14} color="#8E8E93" />
                <Text style={styles.detailText}>{item.bedrooms} beds</Text>
              </View>
            </View>
            <Text style={styles.listPrice}>${pricePerNight.toFixed(2)}/night</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Grid layout (default)
    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() => navigation.navigate('DynamicScreen', { 
          screenId: 97, 
          screenName: 'Property Details',
          listingId: item.id 
        })}
      >
        {item.primary_image ? (
          <Image
            source={{ uri: item.primary_image }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.gridImage, styles.placeholderImage]}>
            <Icon name="home" size={48} color="#C7C7CC" />
          </View>
        )}
        <View style={styles.gridCardContent}>
          <Text style={styles.gridTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.gridLocation} numberOfLines={1}>
            {item.city}, {item.country}
          </Text>
          <View style={styles.gridDetails}>
            <Icon name="people" size={14} color="#8E8E93" />
            <Text style={styles.gridDetailText}>{item.guests_max}</Text>
            <Icon name="hotel" size={14} color="#8E8E93" style={styles.detailIcon} />
            <Text style={styles.gridDetailText}>{item.bedrooms}</Text>
          </View>
          <Text style={styles.gridPrice}>${pricePerNight.toFixed(2)}/night</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="search-off" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No Properties Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your search or filters
      </Text>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
        <Text style={styles.clearButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by location, title..."
            placeholderTextColor="#8E8E93"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="tune" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          {filters.includes('price') && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceInputs}>
                <TextInput
                  style={styles.priceInput}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  placeholder="Min"
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="Max"
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}

          {filters.includes('guests') && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Guests</Text>
              <TextInput
                style={styles.filterInput}
                value={guests}
                onChangeText={setGuests}
                placeholder="Number of guests"
                keyboardType="numeric"
              />
            </View>
          )}

          {sort_options.length > 0 && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.sortButtons}>
                {sort_options.map((option: string) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.sortButton, sortBy === option && styles.sortButtonActive]}
                    onPress={() => setSortBy(option)}
                  >
                    <Text style={[styles.sortButtonText, sortBy === option && styles.sortButtonTextActive]}>
                      {option === 'price_asc' && 'Price: Low to High'}
                      {option === 'price_desc' && 'Price: High to Low'}
                      {option === 'newest' && 'Newest'}
                      {option === 'rating' && 'Rating'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={handleClearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleSearch}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Searching properties...</Text>
        </View>
      ) : listings.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.list}>
          {listings.map((item) => (
            <View key={item.id.toString()}>
              {renderPropertyCard({ item })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    marginLeft: 8,
    color: '#1C1C1E',
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  filtersPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: '#8E8E93',
  },
  filterInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#1C1C1E',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
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
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
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
  clearButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Grid layout
  gridCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderImage: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  gridLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  gridDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridDetailText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
    marginRight: 8,
  },
  detailIcon: {
    marginLeft: 4,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  // List layout
  listCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  listCardContent: {
    flex: 1,
    padding: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  listLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  listDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default PropertySearchElement;
