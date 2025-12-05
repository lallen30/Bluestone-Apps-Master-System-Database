import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { messagesService, Conversation } from '../../api/messagesService';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface ConversationListElementProps {
  element: ScreenElement;
  navigation: any;
}

const ConversationListElement: React.FC<ConversationListElementProps> = ({ element, navigation }) => {
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    auto_refresh_interval = 30000,
    show_unread_badge = true,
    show_avatars = true,
    enable_archive = true,
    pull_to_refresh = true,
    items_per_page = 50,
  } = config;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
    
    // Set up auto-refresh
    if (auto_refresh_interval > 0) {
      const interval = setInterval(fetchConversations, auto_refresh_interval);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchConversations = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await messagesService.getConversations({ per_page: items_per_page });
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (!refreshing) {
        Alert.alert('Error', 'Unable to load conversations');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleArchive = (conversation: Conversation) => {
    Alert.alert(
      'Archive Conversation',
      'Are you sure you want to archive this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            try {
              await messagesService.archiveConversation(conversation.id);
              fetchConversations();
            } catch (error: any) {
              Alert.alert('Error', 'Unable to archive conversation');
            }
          },
        },
      ]
    );
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderConversationCard = ({ item }: { item: Conversation }) => {
    const otherUserName = `${item.other_user_first_name} ${item.other_user_last_name}`;
    const hasUnread = show_unread_badge && item.unread_count > 0;

    return (
      <TouchableOpacity
        style={[styles.card, hasUnread && styles.cardUnread]}
        onPress={() =>
          navigation.navigate('DynamicScreen', {
            screenId: 117, // Chat screen
            screenName: 'Chat',
            conversationId: item.id,
            otherUserName,
            listingTitle: item.listing_title,
          })
        }
        onLongPress={enable_archive ? () => handleArchive(item) : undefined}
      >
        {show_avatars && (
          <View style={styles.avatar}>
            <Icon name="account" size={32} color="#fff" />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.userName, hasUnread && styles.userNameUnread]} numberOfLines={1}>
              {otherUserName}
            </Text>
            <Text style={styles.timeText}>{formatTime(item.last_message_at)}</Text>
          </View>

          {item.listing_title && (
            <Text style={styles.listingText} numberOfLines={1}>
              <Icon name="home" size={12} color="#8E8E93" /> {item.listing_title}
            </Text>
          )}

          <View style={styles.messageRow}>
            <Text
              style={[styles.messagePreview, hasUnread && styles.messagePreviewUnread]}
              numberOfLines={2}
            >
              {item.last_message_preview || 'No messages yet'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread_count}</Text>
              </View>
            )}
          </View>
        </View>

        <Icon name="chevron-right" size={24} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="chat-outline" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No Messages</Text>
      <Text style={styles.emptySubtitle}>
        Start a conversation with a host by contacting them from a property listing
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.list}>
          {conversations.map((item) => (
            <View key={item.id.toString()}>
              {renderConversationCard({ item })}
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
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardUnread: {
    backgroundColor: '#F0F8FF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginRight: 8,
  },
  userNameUnread: {
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  listingText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  messagePreviewUnread: {
    color: '#1C1C1E',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  },
});

export default ConversationListElement;
