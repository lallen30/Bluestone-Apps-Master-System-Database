import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../api/client';
import { API_CONFIG } from '../../api/config';

interface ReportContentElementProps {
  contentType: 'listing' | 'review' | 'user' | 'message';
  contentId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam', icon: 'email-alert' },
  { value: 'inappropriate', label: 'Inappropriate Content', icon: 'alert-circle' },
  { value: 'misleading', label: 'Misleading Information', icon: 'information-off' },
  { value: 'harassment', label: 'Harassment', icon: 'account-alert' },
  { value: 'fraud', label: 'Fraud or Scam', icon: 'shield-alert' },
  { value: 'other', label: 'Other', icon: 'dots-horizontal' },
];

const ReportContentElement: React.FC<ReportContentElementProps> = ({
  contentType,
  contentId,
  onClose,
  onSuccess,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post(`/apps/${API_CONFIG.APP_ID}/reports`, {
        content_type: contentType,
        content_id: contentId,
        reason: selectedReason,
        description: description.trim() || null,
      });

      Alert.alert(
        'Report Submitted',
        'Thank you for helping keep our community safe. We will review your report.',
        [{ text: 'OK', onPress: () => {
          onSuccess?.();
          onClose();
        }}]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'listing': return 'listing';
      case 'review': return 'review';
      case 'user': return 'user';
      case 'message': return 'message';
      default: return 'content';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.title}>Report {getContentTypeLabel()}</Text>
        <View style={styles.placeholder} />
      </View>

      <Text style={styles.subtitle}>
        Why are you reporting this {getContentTypeLabel()}?
      </Text>

      <View style={styles.reasonsList}>
        {REPORT_REASONS.map((reason) => (
          <TouchableOpacity
            key={reason.value}
            style={[
              styles.reasonItem,
              selectedReason === reason.value && styles.reasonItemSelected,
            ]}
            onPress={() => setSelectedReason(reason.value)}
          >
            <Icon
              name={reason.icon}
              size={24}
              color={selectedReason === reason.value ? '#007AFF' : '#8E8E93'}
            />
            <Text style={[
              styles.reasonLabel,
              selectedReason === reason.value && styles.reasonLabelSelected,
            ]}>
              {reason.label}
            </Text>
            {selectedReason === reason.value && (
              <Icon name="check" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.inputLabel}>Additional details (optional)</Text>
      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={setDescription}
        placeholder="Provide more context about your report..."
        placeholderTextColor="#8E8E93"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.submitButton, (!selectedReason || submitting) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!selectedReason || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        False reports may result in action being taken against your account.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  placeholder: {
    width: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    padding: 16,
    paddingBottom: 8,
  },
  reasonsList: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  reasonItemSelected: {
    backgroundColor: '#F0F8FF',
  },
  reasonLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  reasonLabelSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    color: '#1C1C1E',
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 32,
  },
});

export default ReportContentElement;
