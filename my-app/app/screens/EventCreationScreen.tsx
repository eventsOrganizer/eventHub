import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, Switch } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import CloudinaryUpload from '../components/event/CloudinaryUpload';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

const EventCreation: React.FC = () => {
  const { userId } = useUser();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    name: '',
    details: '',
    eventType: '',
    selectedCategory: '',
    selectedSubcategory: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    location: null as { latitude: number; longitude: number } | null,
    isPrivate: false,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);

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

  const handleCreateEvent = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in. Please log in to create an event.');
      return;
    }

    if (!eventData.name || !eventData.details || !eventData.selectedSubcategory) {
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

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            name: eventData.name,
            details: eventData.details,
            event_type: eventData.eventType,
            category_id: eventData.selectedCategory,
            subcategory_id: eventData.selectedSubcategory,
            start_date: eventData.startDate,
            end_date: eventData.endDate,
            image_url: eventData.imageUrl,
            location: eventData.location,
            is_private: eventData.isPrivate,
            user_id: userId,
          },
        ]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Event created successfully!');
      setEventData({
        name: '',
        details: '',
        eventType: '',
        selectedCategory: '',
        selectedSubcategory: '',
        startDate: '',
        endDate: '',
        imageUrl: '',
        location: null,
        isPrivate: false,
      });
      setCurrentStep(1);
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating event:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CloudinaryUpload onImageUploaded={(url) => handleInputChange('imageUrl', url)} />
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
              value={eventData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter event name"
            />
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-3 h-32 mb-4`}
              value={eventData.details}
              onChangeText={(text) => handleInputChange('details', text)}
              placeholder="Enter event description"
              multiline
            />
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-lg text-white`}>Private Event</Text>
              <Switch
                value={eventData.isPrivate}
                onValueChange={(value) => handleInputChange('isPrivate', value)}
                trackColor={{ false: "#767577", true: "#007AFF" }}
                thumbColor={eventData.isPrivate ? "#007AFF" : "#f4f3f4"}
              />
            </View>
            <TouchableOpacity
              style={tw`bg-[#4CD964] py-4 px-6 rounded-full items-center mb-4`}
              onPress={() => setCurrentStep(2)}
            >
              <Text style={tw`text-white font-bold text-lg`}>Next</Text>
            </TouchableOpacity>
          </>
        );
      case 2:
        return (
          <>
            <Picker
              selectedValue={eventData.eventType}
              onValueChange={(value) => handleInputChange('eventType', value)}
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
            >
              <Picker.Item label="Select Event Type" value="" />
              <Picker.Item label="Indoor" value="indoor" />
              <Picker.Item label="Outdoor" value="outdoor" />
              <Picker.Item label="Online" value="online" />
            </Picker>
            <Picker
              selectedValue={eventData.selectedCategory}
              onValueChange={(value) => handleInputChange('selectedCategory', value)}
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map(category => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
            <Picker
              selectedValue={eventData.selectedSubcategory}
              onValueChange={(value) => handleInputChange('selectedSubcategory', value)}
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
            >
              <Picker.Item label="Select Subcategory" value="" />
              {subcategories.map(subcategory => (
                <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
              ))}
            </Picker>
            <TouchableOpacity
              style={tw`bg-[#4CD964] py-4 px-6 rounded-full items-center mb-4`}
              onPress={() => setCurrentStep(3)}
            >
              <Text style={tw`text-white font-bold text-lg`}>Next</Text>
            </TouchableOpacity>
          </>
        );
      case 3:
        return (
          <>
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
              value={eventData.startDate}
              onChangeText={(text) => handleInputChange('startDate', text)}
              placeholder="Start Date (YYYY-MM-DD)"
              onFocus={() => setShowStartDateCalendar(true)}
            />
            {showStartDateCalendar && (
              <Calendar
                onDayPress={(day: any) => {
                  handleInputChange('startDate', day.dateString);
                  setShowStartDateCalendar(false);
                }}
                markedDates={{
                  [eventData.startDate]: { selected: true, selectedColor: '#007AFF' },
                }}
                style={tw`mb-4`}
              />
            )}
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
              value={eventData.endDate}
              onChangeText={(text) => handleInputChange('endDate', text)}
              placeholder="End Date (YYYY-MM-DD)"
              onFocus={() => setShowEndDateCalendar(true)}
            />
            {showEndDateCalendar && (
              <Calendar
                onDayPress={(day: any) => {
                  handleInputChange('endDate', day.dateString);
                  setShowEndDateCalendar(false);
                }}
                markedDates={{
                  [eventData.endDate]: { selected: true, selectedColor: '#FF9500' },
                }}
                style={tw`mb-4`}
              />
            )}
                   <TouchableOpacity
              style={tw`bg-blue-500 py-4 px-6 rounded-full items-center mb-4`}
              onPress={() => navigation.navigate('MapScreen', {
                onSelectLocation: (location: { latitude: number; longitude: number }) => {
                  handleInputChange('location', location);
                },
              })} // Ensure this function is correctly passed
            >
          <Text style={tw`text-white font-bold text-lg`}>Select Location</Text>
          </TouchableOpacity>
            {eventData.location && (
              <Text style={tw`text-white text-lg mb-4`}>
                Location: {eventData.location.latitude}, {eventData.location.longitude}
              </Text>
            )}
            <TouchableOpacity
              style={tw`bg-[#4CD964] py-4 px-6 rounded-full items-center`}
              onPress={handleCreateEvent}
            >
              <Text style={tw`text-white font-bold text-lg`}>Create Event</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#000428', '#004e92']} style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <BlurView intensity={100} style={tw`rounded-lg p-4`}>
          {renderStepContent()}
          {isLoading && <ActivityIndicator size="large" color="#007AFF" />}
        </BlurView>
      </ScrollView>
    </LinearGradient>
  );
};

export default EventCreation;
