import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../services/supabaseClient';
import { useUser } from '../../UserContext';
import CloudinaryUpload from './CloudinaryUpload';
import MapScreen from '../../screens/MapScreen';
import tw from 'twrnc';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

    setIsLoading(true);
    let uploadTimeout = setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Error', 'Image upload timed out. Please try again.');
    }, 20000);

    try {
      // Start Cloudinary upload
      const imageUrl = await uploadImage();
      clearTimeout(uploadTimeout);

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
        url: imageUrl,
        type: 'image',
      });

      setIsLoading(false);
      Alert.alert('Success', 'Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const uploadImage = () => {
    return new Promise<string>((resolve, reject) => {
      // Simulating Cloudinary upload with a delay
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve(eventData.imageUrl);
        }
      }, 500);
    });
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-100 p-4`}>
      <Text style={tw`text-3xl font-bold mb-6 text-center text-gray-800`}>Create New Event</Text>

      <CloudinaryUpload onImageUploaded={(url) => handleInputChange('imageUrl', url)} />

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Event Name</Text>
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg p-3 text-base`}
          value={eventData.name}
          onChangeText={(text) => handleInputChange('name', text)}
          placeholder="Enter event name"
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Event Description</Text>
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg p-3 text-base h-32`}
          value={eventData.details}
          onChangeText={(text) => handleInputChange('details', text)}
          placeholder="Enter event description"
          multiline
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Event Type</Text>
        <Picker
          selectedValue={eventData.eventType}
          onValueChange={(value) => handleInputChange('eventType', value)}
          style={tw`bg-white border border-gray-300 rounded-lg`}
        >
          <Picker.Item label="Select Event Type" value="" />
          <Picker.Item label="Indoor" value="indoor" />
          <Picker.Item label="Outdoor" value="outdoor" />
          <Picker.Item label="Online" value="online" />
        </Picker>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Privacy</Text>
        <Picker
          selectedValue={eventData.privacy}
          onValueChange={(value) => handleInputChange('privacy', value)}
          style={tw`bg-white border border-gray-300 rounded-lg`}
        >
          <Picker.Item label="Public" value={false} />
          <Picker.Item label="Private" value={true} />
        </Picker>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Category</Text>
        <Picker
          selectedValue={eventData.selectedCategory}
          onValueChange={(value) => handleInputChange('selectedCategory', value)}
          style={tw`bg-white border border-gray-300 rounded-lg`}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Subcategory</Text>
        <Picker
          selectedValue={eventData.selectedSubcategory}
          onValueChange={(value) => handleInputChange('selectedSubcategory', value)}
          style={tw`bg-white border border-gray-300 rounded-lg`}
        >
          <Picker.Item label="Select Subcategory" value="" />
          {subcategories.map(subcat => (
            <Picker.Item key={subcat.id} label={subcat.name} value={subcat.id} />
          ))}
        </Picker>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Date</Text>
        <TouchableOpacity
          style={tw`bg-white border border-gray-300 rounded-lg p-3`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{eventData.date.toDateString()}</Text>
        </TouchableOpacity>
        <Calendar
          style={tw`mt-2`}
          onDayPress={(day: any) => {
            handleInputChange('date', new Date(day.timestamp));
            setShowDatePicker(false);
          }}
          markedDates={{
            [eventData.date.toISOString().split('T')[0]]: { selected: true, selectedColor: '#007AFF' },
          }}
          visible={showDatePicker}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Start Time</Text>
        <TouchableOpacity
          style={tw`bg-white border border-gray-300 rounded-lg p-3`}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text>{eventData.startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showStartTimePicker}
          mode="time"
          onConfirm={(time) => {
            handleInputChange('startTime', time);
            setShowStartTimePicker(false);
          }}
          onCancel={() => setShowStartTimePicker(false)}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>End Time</Text>
        <TouchableOpacity
          style={tw`bg-white border border-gray-300 rounded-lg p-3`}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text>{eventData.endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={showEndTimePicker}
          mode="time"
          onConfirm={(time) => {
            handleInputChange('endTime', time);
            setShowEndTimePicker(false);
          }}
          onCancel={() => setShowEndTimePicker(false)}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2 text-gray-700`}>Location</Text>
        <TouchableOpacity
          style={tw`bg-blue-500 p-3 rounded-lg items-center`}
          onPress={() => setShowMap(true)}
        >
          <Text style={tw`text-white font-semibold`}>
            {eventData.location ? 'Change Location' : 'Select Location'}
          </Text>
        </TouchableOpacity>
        {eventData.location && (
          <Text style={tw`mt-2 text-gray-600`}>
            Latitude: {eventData.location.latitude.toFixed(6)}, Longitude: {eventData.location.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {showMap && (
        <View style={tw`w-full aspect-square mb-4 rounded-lg overflow-hidden`}>
          <MapScreen onLocationSelected={handleLocationSelected} />
          <TouchableOpacity
            style={tw`absolute bottom-4 left-4 right-4 bg-red-500 p-3 rounded-lg items-center`}
            onPress={() => setShowMap(false)}
          >
            <Text style={tw`text-white font-semibold`}>Close Map</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={tw`bg-green-500 p-4 rounded-lg items-center mb-8`}
        onPress={handleCreateEvent}
      >
        <Text style={tw`text-white font-bold text-lg`}>Create Event</Text>
      </TouchableOpacity>

      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-lg items-center`}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={tw`text-lg font-bold mt-4 text-gray-800`}>Creating Event...</Text>
            <Text style={tw`text-sm mt-2 text-gray-600`}>Uploading Image: {uploadProgress}%</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EventCreation;