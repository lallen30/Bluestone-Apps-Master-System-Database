import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_CONFIG } from '../../api/config';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyHostCardElementProps {
  element: ScreenElement;
  listingData?: any;
  navigation?: any;
}

const PropertyHostCardElement: React.FC<PropertyHostCardElementProps> = ({ element, listingData, navigation }) => {
  const config = element.config || element.default_config || {};
  const {
    title = 'Hosted by',
    showTitle = true,
    showMessageButton = true,
    showAvatar = true,
    backgroundColor = '#F2F2F7',
    textColor = '#1C1C1E',
    accentColor = '#007AFF',
  } = config;

  if (!listingData?.host_first_name) {
    return null;
  }

  const handleContactHost = () => {
    if (navigation) {
      navigation.navigate('DynamicScreen', {
        screenId: 117,
        screenName: 'Chat',
        listingId: listingData.id,
      });
    }
  };

  const avatarUrl = listingData.host_avatar 
    ? (listingData.host_avatar.startsWith('http') 
        ? listingData.host_avatar 
        : `${API_CONFIG.SERVER_URL}${listingData.host_avatar}`)
    : null;

  return (
    <View style={styles.container}>
      {showTitle && (
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      )}
      <View style={[styles.hostCard, { backgroundColor }]}>
        {showAvatar && (
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={32} color="#8E8E93" />
              </View>
            )}
          </View>
        )}
        <View style={styles.hostInfo}>
          <Text style={[styles.hostName, { color: textColor }]}>
            {listingData.host_first_name} {listingData.host_last_name}
          </Text>
          <Text style={styles.hostLabel}>Host</Text>
        </View>
        {showMessageButton && (
          <TouchableOpacity 
            style={[styles.messageButton, { borderColor: accentColor }]} 
            onPress={handleContactHost}
          >
            <Icon name="message-text" size={20} color={accentColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  hostLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default PropertyHostCardElement;
