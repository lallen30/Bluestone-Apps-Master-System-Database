import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  Platform,
  Modal,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { listingsService } from '../../api/listingsService';
import { messagesService } from '../../api/messagesService';
import { API_CONFIG } from '../../api/config';

// Helper to transform relative URLs to absolute
const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${API_CONFIG.SERVER_URL}${path}`;
};

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyDetailElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

interface PropertyListing {
  id: number;
  user_id: number; // Host's user ID
  title: string;
  description: string;
  property_type: string;
  city: string;
  state: string;
  country: string;
  address: string;
  price_per_night: string | number;
  cleaning_fee?: string | number;
  bedrooms: number;
  bathrooms: number;
  max_guests?: number;
  guests_max?: number;
  amenities: string[];
  primary_image?: string;
  images?: Array<{
    id: number;
    image_url: string;
    is_primary?: number;
    caption?: string;
  }>;
  videos?: Array<{
    id: number;
    video_url: string;
    thumbnail_url?: string;
    caption?: string;
  }>;
  host_first_name?: string;
  host_last_name?: string;
  host_avatar?: string;
  average_rating?: number;
  total_reviews?: number;
  status: string;
}

const PropertyDetailElement: React.FC<PropertyDetailElementProps> = ({
  element,
  navigation,
  route,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listingId = route.params?.listingId;
  const config = element.config || element.default_config || {};
  const {
    showBookButton = true,
    showContactHost = true,
    showAmenities = true,
    showReviews = true,
  } = config;

  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<any>(null);

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
      setListing(response.data as unknown as PropertyListing);
    } catch (error) {
      console.error('Error fetching listing:', error);
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    navigation.navigate('DynamicScreen', {
      screenId: 113, // Booking screen
      screenName: 'Book Property',
      listingId: listing?.id,
    });
  };

  const handleContactHost = async () => {
    if (!listing?.user_id) {
      Alert.alert('Error', 'Unable to contact host');
      return;
    }

    try {
      // Start or get existing conversation with the host
      const response = await messagesService.startConversation({
        other_user_id: listing.user_id,
        listing_id: listing.id,
      });

      // Navigate to chat screen with conversation ID
      navigation.navigate('DynamicScreen', {
        screenId: 117, // Chat screen
        screenName: 'Chat',
        conversationId: response.data.conversation_id,
        otherUserName:
          `${listing.host_first_name || ''} ${
            listing.host_last_name || ''
          }`.trim() || 'Host',
        listingTitle: listing.title,
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      Alert.alert('Error', 'Unable to start conversation with host');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorites API
  };

  const handleViewReviews = () => {
    navigation.navigate('DynamicScreen', {
      screenId: 135, // Reviews screen (if exists)
      screenName: 'Reviews',
      listingId: listing?.id,
    });
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
    return (
      <View style={styles.errorContainer}>
        <Icon name="home-alert" size={64} color="#C7C7CC" />
        <Text style={styles.errorTitle}>Property Not Found</Text>
        <Text style={styles.errorSubtitle}>
          This property may no longer be available
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Build media items array (images + videos)
  interface MediaItem {
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
    caption?: string;
  }

  const mediaItems: MediaItem[] = [];

  // Add images
  if (listing.images && listing.images.length > 0) {
    listing.images.forEach(img => {
      const url = getImageUrl(img.image_url);
      if (url) {
        mediaItems.push({
          type: 'image',
          url,
          caption: img.caption,
        });
      }
    });
  } else if (listing.primary_image) {
    const url = getImageUrl(listing.primary_image);
    if (url) {
      mediaItems.push({ type: 'image', url });
    }
  }

  // Add videos
  if (listing.videos && listing.videos.length > 0) {
    listing.videos.forEach(video => {
      const url = getImageUrl(video.video_url);
      const thumbnailUrl = video.thumbnail_url
        ? getImageUrl(video.thumbnail_url)
        : undefined;
      if (url) {
        mediaItems.push({
          type: 'video',
          url,
          thumbnailUrl,
          caption: video.caption,
        });
      }
    });
  }

  const handlePlayVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setVideoPaused(false);
    setVideoModalVisible(true);
  };

  const handleCloseVideo = () => {
    setVideoModalVisible(false);
    setCurrentVideoUrl(null);
    setVideoPaused(true);
  };

  const price = parseFloat(listing.price_per_night?.toString() || '0');
  const cleaningFee = parseFloat(listing.cleaning_fee?.toString() || '0');
  const location = [listing.city, listing.state, listing.country]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Media Gallery (Images + Videos) */}
        <View style={styles.imageContainer}>
          {mediaItems.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={screenWidth}
                snapToAlignment="start"
                decelerationRate="fast"
                bounces={false}
                onMomentumScrollEnd={e => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x / screenWidth,
                  );
                  setCurrentImageIndex(index);
                }}
              >
                {mediaItems.map((item: MediaItem, index: number) => (
                  <View
                    key={index}
                    style={[styles.mediaSlide, { width: screenWidth }]}
                  >
                    {item.type === 'image' ? (
                      <Image
                        source={{ uri: item.url }}
                        style={[styles.image, { width: screenWidth }]}
                        resizeMode="cover"
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.videoContainer}
                        onPress={() => handlePlayVideo(item.url)}
                        activeOpacity={0.9}
                      >
                        {item.thumbnailUrl ? (
                          <Image
                            source={{ uri: item.thumbnailUrl }}
                            style={[styles.image, { width: screenWidth }]}
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={[
                              styles.image,
                              styles.videoPlaceholder,
                              { width: screenWidth },
                            ]}
                          >
                            <Icon
                              name="video-outline"
                              size={64}
                              color="rgba(255,255,255,0.6)"
                            />
                          </View>
                        )}
                        {/* Gradient overlay for better visibility */}
                        <View style={styles.videoGradientOverlay} />
                        {/* Play button */}
                        <View style={styles.playButtonOverlay}>
                          <View style={styles.playButton}>
                            <Icon name="play" size={32} color="#fff" />
                          </View>
                        </View>
                        {/* Video badge */}
                        <View style={styles.videoBadge}>
                          <Icon name="video" size={14} color="#fff" />
                          <Text style={styles.videoBadgeText}>VIDEO</Text>
                        </View>
                        {/* Caption at bottom */}
                        {item.caption && (
                          <View style={styles.videoCaptionOverlay}>
                            <Text style={styles.videoCaptionText}>
                              {item.caption}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
              {mediaItems.length > 1 && (
                <View style={styles.imagePagination}>
                  {mediaItems.map((item: MediaItem, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentImageIndex &&
                          styles.paginationDotActive,
                        item.type === 'video' && styles.paginationDotVideo,
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.noImage}>
              <Icon name="image-off" size={64} color="#C7C7CC" />
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#FF3B30' : '#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Location */}
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.locationRow}>
            <Icon name="map-marker" size={16} color="#8E8E93" />
            <Text style={styles.location}>{location}</Text>
          </View>

          {/* Rating */}
          {listing.average_rating !== undefined &&
            listing.average_rating > 0 && (
              <TouchableOpacity
                style={styles.ratingRow}
                onPress={handleViewReviews}
              >
                <Icon name="star" size={18} color="#FFD700" />
                <Text style={styles.rating}>
                  {listing.average_rating.toFixed(1)}
                </Text>
                <Text style={styles.reviewCount}>
                  ({listing.total_reviews || 0} review
                  {listing.total_reviews !== 1 ? 's' : ''})
                </Text>
                <Icon name="chevron-right" size={18} color="#8E8E93" />
              </TouchableOpacity>
            )}

          {/* Property Type & Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.propertyType}>{listing.property_type}</Text>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Icon name="bed" size={20} color="#007AFF" />
                <Text style={styles.detailValue}>{listing.bedrooms}</Text>
                <Text style={styles.detailLabel}>Bedrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="shower" size={20} color="#007AFF" />
                <Text style={styles.detailValue}>{listing.bathrooms}</Text>
                <Text style={styles.detailLabel}>Bathrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="account-group" size={20} color="#007AFF" />
                <Text style={styles.detailValue}>
                  {listing.guests_max || listing.max_guests || 0}
                </Text>
                <Text style={styles.detailLabel}>Guests</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this place</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          {/* Amenities */}
          {showAmenities &&
            listing.amenities &&
            listing.amenities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What this place offers</Text>
                <View style={styles.amenitiesGrid}>
                  {listing.amenities.slice(0, 8).map((amenity, index) => (
                    <View key={index} style={styles.amenityItem}>
                      <Icon name="check-circle" size={18} color="#34C759" />
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                </View>
                {listing.amenities.length > 8 && (
                  <TouchableOpacity style={styles.showMoreButton}>
                    <Text style={styles.showMoreText}>
                      Show all {listing.amenities.length} amenities
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

          {/* Host Info */}
          {listing.host_first_name && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hosted by</Text>
              <TouchableOpacity
                style={styles.hostCard}
                onPress={() => {
                  // Navigate to host profile screen
                  navigation.navigate('DynamicScreen', {
                    screenId: 105, // User Profile screen
                    screenName: `${listing.host_first_name}'s Profile`,
                    userId: listing.user_id,
                    viewingOtherUser: true,
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={styles.hostAvatar}>
                  {listing.host_avatar ? (
                    <Image
                      source={{ uri: getImageUrl(listing.host_avatar) }}
                      style={styles.hostAvatarImage}
                    />
                  ) : (
                    <Icon name="account" size={32} color="#8E8E93" />
                  )}
                </View>
                <View style={styles.hostInfo}>
                  <Text style={styles.hostName}>
                    {listing.host_first_name} {listing.host_last_name}
                  </Text>
                  <Text style={styles.hostLabel}>Host</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#C7C7CC" />
              </TouchableOpacity>
              {showContactHost && (
                <TouchableOpacity
                  style={styles.contactHostButton}
                  onPress={handleContactHost}
                >
                  <Icon name="message-text" size={20} color="#007AFF" />
                  <Text style={styles.contactHostText}>Message Host</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Spacer for bottom bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${price.toFixed(0)}</Text>
            <Text style={styles.priceLabel}>/night</Text>
          </View>
          {cleaningFee > 0 && (
            <Text style={styles.cleaningFee}>
              +${cleaningFee.toFixed(0)} cleaning
            </Text>
          )}
        </View>
        {showBookButton && (
          <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
            <Text style={styles.bookButtonText}>Reserve</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Video Player Modal */}
      <Modal
        visible={videoModalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={handleCloseVideo}
        supportedOrientations={['portrait', 'landscape']}
      >
        <StatusBar hidden={videoModalVisible} />
        <View style={styles.videoModalContainer}>
          <TouchableOpacity
            style={styles.videoCloseButton}
            onPress={handleCloseVideo}
          >
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {currentVideoUrl && (
            <Video
              ref={videoRef}
              source={{ uri: currentVideoUrl }}
              style={styles.fullscreenVideo}
              controls={true}
              resizeMode="contain"
              paused={videoPaused}
              onEnd={handleCloseVideo}
              onError={(error: any) => {
                console.error('Video error:', error);
                Alert.alert('Error', 'Unable to play video');
                handleCloseVideo();
              }}
            />
          )}
          <TouchableOpacity
            style={styles.videoPlayPauseButton}
            onPress={() => setVideoPaused(!videoPaused)}
          >
            <Icon
              name={videoPaused ? 'play' : 'pause'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
  },
  image: {
    height: 300,
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  paginationDotVideo: {
    backgroundColor: 'rgba(255,59,48,0.7)',
  },
  mediaSlide: {
    height: 300,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  videoPlaceholder: {
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,56,92,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  videoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  videoCaptionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  videoCaptionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  propertyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 8,
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
  },
  hostAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  hostAvatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  hostInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  hostLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  contactHostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  contactHostText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  priceContainer: {
    flex: 1,
    marginRight: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  priceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 2,
  },
  cleaningFee: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    flexShrink: 0,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  videoPlayPauseButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PropertyDetailElement;
