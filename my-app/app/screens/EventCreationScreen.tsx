import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, Switch } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../UserContext';
import CloudinaryUpload from '../components/event/CloudinaryUpload';
import MapScreen from './MapScreen';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCalendar from '../components/reuseableForCreationService/ServiceCalendar';
import tw from 'twrnc';
import { createUpdate } from '../components/event/profile/notification/CreateUpdate';
import { BlurView } from 'expo-blur';
import { createEventNotificationSystem } from '../services/eventNotificationService';


const EventCreationScreen: React.FC = () => {
  const { userId } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
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
    accessType: 'free' | 'paid',
  ticketPrice: '',
ticketQuantity: '',
  });
  const [exceptionDates, setExceptionDates] = useState<Date[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleEventCreationNotification } = createEventNotificationSystem();

  const navigation = useNavigation();
  useEffect(() => {
    fetchCategories();
    console.log('Component mounted');
  }, []);

  useEffect(() => {
    if (eventData.selectedCategory) {
      fetchSubcategories(eventData.selectedCategory);
    }
  }, [eventData.selectedCategory]);

  const fetchCategories = async () => {
    console.log('Fetching categories');
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      console.log('Categories fetched:', data);
      setCategories(data || []);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    console.log('Fetching subcategories for category:', categoryId);
    const { data, error } = await supabase
      .from('subcategory')
      .select('*')
      .eq('category_id', categoryId);
    if (error) {
      console.error('Error fetching subcategories:', error);
    } else {
      console.log('Subcategories fetched:', data);
      setSubcategories(data || []);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    console.log(`Updating ${name} with value:`, value);
    setEventData(prev => {
      const newData = { ...prev, [name]: value };
      console.log('New event data:', newData);
      return newData;
    });
  };

  const handleLocationSelected = (location: { latitude: number; longitude: number }) => {
    console.log('Location selected:', location);
    setEventData(prev => ({ ...prev, location }));
    setShowMap(false);
  };

  const handleCreateEvent = async () => {
    console.log('Creating event with data:', eventData);
    if (!userId) {
      console.error('User not logged in');
      Alert.alert('Error', 'User not logged in');
      return;
    }

    const requiredFields = ['name', 'details', 'eventType', 'selectedSubcategory', 'location', 'imageUrl'];
    const missingFields = requiredFields.filter(field => !eventData[field]);

    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      Alert.alert('Error', `Please fill the following fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Inserting event into database');
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

      const { data: followers, error: followerError } = await supabase
      .from('follower')
      .select('follower_id')
      .eq('following_id', userId);

    if (followerError) throw followerError;


      console.log('Event created:', newEvent);
      const eventId = newEvent.id;

      console.log('Inserting additional event data');
      await Promise.all([
        supabase.from('availability').insert({
          event_id: eventId,
          date: eventData.date.toISOString().split('T')[0],
          start: eventData.startTime.toTimeString().split(' ')[0],
          end: eventData.endTime.toTimeString().split(' ')[0],
          daysofweek: eventData.date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
        }),
        supabase.from('location').insert({
          event_id: eventId,
          longitude: eventData.location.longitude,
          latitude: eventData.location.latitude,
        }),
        supabase.from('media').insert({
          event_id: eventId,
          url: eventData.imageUrl,
          type: 'image',
        }),

        
      
        createUpdate(userId, 'event', eventId)
      ]);
      try {
        console.log('Calling handleEventCreationNotification with:', { eventId, userId });
        const result = await handleEventCreationNotification(eventId, userId);
        console.log('Event creation notification result:', result);
      } catch (error) {
        console.error('Error in handleEventCreationNotification:', error);
      }
      if (eventData.accessType === 'paid') {
      console.log('Creating tickets for paid event');
      const { error: ticketError } = await supabase.from('ticket').insert({
        event_id: eventId,
        price: eventData.ticketPrice,
        quantity: eventData.ticketQuantity,
      });

      if (ticketError) throw ticketError;
    }

    console.log('Event creation completed');
    setIsLoading(false);
    Alert.alert('Success', 'Event created successfully');
    navigation.goBack();
  } catch (error) {
    console.error('Error creating event:', error);
    setIsLoading(false);
    Alert.alert('Error', 'Failed to create event. Please try again.');
  }
};

  const renderStepContent = () => {
    console.log('Rendering step:', currentStep);
    switch (currentStep) {
      case 1:
        return (
          <>
            <Text style={tw`text-2xl font-bold mb-4 text-white`}>Event Details</Text>
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
              value={eventData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Event Name"
            />
            <TextInput
              style={tw`bg-white border border-gray-300 rounded-lg p-3 h-32 mb-4`}
              value={eventData.details}
              onChangeText={(text) => handleInputChange('details', text)}
              placeholder="Event Description"
              multiline
            />
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <Text style={tw`text-lg text-white`}>Private Event</Text>
              <Switch
                value={eventData.privacy}
                onValueChange={(value) => handleInputChange('privacy', value)}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={eventData.privacy ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </>
        );
        case 2:
          return (
            <>
              <Text style={tw`text-2xl font-bold mb-4 text-white`}>Event Type & Category</Text>
              <Picker
                selectedValue={eventData.eventType}
                onValueChange={(value) => handleInputChange('eventType', value)}
                style={tw`bg-white border border-gray-300 rounded-lg mb-4`}
              >
                <Picker.Item label="Select Event Type" value="" />
                <Picker.Item label="Indoor" value="indoor" />
                <Picker.Item label="Outdoor" value="outdoor" />
                <Picker.Item label="Online" value="online" />
              </Picker>
              <Picker
                selectedValue={eventData.selectedCategory}
                onValueChange={(value) => handleInputChange('selectedCategory', value)}
                style={tw`bg-white border border-gray-300 rounded-lg mb-4`}
              >
                <Picker.Item label="Select Category" value="" />
                {categories.map(category => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
              <Picker
                selectedValue={eventData.selectedSubcategory}
                onValueChange={(value) => handleInputChange('selectedSubcategory', value)}
                style={tw`bg-white border border-gray-300 rounded-lg mb-4`}
              >
                <Picker.Item label="Select Subcategory" value="" />
                {subcategories.map(subcategory => (
                  <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
                ))}
              </Picker>
              <Picker
                selectedValue={eventData.accessType}
                onValueChange={(value) => handleInputChange('accessType', value)}
                style={tw`bg-white border border-gray-300 rounded-lg mb-4`}
              >
                <Picker.Item label="Select Access Type" value="" />
                <Picker.Item label="Free Access" value="free" />
                <Picker.Item label="Paid Access" value="paid" />
              </Picker>
              {eventData.accessType === 'paid' && (
                <>
                  <TextInput
                    style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
                    value={eventData.ticketPrice}
                    onChangeText={(text) => handleInputChange('ticketPrice', text)}
                    placeholder="Ticket Price"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={tw`bg-white border border-gray-300 rounded-lg p-3 mb-4`}
                    value={eventData.ticketQuantity}
                    onChangeText={(text) => handleInputChange('ticketQuantity', text)}
                    placeholder="Ticket Quantity"
                    keyboardType="numeric"
                  />
                </>
              )}
            </>
          );
          case 3:
            return (
              <View style={tw`flex-1 w-full`}>
                <Text style={tw`text-2xl font-bold mb-4 text-white`}>Date & Time</Text>
                
                {/* Date Selection */}
                <View style={tw`bg-white rounded-lg mb-6 overflow-hidden`}>
                  <Calendar
                    onDayPress={(day) => {
                      const selectedDate = new Date(day.timestamp);
                      handleInputChange('date', selectedDate);
                    }}
                    markedDates={{
                      [eventData.date.toISOString().split('T')[0]]: {
                        selected: true,
                        selectedColor: '#4F46E5'
                      }
                    }}
                    theme={{
                      backgroundColor: '#ffffff',
                      calendarBackground: '#ffffff',
                      selectedDayBackgroundColor: '#4F46E5',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#4F46E5',
                      dayTextColor: '#2d3748',
                      textDisabledColor: '#a0aec0',
                      arrowColor: '#4F46E5'
                    }}
                    minDate={new Date().toISOString().split('T')[0]}
                  />
                </View>
          
                {/* Time Selection */}
                <View style={tw`flex-row justify-between mb-6`}>
                  {/* Start Time */}
                  <View style={tw`flex-1 mr-2`}>
                    <Text style={tw`text-white mb-2`}>Start Time</Text>
                    <TouchableOpacity
                      style={tw`bg-white p-4 rounded-lg`}
                      onPress={() => setShowStartTimePicker(true)}
                    >
                      <Text style={tw`text-center text-gray-800`}>
                        {eventData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </TouchableOpacity>
                  </View>
          
                  {/* End Time */}
                  <View style={tw`flex-1 ml-2`}>
                    <Text style={tw`text-white mb-2`}>End Time</Text>
                    <TouchableOpacity
                      style={tw`bg-white p-4 rounded-lg`}
                      onPress={() => setShowEndTimePicker(true)}
                    >
                      <Text style={tw`text-center text-gray-800`}>
                        {eventData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
          
                {/* Custom Time Picker Modal - Start Time */}
                <Modal
                  visible={showStartTimePicker}
                  transparent
                  animationType="slide"
                >
                  <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={tw`bg-white rounded-t-3xl p-4`}>
                      <Text style={tw`text-xl font-bold text-center mb-4`}>Select Start Time</Text>
                      <View style={tw`flex-row justify-center items-center h-40`}>
                        <View style={tw`w-20 border-r border-gray-200`}>
                          <ScrollView>
                            {Array.from({ length: 24 }, (_, i) => (
                              <TouchableOpacity
                                key={i}
                                style={tw`p-3 ${i === eventData.startTime.getHours() ? 'bg-blue-500' : ''}`}
                                onPress={() => {
                                  const newTime = new Date(eventData.startTime);
                                  newTime.setHours(i);
                                  handleInputChange('startTime', newTime);
                                }}
                              >
                                <Text style={tw`text-center ${i === eventData.startTime.getHours() ? 'text-white' : 'text-black'}`}>
                                  {i.toString().padStart(2, '0')}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                        <Text style={tw`mx-2 text-xl`}>:</Text>
                        <View style={tw`w-20 border-l border-gray-200`}>
                          <ScrollView>
                            {[0, 15, 30, 45].map((minute) => (
                              <TouchableOpacity
                                key={minute}
                                style={tw`p-3 ${minute === eventData.startTime.getMinutes() ? 'bg-blue-500' : ''}`}
                                onPress={() => {
                                  const newTime = new Date(eventData.startTime);
                                  newTime.setMinutes(minute);
                                  handleInputChange('startTime', newTime);
                                }}
                              >
                                <Text style={tw`text-center ${minute === eventData.startTime.getMinutes() ? 'text-white' : 'text-black'}`}>
                                  {minute.toString().padStart(2, '0')}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                      <View style={tw`flex-row justify-end mt-4`}>
                        <TouchableOpacity
                          style={tw`bg-gray-200 p-3 rounded-xl mr-2 flex-1`}
                          onPress={() => setShowStartTimePicker(false)}
                        >
                          <Text style={tw`text-center font-semibold`}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={tw`bg-blue-500 p-3 rounded-xl flex-1`}
                          onPress={() => setShowStartTimePicker(false)}
                        >
                          <Text style={tw`text-white text-center font-semibold`}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
          
                {/* Custom Time Picker Modal - End Time */}
                <Modal
                  visible={showEndTimePicker}
                  transparent
                  animationType="slide"
                >
                  <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={tw`bg-white rounded-t-3xl p-4`}>
                      <Text style={tw`text-xl font-bold text-center mb-4`}>Select End Time</Text>
                      <View style={tw`flex-row justify-center items-center h-40`}>
                        <View style={tw`w-20 border-r border-gray-200`}>
                          <ScrollView>
                            {Array.from({ length: 24 }, (_, i) => (
                              <TouchableOpacity
                                key={i}
                                style={tw`p-3 ${i === eventData.endTime.getHours() ? 'bg-blue-500' : ''}`}
                                onPress={() => {
                                  const newTime = new Date(eventData.endTime);
                                  newTime.setHours(i);
                                  handleInputChange('endTime', newTime);
                                }}
                              >
                                <Text style={tw`text-center ${i === eventData.endTime.getHours() ? 'text-white' : 'text-black'}`}>
                                  {i.toString().padStart(2, '0')}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                        <Text style={tw`mx-2 text-xl`}>:</Text>
                        <View style={tw`w-20 border-l border-gray-200`}>
                          <ScrollView>
                            {[0, 15, 30, 45].map((minute) => (
                              <TouchableOpacity
                                key={minute}
                                style={tw`p-3 ${minute === eventData.endTime.getMinutes() ? 'bg-blue-500' : ''}`}
                                onPress={() => {
                                  const newTime = new Date(eventData.endTime);
                                  newTime.setMinutes(minute);
                                  handleInputChange('endTime', newTime);
                                }}
                              >
                                <Text style={tw`text-center ${minute === eventData.endTime.getMinutes() ? 'text-white' : 'text-black'}`}>
                                  {minute.toString().padStart(2, '0')}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                      <View style={tw`flex-row justify-end mt-4`}>
                        <TouchableOpacity
                          style={tw`bg-gray-200 p-3 rounded-xl mr-2 flex-1`}
                          onPress={() => setShowEndTimePicker(false)}
                        >
                          <Text style={tw`text-center font-semibold`}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={tw`bg-blue-500 p-3 rounded-xl flex-1`}
                          onPress={() => setShowEndTimePicker(false)}
                        >
                          <Text style={tw`text-white text-center font-semibold`}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            );
      case 4:
        return (
          <>
            <Text style={tw`text-2xl font-bold mb-4 text-white`}>Location</Text>
            <TouchableOpacity
              style={tw`bg-blue-500 p-3 rounded-lg items-center mb-4`}
              onPress={() => setShowMap(true)}
            >
              <Text style={tw`text-white font-semibold`}>
                {eventData.location ? 'Change Location' : 'Select Location'}
              </Text>
            </TouchableOpacity>
            {eventData.location && (
              <Text style={tw`text-white mb-4`}>
                Latitude: {eventData.location.latitude.toFixed(6)}, Longitude: {eventData.location.longitude.toFixed(6)}
              </Text>
            )}
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
          </>
        );
      case 5:
        return (
          <>
            <Text style={tw`text-2xl font-bold mb-4 text-white`}>Upload Image</Text>
            <CloudinaryUpload onImagesUploaded={(urls) => {
  if (urls.length > 0) {
    console.log('Image uploaded to Cloudinary:', urls[0]);
    handleInputChange('imageUrl', urls[0]);
  }
}} />
{eventData.imageUrl ? (
  <Text style={tw`text-white mt-2`}>Image uploaded successfully: {eventData.imageUrl}</Text>
) : (
  <Text style={tw`text-white mt-2`}>No image uploaded yet</Text>
)}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <BlurView intensity={100} style={tw`rounded-lg p-4`}>
          <Text style={tw`text-3xl font-bold mb-6 text-center text-white`}>Create New Event</Text>
          {renderStepContent()}
          <View style={tw`flex-row justify-between mt-4`}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={tw`bg-gray-500 py-2 px-4 rounded-full`}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={tw`text-white font-bold`}>Previous</Text>
              </TouchableOpacity>
            )}
            {currentStep < 5 ? (
              <TouchableOpacity
                style={tw`bg-blue-500 py-2 px-4 rounded-full ml-auto`}
                onPress={() => setCurrentStep(currentStep + 1)}
              >
                <Text style={tw`text-white font-bold`}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={tw`bg-green-500 py-2 px-4 rounded-full ml-auto`}
                onPress={handleCreateEvent}
              >
                <Text style={tw`text-white font-bold`}>Create Event</Text>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </ScrollView>
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-lg items-center`}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={tw`text-lg font-bold mt-4 text-gray-800`}>Creating Event...</Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default EventCreationScreen;
