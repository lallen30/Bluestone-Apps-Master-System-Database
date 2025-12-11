import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { notificationsService, Notification } from '../../api/notificationsService';

interface NotificationListElementProps {
  element: {
    id: number;
    config?: {
      show_unread_badge?: boolean;
      group_by_date?: boolean;
      enable_swipe_actions?: boolean;
      empty_message?: string;
    };
  };
  navigation: any;
}

const NotificationListElement: React.FC<NotificationListElementProps> = ({
  element,
  navigation,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const config = element.config || {};
  const {
    show_unread_badge = true,
    group_by_date = true,
    enable_swipe_actions = true,
    empty_message = 'No notifications yet',
  } = config;

  const fetchNotifications = async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const response = await notificationsService.getNotifications({
        page: pageNum,
        per_page: 20,
      });

      if (response.success) {
        const newNotifications = response.data.notifications;
        
        if (refresh || pageNum === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }
        
        setUnreadCount(response.data.unread_count);
        setHasMore(pageNum < response.data.pagination.total_pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(1, true);
    }, [])
  );

  const handleRefresh = () => {
    fetchNotifications(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await notificationsService.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification type
    const data = notification.data;
    if (data) {
      switch (notification.type) {
        case 'booking_request':
        case 'booking_confirmed':
        case 'booking_cancelled':
        case 'booking_rejected':
          if (data.booking_id) {
            navigation.navigate('DynamicScreen', {
              screenId: 115, // Booking Details
              screenName: 'Booking Details',
              bookingId: data.booking_id,
            });
          }
          break;
        case 'new_message':
          if (data.conversation_id) {
            navigation.navigate('DynamicScreen', {
              screenId: 117, // Chat
              screenName: 'Chat',
              conversationId: data.conversation_id,
            });
          }
          break;
        case 'review_received':
          if (data.listing_id) {
            navigation.navigate('DynamicScreen', {
              screenId: 114, // Property Details
              screenName: 'Property Details',
              listingId: data.listing_id,
            });
          }
          break;
        default:
          // If there's a screen_id in data, navigate to it
          if (data.screen_id) {
            navigation.navigate('DynamicScreen', {
              screenId: data.screen_id,
              screenName: notification.title,
            });
          }
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark notifications as read');
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
        return 'calendar-plus';
      case 'booking_confirmed':
        return 'calendar-check';
      case 'booking_cancelled':
        return 'calendar-remove';
      case 'booking_rejected':
        return 'calendar-remove';
      case 'new_message':
        return 'message-text';
      case 'review_received':
        return 'star';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_request':
        return '#007AFF';
      case 'booking_confirmed':
        return '#34C759';
      case 'booking_cancelled':
      case 'booking_rejected':
        return '#FF3B30';
      case 'new_message':
        return '#5856D6';
      case 'review_received':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const renderNotification = ({ item, index }: { item: Notification; index: number }) => {
    const showDateHeader = group_by_date && (
      index === 0 ||
      new Date(item.created_at).toDateString() !== 
      new Date(notifications[index - 1].created_at).toDateString()
    );

    return (
      <View>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateHeader(item.created_at)}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.notificationCard,
            !item.is_read && styles.notificationUnread,
          ]}
          onPress={() => handleNotificationPress(item)}
          onLongPress={() => {
            if (enable_swipe_actions) {
              Alert.alert(
                'Delete Notification',
                'Are you sure you want to delete this notification?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
                ]
              );
            }
          }}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getNotificationColor(item.type) + '20' },
            ]}
          >
            <Icon
              name={getNotificationIcon(item.type)}
              size={24}
              color={getNotificationColor(item.type)}
            />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, !item.is_read && styles.titleUnread]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.time}>{formatTime(item.created_at)}</Text>
            </View>
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
          </View>
          {!item.is_read && show_unread_badge && (
            <View style={styles.unreadDot} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bell-off-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyText}>{empty_message}</Text>
      <Text style={styles.emptySubtext}>
        You'll see notifications here when there's activity
      </Text>
    </View>
  );

  const renderHeader = () => {
    if (notifications.length === 0 || unreadCount === 0) return null;
    
    return (
      <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
        <Icon name="check-all" size={18} color="#007AFF" />
        <Text style={styles.markAllText}>Mark all as read</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!hasMore || notifications.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
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
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  markAllText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  dateHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  dateHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  notificationUnread: {
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  titleUnread: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  message: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default NotificationListElement;
