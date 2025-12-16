import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { profileService, UserProfile, ProfileStats, UpdateProfileData } from '../../api/profileService';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'react-native-image-picker';

interface ProfileElementProps {
  config?: {
    showStats?: boolean;
    showEditButton?: boolean;
    editable?: boolean;
  };
}

const ProfileElement: React.FC<ProfileElementProps> = ({
  config = {},
}) => {
  const navigation = useNavigation<any>();
  const { isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<UpdateProfileData>({});

  const {
    showStats = true,
    showEditButton = true,
    editable = true,
  } = config;

  const fetchProfile = useCallback(async (refresh: boolean = false) => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const response = await profileService.getProfile();
      setProfile(response.data.profile);
      setStats(response.data.stats);
      setEditData({
        first_name: response.data.profile.first_name || '',
        last_name: response.data.profile.last_name || '',
        phone: response.data.profile.phone || '',
        bio: response.data.profile.bio || '',
        city: response.data.profile.city || '',
        state: response.data.profile.state || '',
        country: response.data.profile.country || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleRefresh = () => {
    fetchProfile(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await profileService.updateProfile(editData);
      setProfile(response.data.profile);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    });

    if (result.assets && result.assets[0]?.uri) {
      try {
        const response = await profileService.uploadAvatar(result.assets[0].uri);
        setProfile(prev => prev ? { ...prev, avatar_url: response.data.avatar_url } : null);
        Alert.alert('Success', 'Avatar updated successfully');
      } catch (error: any) {
        console.error('Error uploading avatar:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to upload avatar');
      }
    }
  };

  const handleDeleteAvatar = () => {
    Alert.alert(
      'Delete Avatar',
      'Are you sure you want to delete your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await profileService.deleteAvatar();
              setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
            } catch (error) {
              console.error('Error deleting avatar:', error);
              Alert.alert('Error', 'Failed to delete avatar');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.notAuthContainer}>
        <Icon name="account-circle-outline" size={80} color="#ccc" />
        <Text style={styles.notAuthTitle}>Sign in to view your profile</Text>
        <Text style={styles.notAuthText}>
          Create an account or sign in to manage your profile and settings.
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color="#FF5A5F" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchProfile()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={editable ? handlePickImage : undefined}
          disabled={!editable}
        >
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={60} color="#fff" />
            </View>
          )}
          {editable && (
            <View style={styles.avatarEditBadge}>
              <Icon name="camera" size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        {profile.avatar_url && editable && (
          <TouchableOpacity onPress={handleDeleteAvatar}>
            <Text style={styles.removeAvatarText}>Remove Photo</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.name}>
          {profile.first_name || profile.last_name
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : 'No Name'}
        </Text>
        <Text style={styles.email}>{profile.email}</Text>
        {profile.email_verified && (
          <View style={styles.verifiedBadge}>
            <Icon name="check-decagram" size={14} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      {showStats && stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.listings_count}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.bookings_as_guest}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.favorites_count}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.reviews_count}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>
      )}

      {/* Profile Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {showEditButton && editable && !editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Icon name="pencil" size={20} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View style={styles.editForm}>
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={editData.first_name}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, first_name: text }))}
                  placeholder="First Name"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={editData.last_name}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, last_name: text }))}
                  placeholder="Last Name"
                />
              </View>
            </View>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editData.phone}
              onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editData.bio}
              onChangeText={(text) => setEditData(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
            />
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  value={editData.city}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, city: text }))}
                  placeholder="City"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  value={editData.state}
                  onChangeText={(text) => setEditData(prev => ({ ...prev, state: text }))}
                  placeholder="State"
                />
              </View>
            </View>
            <Text style={styles.inputLabel}>Country</Text>
            <TextInput
              style={styles.input}
              value={editData.country}
              onChangeText={(text) => setEditData(prev => ({ ...prev, country: text }))}
              placeholder="Country"
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Icon name="phone" size={20} color="#666" />
              <Text style={styles.infoText}>{profile.phone || 'No phone number'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="map-marker" size={20} color="#666" />
              <Text style={styles.infoText}>
                {profile.city || profile.state || profile.country
                  ? [profile.city, profile.state, profile.country].filter(Boolean).join(', ')
                  : 'No location'}
              </Text>
            </View>
            {profile.bio && (
              <View style={styles.infoItem}>
                <Icon name="information" size={20} color="#666" />
                <Text style={styles.infoText}>{profile.bio}</Text>
              </View>
            )}
            <View style={styles.infoItem}>
              <Icon name="calendar" size={20} color="#666" />
              <Text style={styles.infoText}>
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Icon name="lock" size={20} color="#666" />
          <Text style={styles.menuItemText}>Change Password</Text>
          <Icon name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Icon name="heart" size={20} color="#666" />
          <Text style={styles.menuItemText}>My Favorites</Text>
          <Icon name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('DynamicScreen', {
            screenId: 114,
            screenName: 'My Bookings',
          })}
        >
          <Icon name="calendar-check" size={20} color="#666" />
          <Text style={styles.menuItemText}>My Bookings</Text>
          <Icon name="chevron-right" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="#FF5A5F" />
          <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notAuthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
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
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  removeAvatarText: {
    color: '#FF5A5F',
    fontSize: 12,
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  editForm: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF5A5F',
  },
});

export default ProfileElement;
