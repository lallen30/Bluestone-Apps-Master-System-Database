import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { listingsService } from '../../api/listingsService';
import { useAuth } from '../../context/AuthContext';

interface ScreenElement {
  id: number;
  element_type: string;
  config?: any;
  default_config?: any;
}

interface PropertyFormElementProps {
  element: ScreenElement;
  navigation: any;
  route: any;
}

const PropertyFormElement: React.FC<PropertyFormElementProps> = ({ element, navigation, route }) => {
  const { user } = useAuth();
  
  // Extract config
  const config = element.config || element.default_config || {};
  const {
    mode = 'create', // 'create' or 'edit'
    success_navigation = 'MyListings',
    enable_draft = true,
  } = config;

  // Get listing ID if editing
  const listingId = route.params?.listingId;
  const isEditMode = mode === 'edit' && listingId;

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('apartment');
  const [pricePerNight, setPricePerNight] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [guestsMax, setGuestsMax] = useState('2');
  const [minNights, setMinNights] = useState('1');
  const [maxNights, setMaxNights] = useState('365');

  useEffect(() => {
    if (isEditMode) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsService.getListingById(listingId);
      const listing = response.data;
      
      // Populate form fields
      setTitle(listing.title || '');
      setDescription(listing.description || '');
      setPropertyType(listing.property_type || 'apartment');
      setPricePerNight(listing.price_per_night?.toString() || '');
      setCleaningFee(listing.cleaning_fee?.toString() || '');
      setAddress(listing.address || '');
      setCity(listing.city || '');
      setState(listing.state || '');
      setCountry(listing.country || '');
      setZipCode(listing.zip_code || '');
      setBedrooms(listing.bedrooms?.toString() || '1');
      setBathrooms(listing.bathrooms?.toString() || '1');
      setGuestsMax(listing.guests_max?.toString() || '2');
      setMinNights(listing.min_nights?.toString() || '1');
      setMaxNights(listing.max_nights?.toString() || '365');
    } catch (error) {
      console.error('Error fetching listing:', error);
      Alert.alert('Error', 'Unable to load property details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a property title');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }

    const price = parseFloat(pricePerNight);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price per night');
      return false;
    }

    if (!address.trim() || !city.trim() || !country.trim()) {
      Alert.alert('Error', 'Please enter complete address information');
      return false;
    }

    const bedroomsNum = parseInt(bedrooms);
    const bathroomsNum = parseInt(bathrooms);
    const guestsNum = parseInt(guestsMax);

    if (isNaN(bedroomsNum) || bedroomsNum < 0) {
      Alert.alert('Error', 'Please enter a valid number of bedrooms');
      return false;
    }

    if (isNaN(bathroomsNum) || bathroomsNum < 0) {
      Alert.alert('Error', 'Please enter a valid number of bathrooms');
      return false;
    }

    if (isNaN(guestsNum) || guestsNum < 1) {
      Alert.alert('Error', 'Please enter a valid maximum number of guests');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const listingData = {
        title: title.trim(),
        description: description.trim(),
        property_type: propertyType,
        price_per_night: parseFloat(pricePerNight),
        cleaning_fee: cleaningFee ? parseFloat(cleaningFee) : 0,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        zip_code: zipCode.trim(),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        guests_max: parseInt(guestsMax),
        min_nights: parseInt(minNights),
        max_nights: parseInt(maxNights),
        status: 'draft', // Start as draft
      };

      if (isEditMode) {
        await listingsService.updateListing(listingId, listingData);
        Alert.alert('Success', 'Property updated successfully!', [
          { text: 'OK', onPress: () => navigation.navigate(success_navigation) }
        ]);
      } else {
        const response = await listingsService.createListing(listingData);
        Alert.alert('Success', 'Property created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate(success_navigation) }
        ]);
      }
    } catch (error: any) {
      console.error('Error saving listing:', error);
      Alert.alert('Error', error.response?.data?.message || 'Unable to save property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading property...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Text style={styles.label}>Property Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., Cozy Downtown Apartment"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your property..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Property Type *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={propertyType}
            onValueChange={setPropertyType}
            style={styles.picker}
          >
            <Picker.Item label="Apartment" value="apartment" />
            <Picker.Item label="House" value="house" />
            <Picker.Item label="Condo" value="condo" />
            <Picker.Item label="Villa" value="villa" />
            <Picker.Item label="Studio" value="studio" />
            <Picker.Item label="Loft" value="loft" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pricing</Text>
        
        <Text style={styles.label}>Price per Night ($) *</Text>
        <TextInput
          style={styles.input}
          value={pricePerNight}
          onChangeText={setPricePerNight}
          placeholder="0.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Cleaning Fee ($)</Text>
        <TextInput
          style={styles.input}
          value={cleaningFee}
          onChangeText={setCleaningFee}
          placeholder="0.00"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        
        <Text style={styles.label}>Street Address *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="123 Main St"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="New York"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>State/Province</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="NY"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Country *</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
          placeholder="United States"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Zip/Postal Code</Text>
        <TextInput
          style={styles.input}
          value={zipCode}
          onChangeText={setZipCode}
          placeholder="10001"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        
        <Text style={styles.label}>Bedrooms *</Text>
        <TextInput
          style={styles.input}
          value={bedrooms}
          onChangeText={setBedrooms}
          placeholder="1"
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Bathrooms *</Text>
        <TextInput
          style={styles.input}
          value={bathrooms}
          onChangeText={setBathrooms}
          placeholder="1"
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Maximum Guests *</Text>
        <TextInput
          style={styles.input}
          value={guestsMax}
          onChangeText={setGuestsMax}
          placeholder="2"
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Rules</Text>
        
        <Text style={styles.label}>Minimum Nights</Text>
        <TextInput
          style={styles.input}
          value={minNights}
          onChangeText={setMinNights}
          placeholder="1"
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Maximum Nights</Text>
        <TextInput
          style={styles.input}
          value={maxNights}
          onChangeText={setMaxNights}
          placeholder="365"
          placeholderTextColor="#999"
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEditMode ? 'Update Property' : 'Create Property'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default PropertyFormElement;
