import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Switch,
  RefreshControl,
} from 'react-native';
import { screensService, ScreenContent, ScreenElement } from '../api/screensService';

const DynamicScreen = ({ route, navigation }: any) => {
  const { screenId, screenName } = route.params;
  const [content, setContent] = useState<ScreenContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: screenName });
    fetchScreenContent();
  }, [screenId]);

  const fetchScreenContent = async () => {
    try {
      const screenContent = await screensService.getScreenContent(screenId);
      setContent(screenContent);
      
      // Initialize form data with existing data or defaults
      if (screenContent.data) {
        setFormData(screenContent.data);
      } else {
        // Initialize with empty values
        const initialData: { [key: string]: any } = {};
        screenContent.elements.forEach((element) => {
          initialData[element.field_name] = '';
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error fetching screen content:', error);
      Alert.alert('Error', 'Failed to load screen content');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchScreenContent();
  };

  const handleSave = async () => {
    if (!content) return;

    // Validate required fields
    const missingFields = content.elements
      .filter((el) => el.is_required && !formData[el.field_name])
      .map((el) => el.label);

    if (missingFields.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in: ${missingFields.join(', ')}`
      );
      return;
    }

    setSaving(true);
    try {
      await screensService.saveScreenContent(screenId, formData);
      Alert.alert('Success', 'Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const renderElement = (element: ScreenElement) => {
    const value = formData[element.field_name] || '';

    const updateValue = (newValue: any) => {
      setFormData({ ...formData, [element.field_name]: newValue });
    };

    switch (element.element_type) {
      case 'text_input':
      case 'email':
      case 'phone':
        return (
          <View key={element.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {element.label}
              {element.is_required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
              keyboardType={
                element.element_type === 'email'
                  ? 'email-address'
                  : element.element_type === 'phone'
                  ? 'phone-pad'
                  : 'default'
              }
            />
          </View>
        );

      case 'textarea':
        return (
          <View key={element.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {element.label}
              {element.is_required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder || `Enter ${element.label.toLowerCase()}`}
              multiline
              numberOfLines={4}
            />
          </View>
        );

      case 'number':
        return (
          <View key={element.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {element.label}
              {element.is_required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={value.toString()}
              onChangeText={(text) => updateValue(parseFloat(text) || 0)}
              placeholder={element.placeholder || '0'}
              keyboardType="numeric"
            />
          </View>
        );

      case 'switch':
      case 'checkbox':
        return (
          <View key={element.id} style={styles.switchContainer}>
            <Text style={styles.label}>{element.label}</Text>
            <Switch
              value={!!value}
              onValueChange={updateValue}
              trackColor={{ false: '#D1D1D6', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
        );

      case 'heading':
        return (
          <View key={element.id} style={styles.headingContainer}>
            <Text style={styles.heading}>{element.label}</Text>
          </View>
        );

      case 'text':
      case 'paragraph':
        return (
          <View key={element.id} style={styles.textContainer}>
            <Text style={styles.text}>{element.label}</Text>
          </View>
        );

      case 'divider':
        return <View key={element.id} style={styles.divider} />;

      default:
        return (
          <View key={element.id} style={styles.fieldContainer}>
            <Text style={styles.label}>{element.label}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={updateValue}
              placeholder={element.placeholder}
            />
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!content) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load screen content</Text>
      </View>
    );
  }

  const hasFormElements = content.elements.some((el) =>
    ['text_input', 'email', 'phone', 'textarea', 'number', 'switch', 'checkbox'].includes(el.element_type)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
      >
        {content.screen.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{content.screen.description}</Text>
          </View>
        )}

        {content.elements
          .sort((a, b) => a.display_order - b.display_order)
          .map((element) => renderElement(element))}

        {hasFormElements && (
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: 16,
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  fieldContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000000',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  headingContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  textContainer: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default DynamicScreen;
