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
import apiClient from '../../api/client';
import { API_CONFIG } from '../../api/config';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface ReviewsElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

interface Review {
  id: number;
  listing_id: number;
  listing_title?: string;
  reviewer_id: number;
  reviewer_first_name?: string;
  reviewer_last_name?: string;
  rating: number;
  cleanliness_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  accuracy_rating?: number;
  review_text?: string;
  host_response?: string;
  created_at: string;
}

const ReviewsElement: React.FC<ReviewsElementProps> = ({ element, navigation, route }) => {
  const config = element.config || element.default_config || {};
  const {
    viewType = 'listing', // 'listing', 'user', 'write'
    showRatingBreakdown = true,
    allowHostResponse = true,
  } = config;

  const listingId = route.params?.listingId;
  const bookingId = route.params?.bookingId;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(viewType === 'write');
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [locationRating, setLocationRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [accuracyRating, setAccuracyRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Stats
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (viewType !== 'write') {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const endpoint = listingId 
        ? `/apps/${API_CONFIG.APP_ID}/listings/${listingId}/reviews`
        : `/apps/${API_CONFIG.APP_ID}/reviews/my`;
      
      const response = await apiClient.get(endpoint);
      setReviews(response.data.data?.reviews || []);
      setAverageRating(response.data.data?.average_rating || 0);
      setTotalReviews(response.data.data?.total_reviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post(`/apps/${API_CONFIG.APP_ID}/reviews`, {
        listing_id: listingId,
        booking_id: bookingId,
        rating,
        cleanliness_rating: cleanlinessRating,
        communication_rating: communicationRating,
        location_rating: locationRating,
        value_rating: valueRating,
        accuracy_rating: accuracyRating,
        review_text: reviewText,
      });
      
      Alert.alert('Success', 'Review submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value: number, onPress?: (val: number) => void, size = 20) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress && onPress(i)}
          disabled={!onPress}
        >
          <Icon
            name={i <= value ? 'star' : 'star-outline'}
            size={size}
            color={i <= value ? '#FFD700' : '#C7C7CC'}
            style={{ marginRight: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderRatingInput = (label: string, value: number, onChange: (val: number) => void) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      {renderStars(value, onChange, 24)}
    </View>
  );

  const renderReviewCard = (review: Review) => {
    const date = new Date(review.created_at);
    const reviewerName = review.reviewer_first_name 
      ? `${review.reviewer_first_name} ${review.reviewer_last_name?.charAt(0) || ''}.`
      : 'Guest';

    return (
      <View key={review.id} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <View style={styles.avatar}>
              <Icon name="account" size={24} color="#8E8E93" />
            </View>
            <View>
              <Text style={styles.reviewerName}>{reviewerName}</Text>
              <Text style={styles.reviewDate}>{date.toLocaleDateString()}</Text>
            </View>
          </View>
          {renderStars(review.rating)}
        </View>

        {review.review_text && (
          <Text style={styles.reviewText}>{review.review_text}</Text>
        )}

        {showRatingBreakdown && (
          <View style={styles.ratingBreakdown}>
            {review.cleanliness_rating && (
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Cleanliness</Text>
                <Text style={styles.breakdownValue}>{review.cleanliness_rating.toFixed(1)}</Text>
              </View>
            )}
            {review.communication_rating && (
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Communication</Text>
                <Text style={styles.breakdownValue}>{review.communication_rating.toFixed(1)}</Text>
              </View>
            )}
            {review.location_rating && (
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Location</Text>
                <Text style={styles.breakdownValue}>{review.location_rating.toFixed(1)}</Text>
              </View>
            )}
            {review.value_rating && (
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Value</Text>
                <Text style={styles.breakdownValue}>{review.value_rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        )}

        {review.host_response && (
          <View style={styles.hostResponse}>
            <Text style={styles.hostResponseLabel}>Host Response:</Text>
            <Text style={styles.hostResponseText}>{review.host_response}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  // Write review mode
  if (viewType === 'write' || showWriteModal) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.writeContainer}>
          <Text style={styles.writeTitle}>Write a Review</Text>
          
          {renderRatingInput('Overall Rating', rating, setRating)}
          {renderRatingInput('Cleanliness', cleanlinessRating, setCleanlinessRating)}
          {renderRatingInput('Communication', communicationRating, setCommunicationRating)}
          {renderRatingInput('Location', locationRating, setLocationRating)}
          {renderRatingInput('Value', valueRating, setValueRating)}
          {renderRatingInput('Accuracy', accuracyRating, setAccuracyRating)}

          <Text style={styles.inputLabel}>Your Review</Text>
          <TextInput
            style={styles.reviewInput}
            value={reviewText}
            onChangeText={setReviewText}
            placeholder="Share your experience..."
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmitReview}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Summary */}
      {totalReviews > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRating}>
            <Icon name="star" size={32} color="#FFD700" />
            <Text style={styles.summaryValue}>{averageRating.toFixed(1)}</Text>
          </View>
          <Text style={styles.summaryCount}>{totalReviews} review{totalReviews !== 1 ? 's' : ''}</Text>
        </View>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="star-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to leave a review!
          </Text>
        </View>
      ) : (
        <View style={styles.reviewsList}>
          {reviews.map(renderReviewCard)}
        </View>
      )}
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
  summary: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  summaryRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  summaryCount: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  reviewsList: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  reviewDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 15,
    color: '#1C1C1E',
    lineHeight: 22,
    marginBottom: 12,
  },
  ratingBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  breakdownItem: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  hostResponse: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  hostResponseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  hostResponseText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
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
  },
  // Write review styles
  writeContainer: {
    padding: 16,
  },
  writeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  reviewInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
    color: '#1C1C1E',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ReviewsElement;
