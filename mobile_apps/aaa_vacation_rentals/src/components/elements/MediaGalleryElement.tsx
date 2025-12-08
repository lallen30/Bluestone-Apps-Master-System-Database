import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { uploadService, MediaItem } from '../../api/uploadService';

interface MediaGalleryConfig {
  media_types?: ('image' | 'video')[];
  max_items?: number;
  min_items?: number;
  allow_reorder?: boolean;
  allow_captions?: boolean;
  show_primary_selector?: boolean;
  grid_columns?: number;
  max_file_size_mb?: number;
  aspect_ratio?: string | null;
  upload_text?: string;
}

interface MediaGalleryElementProps {
  element: {
    id: number;
    element_type: string;
    field_key: string;
    label?: string;
    is_required?: boolean;
    config?: MediaGalleryConfig;
    default_config?: MediaGalleryConfig;
  };
  value: MediaItem[];
  onChange: (value: MediaItem[]) => void;
  disabled?: boolean;
}

const MediaGalleryElement: React.FC<MediaGalleryElementProps> = ({
  element,
  value = [],
  onChange,
  disabled = false,
}) => {
  const config = element.config || element.default_config || {};
  const {
    media_types = ['image'],
    max_items = 10,
    min_items = 0,
    allow_reorder = true,
    allow_captions = false,
    show_primary_selector = false,
    grid_columns = 3,
    upload_text = 'Add Media',
  } = config;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const mediaItems: MediaItem[] = Array.isArray(value) ? value : [];
  const canAddMore = mediaItems.length < max_items;
  const allowImages = media_types.includes('image');
  const allowVideos = media_types.includes('video');

  const handleAddMedia = useCallback(() => {
    if (!canAddMore || disabled) return;

    const options: string[] = [];
    const actions: (() => void)[] = [];

    if (allowImages) {
      options.push('Take Photo');
      actions.push(() => pickFromCamera('image'));
      options.push('Choose Photos');
      actions.push(() => pickFromLibrary('image'));
    }

    if (allowVideos) {
      options.push('Record Video');
      actions.push(() => pickFromCamera('video'));
      options.push('Choose Video');
      actions.push(() => pickFromLibrary('video'));
    }

    options.push('Cancel');

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex) => {
          if (buttonIndex < actions.length) {
            actions[buttonIndex]();
          }
        }
      );
    } else {
      Alert.alert('Add Media', 'Choose an option', [
        ...actions.map((action, index) => ({
          text: options[index],
          onPress: action,
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  }, [canAddMore, disabled, allowImages, allowVideos]);

  const pickFromCamera = async (mediaType: 'image' | 'video') => {
    try {
      const result = await launchCamera({
        mediaType: mediaType === 'video' ? 'video' : 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        videoQuality: 'high',
        durationLimit: 60, // 60 seconds max for videos
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to capture');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        await uploadAndAddMedia(result.assets, mediaType);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const pickFromLibrary = async (mediaType: 'image' | 'video') => {
    try {
      const remainingSlots = max_items - mediaItems.length;
      
      const result = await launchImageLibrary({
        mediaType: mediaType === 'video' ? 'video' : 'photo',
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        selectionLimit: mediaType === 'video' ? 1 : remainingSlots,
        videoQuality: 'high',
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to select');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        await uploadAndAddMedia(result.assets, mediaType);
      }
    } catch (error) {
      console.error('Library error:', error);
      Alert.alert('Error', 'Failed to open library');
    }
  };

  const uploadAndAddMedia = async (assets: Asset[], mediaType: 'image' | 'video') => {
    setUploading(true);
    setUploadProgress(`Uploading 0/${assets.length}...`);

    try {
      const newItems: MediaItem[] = [];

      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        if (!asset.uri) continue;

        setUploadProgress(`Uploading ${i + 1}/${assets.length}...`);

        const item: MediaItem = {
          uri: asset.uri,
          type: mediaType,
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
          isPrimary: mediaItems.length === 0 && i === 0 && show_primary_selector,
        };

        // Upload to server
        const uploadedItem = await uploadService.uploadSingleMedia(item);
        newItems.push(uploadedItem);
      }

      // Add to existing items
      const updatedItems = [...mediaItems, ...newItems].slice(0, max_items);
      onChange(updatedItems);

      Alert.alert('Success', `${newItems.length} file(s) uploaded`);
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Failed to upload media');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleRemoveItem = (index: number) => {
    Alert.alert(
      'Remove Media',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newItems = mediaItems.filter((_, i) => i !== index);
            // If removed item was primary, make first item primary
            if (show_primary_selector && mediaItems[index].isPrimary && newItems.length > 0) {
              newItems[0].isPrimary = true;
            }
            onChange(newItems);
          },
        },
      ]
    );
  };

  const handleSetPrimary = (index: number) => {
    if (!show_primary_selector) return;
    
    const newItems = mediaItems.map((item, i) => ({
      ...item,
      isPrimary: i === index,
    }));
    onChange(newItems);
  };

  const handleMoveItem = (fromIndex: number, direction: 'up' | 'down') => {
    if (!allow_reorder) return;
    
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= mediaItems.length) return;

    const newItems = [...mediaItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    onChange(newItems);
  };

  const renderMediaItem = (item: MediaItem, index: number) => {
    const isVideo = item.type === 'video';
    const imageUri = item.url || item.uri;

    return (
      <View key={index} style={styles.mediaItem}>
        <TouchableOpacity
          style={styles.mediaImageContainer}
          onPress={() => handleSetPrimary(index)}
          disabled={!show_primary_selector || disabled}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.mediaImage}
            resizeMode="cover"
          />
          
          {isVideo && (
            <View style={styles.videoOverlay}>
              <Icon name="play-circle" size={32} color="#fff" />
              {item.duration && (
                <Text style={styles.videoDuration}>
                  {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
                </Text>
              )}
            </View>
          )}

          {show_primary_selector && item.isPrimary && (
            <View style={styles.primaryBadge}>
              <Icon name="star" size={12} color="#fff" />
              <Text style={styles.primaryText}>Primary</Text>
            </View>
          )}
        </TouchableOpacity>

        {!disabled && (
          <View style={styles.mediaActions}>
            {allow_reorder && index > 0 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleMoveItem(index, 'up')}
              >
                <Icon name="chevron-up" size={16} color="#666" />
              </TouchableOpacity>
            )}
            
            {allow_reorder && index < mediaItems.length - 1 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleMoveItem(index, 'down')}
              >
                <Icon name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => handleRemoveItem(index)}
            >
              <Icon name="close" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}

        {allow_captions && (
          <Text style={styles.caption} numberOfLines={1}>
            {item.caption || `${isVideo ? 'Video' : 'Image'} ${index + 1}`}
          </Text>
        )}
      </View>
    );
  };

  const label = element.label || 'Media Gallery';
  const isRequired = element.is_required;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {isRequired && <Text style={styles.required}> *</Text>}
      </Text>

      {mediaItems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.mediaScroll}
          contentContainerStyle={styles.mediaScrollContent}
        >
          {mediaItems.map((item, index) => renderMediaItem(item, index))}
        </ScrollView>
      )}

      {uploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.uploadingText}>{uploadProgress}</Text>
        </View>
      ) : canAddMore && !disabled ? (
        <TouchableOpacity style={styles.addButton} onPress={handleAddMedia}>
          <Icon name="plus" size={24} color="#007AFF" />
          <Text style={styles.addButtonText}>{upload_text}</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.countText}>
        {mediaItems.length} / {max_items} items
        {min_items > 0 && mediaItems.length < min_items && (
          <Text style={styles.minRequired}> (min {min_items} required)</Text>
        )}
      </Text>

      {mediaItems.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="image-multiple" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>No media added yet</Text>
          <Text style={styles.emptySubtext}>
            {allowImages && allowVideos
              ? 'Tap above to add photos or videos'
              : allowVideos
              ? 'Tap above to add videos'
              : 'Tap above to add photos'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  mediaScroll: {
    marginBottom: 12,
  },
  mediaScrollContent: {
    paddingRight: 16,
  },
  mediaItem: {
    marginRight: 12,
    width: 120,
  },
  mediaImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F2F2F7',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  primaryBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  mediaActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
    gap: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FFE5E5',
  },
  caption: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    paddingVertical: 16,
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
  countText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  minRequired: {
    color: '#FF9500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 4,
  },
});

export default MediaGalleryElement;
