import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { favoritesService, FavoriteListing } from '../../api/favoritesService';
import { useAuth } from '../../context/AuthContext';

interface FavoritesListElementProps {
  config?: {
    showRemoveButton?: boolean;
    emptyMessage?: string;
    itemsPerPage?: number;
  };
  onItemPress?: (listing: FavoriteListing) => void;
}

const FavoritesListElement: React.FC<FavoritesListElementProps> = ({
  config = {},
  onItemPress,
}) => {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    showRemoveButton = true,
    emptyMessage = 'No favorites yet. Start exploring and save listings you love!',
    itemsPerPage = 20,
  } = config;

  const fetchFavorites = useCallback(async (pageNum: number = 1, refresh: boolean = false) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      if (pageNum === 1) {
        refresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await favoritesService.getFavorites({
        page: pageNum,
        per_page: itemsPerPage,
      });

      const newFavorites = response.data.favorites;
      
      if (pageNum === 1) {
        setFavorites(newFavorites);
      } else {
        setFavorites(prev => [...prev, ...newFavorites]);
      }

      setHasMore(pageNum < response.data.pagination.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [isAuthenticated, itemsPerPage]);

  useEffect(() => {
    fetchFavorites(1);
  }, [fetchFavorites]);

  const handleRefresh = () => {
    fetchFavorites(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFavorites(page + 1);
    }
  };

  const handleRemoveFavorite = async (listingId: number) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this listing from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await favoritesService.removeFavorite(listingId);
              setFavorites(prev => prev.filter(f => f.id !== listingId));
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (item: FavoriteListing) => {
    if (onItemPress) {
      onItemPress(item);
    } else {
      // Navigate to property detail screen
      navigation.navigate('PropertyDetail', {
        listingId: item.id,
        screenName: item.title,
      });
    }
  };

  const renderItem = ({ item }: { item: FavoriteListing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      {item.primary_image ? (
        <Image
          source={{ uri: item.primary_image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Icon name="home-outline" size={48} color="#ccc" />
        </View>
      )}
      {showRemoveButton && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Icon name="heart" size={24} color="#FF5A5F" />
        </TouchableOpacity>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          <Icon name="map-marker" size={14} color="#666" />
          {' '}{item.city}, {item.state || item.country}
        </Text>
        <View style={styles.details}>
          <Text style={styles.detailText}>
            <Icon name="bed" size={14} color="#666" /> {item.bedrooms}
          </Text>
          <Text style={styles.detailText}>
            <Icon name="shower" size={14} color="#666" /> {item.bathrooms}
          </Text>
          <Text style={styles.detailText}>
            <Icon name="account-group" size={14} color="#666" /> {item.guests_max}
          </Text>
        </View>
        <Text style={styles.price}>
          ${parseFloat(item.price_per_night).toFixed(0)}
          <Text style={styles.perNight}> / night</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    if (!isAuthenticated) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Sign in to see your favorites</Text>
          <Text style={styles.emptyText}>
            Create an account or sign in to save your favorite listings.
          </Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="heart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.exploreButtonText}>Explore Listings</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) => `favorite-${item.id}`}
      contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginRight: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  perNight: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesListElement;
