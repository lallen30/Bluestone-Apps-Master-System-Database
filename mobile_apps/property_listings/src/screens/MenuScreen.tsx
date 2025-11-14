import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { screensService, AppScreen } from '../api/screensService';
import { useAuth } from '../context/AuthContext';

const MenuScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [screens, setScreens] = useState<AppScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchScreens();
  }, []);

  const fetchScreens = async () => {
    try {
      const sidebarScreens = await screensService.getSidebarScreens();
      setScreens(sidebarScreens);
    } catch (error) {
      console.error('Error fetching screens:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchScreens();
  };

  const handleScreenPress = (screen: AppScreen) => {
    navigation.navigate('DynamicScreen', { 
      screenId: screen.id,
      screenName: screen.name 
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderScreenItem = ({ item }: { item: AppScreen }) => {
    const categoryColors: { [key: string]: string } = {
      'settings': '#FF9500',
      'social': '#5856D6',
      'content': '#007AFF',
      'forms': '#34C759',
      'default': '#8E8E93',
    };

    const categoryColor = categoryColors[item.category?.toLowerCase() || 'default'] || categoryColors.default;

    return (
      <TouchableOpacity
        style={styles.screenItem}
        onPress={() => handleScreenPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
          <Icon name="article" size={24} color={categoryColor} />
        </View>
        <View style={styles.screenInfo}>
          <Text style={styles.screenName}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.screenDescription} numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
          {item.category ? (
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '15' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {item.category}
              </Text>
            </View>
          ) : null}
        </View>
        <Icon name="chevron-right" size={24} color="#C7C7CC" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.userSection}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitials}>
            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.actionIconContainer}>
            <Icon name="person" size={20} color="#007AFF" />
          </View>
          <Text style={styles.actionText}>View Profile</Text>
          <Icon name="chevron-right" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </View>

      {/* Dynamic Screens */}
      {screens.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP SCREENS</Text>
          <FlatList
            data={screens}
            renderItem={renderScreenItem}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitials: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
    marginLeft: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  screenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  screenInfo: {
    flex: 1,
  },
  screenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  screenDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#007AFF15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 8,
  },
});

export default MenuScreen;
