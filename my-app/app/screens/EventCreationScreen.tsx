import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { supabase } from '../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCalendar from '../components/reuseableForCreationService/ServiceCalendar';
import tw from 'twrnc';
import NextButton from '../components/MaterialService/NextButton';
import Card from '../components/event/card';
import { Icon } from 'react-native-elements';

const EventCreation: React.FC = ({ navigation, route }) => {
  const selectedServices = route.params?.selectedServices || [];
  const { userId } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    name: '',
    details: '',
    eventType: '',
    selectedCategory: '',
    selectedSubcategory: '',
    startDate: '',
    endDate: '',
    imageUrls: [] as string[],
    location: '',
    isPrivate: false,
  });
  const [exceptionDates, setExceptionDates] = useState<Date[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showServiceMessage, setShowServiceMessage] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (eventData.selectedCategory) {
      fetchSubcategories(eventData.selectedCategory);
    }
  }, [eventData.selectedCategory]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*').eq('type', 'event');
    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    const { data, error } = await supabase.from('subcategory').select('*').eq('category_id', categoryId);
    if (error) {
      console.error('Error fetching subcategories:', error);
    } else {
      setSubcategories(data || []);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setEventData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, result.assets[0].uri] }));
    }
  };

  const handleCreateEvent = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in. Please log in to create an event.');
      return;
    }

    if (!eventData.name || !eventData.details || !eventData.selectedSubcategory || !eventData.startDate || !eventData.endDate) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    if (eventData.imageUrls.length === 0) {
      Alert.alert('Error', 'Please select at least one image for the event.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          name: eventData.name,
          details: eventData.details,
          event_type: eventData.eventType,
          category_id: eventData.selectedCategory,
          subcategory_id: eventData.selectedSubcategory,
          start_date: eventData.startDate,
          end_date: eventData.endDate,
          image_urls: eventData.imageUrls,
          location: eventData.location,
          is_private: eventData.isPrivate,
          user_id: userId,
        }]);

      if (error) throw error;
      setShowServiceMessage(true);
      Alert.alert('Success', 'Event created successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelection = (date: Date) => {
    setExceptionDates(prev => [...prev, date]);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'conference':
        return 'business-center';
      case 'music':
        return 'music-note';
      case 'art':
        return 'palette';
      case 'food':
        return 'restaurant';
      default:
        return 'category'; // Default icon
    }
  };

  const getSubcategoryIcon = (subcategoryName: string) => {
    switch (subcategoryName.toLowerCase()) {
      case 'presentation':
        return 'presentation';
      case 'concert':
        return 'headset';
      case 'painting':
        return 'brush';
      default:
        return 'subcategory'; // Default icon
    }
  };

  const renderOnboardingStep = () => (
    <>
      <Text style={tw`text-white text-lg mb-4`}>
        Welcome to the event creation process! In this process, you will select an image, enter event details, and finalize your event.
      </Text>
      <NextButton onPress={() => setCurrentStep(2)} isLastStep={false} />
    </>
  );

  const renderImageSelectionStep = () => (
    <>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Choose an Image</Text>
        )}
      </TouchableOpacity>
      <NextButton onPress={() => setCurrentStep(3)} disabled={eventData.imageUrls.length === 0} isLastStep={false} />
    </>
  );

  const renderEventDetailsStep = () => (
    <>
      <TextInput
        placeholder="Event Name"
        value={eventData.name}
        onChangeText={(text) => handleInputChange('name', text)}
        style={tw`mb-4 p-2 bg-white rounded`}
      />
      <TextInput
        placeholder="Event Details"
        value={eventData.details}
        onChangeText={(text) => handleInputChange('details', text)}
        style={tw`mb-4 p-2 bg-white rounded`}
        multiline
      />
      <NextButton onPress={() => setCurrentStep(4)} isLastStep={false} />
    </>
  );

  
  const renderTypeCategoryStep = () => (
    <>
      <Text style={tw`text-white mb-4`}>Select Event Type:</Text>
      <View style={tw`mb-4`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Card
            title="Indoor"
            icon={<Icon name="home" type="material" size={24} />}
            onPress={() => handleInputChange('eventType', 'indoor')}
            isSelected={eventData.eventType === 'indoor'}
          />
          <Card
            title="Outdoor"
            icon={<Icon name="nature" type="material-community" size={24} />}
            onPress={() => handleInputChange('eventType', 'outdoor')}
            isSelected={eventData.eventType === 'outdoor'}
          />
          <Card
            title="Online"
            icon={<Icon name="laptop" type="material" size={24} />}
            onPress={() => handleInputChange('eventType', 'online')}
            isSelected={eventData.eventType === 'online'}
          />
        </ScrollView>
      </View>

      <Text style={tw`text-white mb-4`}>Select Category:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
        {categories.map(category => (
          <Card
            key={category.id}
            title={category.name}
            icon={<Icon name={getCategoryIcon(category.name)} size={24} />}
            onPress={() => {
              handleInputChange('selectedCategory', category.id);
              handleInputChange('selectedSubcategory', ''); // Reset subcategory on category change
            }}
            isSelected={eventData.selectedCategory === category.id}
          />
        ))}
      </ScrollView>

      <Text style={tw`text-white mb-4`}>Select Subcategory:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mb-4`}>
        {subcategories.map(subcategory => (
          <Card
            key={subcategory.id}
            title={subcategory.name}
            icon={<Icon name={getSubcategoryIcon(subcategory.name)} size={24} />}
            onPress={() => handleInputChange('selectedSubcategory', subcategory.id)}
            isSelected={eventData.selectedSubcategory === subcategory.id}
          />
        ))}
      </ScrollView>

      <NextButton onPress={() => setCurrentStep(5)} isLastStep={false} />
    </>
  );

  const renderCalendarStep = () => (
    <>
      <Text style={tw`text-white mb-4`}>Select Start and End Dates:</Text>
      <ServiceCalendar
        selectedStartDate={eventData.startDate}
        selectedEndDate={eventData.endDate}
        onDateSelect={(start, end) => {
          handleInputChange('startDate', start);
          handleInputChange('endDate', end);
        }}
        exceptionDates={exceptionDates}
        onDateException={handleDateSelection}
      />
      <NextButton onPress={() => setCurrentStep(6)} isLastStep={false} />
    </>
  );

  const renderMapStep = () => (
    <>
      <Text style={tw`text-white mb-4`}>Select Location:</Text>
      {/* Placeholder for map component */}
      <TouchableOpacity
        onPress={() => Alert.alert('Location Picker', 'Implement the map selection screen here.')}
        style={tw`mb-4 p-4 bg-white rounded`}>
        <Text>Select Location</Text>
      </TouchableOpacity>
      <NextButton onPress={handleCreateEvent} isLoading={isLoading} isLastStep={true} />
    </>
  );

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={tw`flex-1 p-4`}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          {currentStep === 1 && renderOnboardingStep()}
          {currentStep === 2 && renderImageSelectionStep()}
          {currentStep === 3 && renderEventDetailsStep()}
          {currentStep === 4 && renderTypeCategoryStep()}
          {currentStep === 5 && renderCalendarStep()}
          {currentStep === 6 && renderMapStep()}
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    height: 200,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#ccc',
  },
});

export default EventCreation;
