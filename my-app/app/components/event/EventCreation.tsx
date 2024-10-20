import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import CloudinaryUpload from './CloudinaryUpload';
import MapScreen from '../../screens/MapScreen';

const EventCreation: React.FC = () => {
  const { userId } = useUser();
  const [eventData, setEventData] = useState({
    name: '',
    details: '',
    eventType: '',
    privacy: false,
    selectedCategory: '',
    selectedSubcategory: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    imageUrl: '',
    location: null as { latitude: number; longitude: number } | null,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState({ date: false, startTime: false, endTime: false });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (eventData.selectedCategory) {
      fetchSubcategories(eventData.selectedCategory);
    }
  }, [eventData.selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    const { data, error } = await supabase
      .from('subcategory')
      .select('*')
      .eq('category_id', categoryId);
    if (error) {
      console.error('Error fetching subcategories:', error);
    } else {
      setSubcategories(data || []);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelected = (location: { latitude: number; longitude: number }) => {
    setEventData(prev => ({ ...prev, location }));
    setShowMap(false);
  };

  const handleCreateEvent = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    if (!eventData.name || !eventData.details || !eventData.eventType || !eventData.selectedSubcategory) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (!eventData.imageUrl) {
      Alert.alert('Error', 'Please select an image for the event.');
      return;
    }

    if (!eventData.location) {
      Alert.alert('Error', 'Please select a location for the event.');
      return;
    }

    try {
      const { data: newEvent, error: eventError } = await supabase
        .from('event')
        .insert({
          name: eventData.name,
          details: eventData.details,
          type: eventData.eventType,
          privacy: eventData.privacy,
          subcategory_id: eventData.selectedSubcategory,
          user_id: userId,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      const eventId = newEvent.id;

      // Insert availability
      await supabase.from('availability').insert({
        event_id: eventId,
        date: eventData.date.toISOString().split('T')[0],
        start: eventData.startTime.toTimeString().split(' ')[0],
        end: eventData.endTime.toTimeString().split(' ')[0],
        daysofweek: eventData.date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
      });

      // Insert location
      await supabase.from('location').insert({
        event_id: eventId,
        longitude: eventData.location.longitude,
        latitude: eventData.location.latitude,
      });

      // Insert media
      await supabase.from('media').insert({
        event_id: eventId,
        url: eventData.imageUrl,
        type: 'image',
      });

      Alert.alert('Success', 'Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const renderInputField = (label: string, value: string, onChangeText: (text: string) => void, multiline: boolean = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label.toLowerCase()}`}
        multiline={multiline}
      />
    </View>
  );

  const renderButtonGroup = (label: string, options: { value: any; label: string }[], selectedValue: any, onSelect: (value: any) => void) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonGroup}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              eventData[selectedValue as keyof typeof eventData] === option.value && styles.selectedButton
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.buttonText,
              eventData[selectedValue as keyof typeof eventData] === option.value && styles.selectedButtonText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDateTimePicker = (label: string, value: Date, onChange: (date: Date) => void, mode: 'date' | 'time') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker({ ...showPicker, [mode]: true })}
      >
        <Text style={styles.dateButtonText}>
          {mode === 'date' ? value.toDateString() : value.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>
      {showPicker[mode as keyof typeof showPicker] && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker({ ...showPicker, [mode]: false });
            if (selectedDate) onChange(selectedDate);
          }}
        />
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      <CloudinaryUpload onImageUploaded={(url) => handleInputChange('imageUrl', url)} />

      {renderInputField('Event Name', eventData.name, (text) => handleInputChange('name', text))}
      {renderInputField('Event Description', eventData.details, (text) => handleInputChange('details', text), true)}

      {renderButtonGroup('Event Type', [
        { value: 'indoor', label: 'Indoor' },
        { value: 'outdoor', label: 'Outdoor' },
        { value: 'online', label: 'Online' },
      ], 'eventType', (value) => handleInputChange('eventType', value))}

      {renderButtonGroup('Privacy', [
        { value: false, label: 'Public' },
        { value: true, label: 'Private' },
      ], 'privacy', (value) => handleInputChange('privacy', value))}

      {renderButtonGroup('Category', categories.map(cat => ({ value: cat.id, label: cat.name })), 'selectedCategory', (value) => handleInputChange('selectedCategory', value))}
      {renderButtonGroup('Subcategory', subcategories.map(subcat => ({ value: subcat.id, label: subcat.name })), 'selectedSubcategory', (value) => handleInputChange('selectedSubcategory', value))}

      {renderDateTimePicker('Date', eventData.date, (date) => handleInputChange('date', date), 'date')}
      {renderDateTimePicker('Start Time', eventData.startTime, (time) => handleInputChange('startTime', time), 'time')}
      {renderDateTimePicker('End Time', eventData.endTime, (time) => handleInputChange('endTime', time), 'time')}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TouchableOpacity style={styles.locationButton} onPress={() => setShowMap(true)}>
          <Text style={styles.locationButtonText}>
            {eventData.location ? 'Change Location' : 'Select Location'}
          </Text>
        </TouchableOpacity>
        {eventData.location && (
          <Text style={styles.locationText}>
            Latitude: {eventData.location.latitude.toFixed(6)}, Longitude: {eventData.location.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {showMap && (
        <View style={styles.mapContainer}>
          <MapScreen onLocationSelected={handleLocationSelected} />
          <TouchableOpacity style={styles.closeMapButton} onPress={() => setShowMap(false)}>
            <Text style={styles.closeMapButtonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
  },
  dateButton: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dateButtonText: {
    color: '#333',
  },
  locationButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  locationText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  mapContainer: {
    height: 300,
    marginBottom: 15,
  },
  closeMapButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeMapButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EventCreation;