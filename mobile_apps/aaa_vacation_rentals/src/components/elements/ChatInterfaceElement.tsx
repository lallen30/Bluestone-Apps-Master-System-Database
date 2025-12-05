import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { messagesService, Message } from '../../api/messagesService';
import { useAuth } from '../../context/AuthContext';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface ChatInterfaceElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

const ChatInterfaceElement: React.FC<ChatInterfaceElementProps> = ({ element, navigation, route }) => {
  const { user } = useAuth();
  
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    conversation_id_source = 'route_param',
    auto_refresh_interval = 5000,
    show_timestamps = true,
    enable_attachments = false,
    max_message_length = 1000,
    message_bubble_style = 'ios',
    show_date_separators = true,
  } = config;

  // Get conversation ID from route params or config
  const conversationId = conversation_id_source === 'route_param' 
    ? route.params?.conversationId 
    : config.conversation_id;
  const otherUserName = route.params?.otherUserName || 'User';
  const listingTitle = route.params?.listingTitle;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: otherUserName,
      headerRight: () => listingTitle && (
        <Text style={styles.headerSubtitle} numberOfLines={1}>
          {listingTitle}
        </Text>
      ),
    });

    if (conversationId) {
      fetchMessages();
      markAsRead();

      // Auto-refresh
      if (auto_refresh_interval > 0) {
        const interval = setInterval(fetchMessages, auto_refresh_interval);
        return () => clearInterval(interval);
      }
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const response = await messagesService.getMessages(conversationId, { per_page: 100 });
      setMessages(response.data.messages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (loading) {
        Alert.alert('Error', 'Unable to load messages');
        navigation.goBack();
      }
    }
  };

  const markAsRead = async () => {
    try {
      await messagesService.markAsRead(conversationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleSend = async () => {
    const trimmedText = messageText.trim();
    if (!trimmedText) return;

    if (trimmedText.length > max_message_length) {
      Alert.alert('Error', `Message is too long. Maximum ${max_message_length} characters.`);
      return;
    }

    setMessageText('');
    setSending(true);

    try {
      await messagesService.sendMessage(conversationId, trimmedText);
      await fetchMessages();
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Unable to send message. Please try again.');
      setMessageText(trimmedText); // Restore message
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMyMessage = item.sender_id === user?.id;
    const previousMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const showDate = show_date_separators && (!previousMessage || 
      formatDate(item.created_at) !== formatDate(previousMessage.created_at));

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          </View>
        )}
        <View style={[styles.messageContainer, isMyMessage && styles.myMessageContainer]}>
          <View style={[
            styles.messageBubble,
            isMyMessage && styles.myMessageBubble,
            message_bubble_style === 'android' && styles.androidBubble,
          ]}>
            <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
              {item.message_text}
            </Text>
            {show_timestamps && (
              <Text style={[styles.timeText, isMyMessage && styles.myTimeText]}>
                {formatTime(item.created_at)}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={[styles.emptyContainer, { transform: [{ scaleY: -1 }] }]}>
      <Icon name="chat" size={64} color="#C7C7CC" />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>Start the conversation!</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        inverted
        contentContainerStyle={messages.length === 0 ? styles.emptyList : styles.messagesList}
        ListEmptyComponent={renderEmptyState}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          placeholderTextColor="#8E8E93"
          multiline
          maxLength={max_message_length}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!messageText.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 16,
    maxWidth: 150,
  },
  messagesList: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
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
    marginTop: 4,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
  },
  myMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  androidBubble: {
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  timeText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 4,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatInterfaceElement;
