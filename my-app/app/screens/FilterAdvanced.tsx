import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterAdvancedProps {
  onEventsLoaded: (events: any[]) => void;
  currentLocation?: { latitude: number; longitude: number };
}

const FilterAdvanced: React.FC<FilterAdvancedProps> = ({ onEventsLoaded, currentLocation }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [perimeter, setPerimeter] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [privacy, setPrivacy] = useState<boolean | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
    if (!currentLocation) {
      getUserLocation();
    }
  }, []);

  useEffect(() => {
    if (currentLocation) {
      setUserLocation(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const getUserLocation = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for distance-based filtering.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Distance-based filtering may not work.');
    }
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchSubcategories = async (categoryId: number) => {
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .eq('category_id', categoryId)
      .order('name');

    if (error) {
      console.error('Error fetching subcategories:', error);
      return;
    }

    setSubcategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchFilteredEvents = async () => {
    if (!userLocation) {
      Alert.alert('Error', 'Location not available. Please wait for your location to be determined.');
      return;
    }
  
    try {
      const { data, error } = await supabase.rpc('filter_events', {
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude,
        max_distance: perimeter ? parseFloat(perimeter) : null,
        search_name: eventName || null,
        input_category_id: selectedCategory,
        input_subcategory_id: selectedSubcategory,
        event_type: eventType || null,
        is_private: privacy,
        min_price: minPrice ? parseFloat(minPrice) : null,
        max_price: maxPrice ? parseFloat(maxPrice) : null,
        start_date: startDate?.toISOString() || null,
        end_date: endDate?.toISOString() || null
      });
  
      if (error) {
        console.error('Error fetching filtered events:', error);
        Alert.alert('Error', 'Failed to fetch events. Please try again.');
        return;
      }
  
      console.log('Raw data from filter_events:', data);
  
      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        console.log('Data causing parse error:', data);
        Alert.alert('Error', 'Failed to process event data. Please try again.');
        return;
      }
  
      if (!Array.isArray(parsedData)) {
        console.error('Parsed data is not an array:', parsedData);
        Alert.alert('Error', 'Unexpected data format. Please try again.');
        return;
      }
  
      const formattedData = parsedData.map((event: any) => ({
        ...event,
        distance: event.event_distance,
        price: event.event_price,
        category: { name: event.category_name },
        subcategory: { name: event.subcategory_name },
        location: Array.isArray(event.location_data) ? event.location_data : [event.location_data],
        media: Array.isArray(event.media_urls) ? event.media_urls.map((url: string) => ({ url })) : [],
        availability: [{ date: event.event_date }]
      }));
      console.log('Raw data from filter_events:', JSON.stringify(data, null, 2));
      onEventsLoaded(formattedData || []);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };



  return (
    <ScrollView style={tw`p-4 bg-white`}>
      <Button
        title={isFilterVisible ? "Hide Filters" : "Show Filters"}
        onPress={() => setIsFilterVisible(!isFilterVisible)}
        style={tw`mb-4`}
      />
      {isFilterVisible && (
        <>
          <Text style={tw`text-base font-bold mb-2`}>Filter Events</Text>
          
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Event Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-1 text-sm`}
              value={eventName}
              onChangeText={setEventName}
              placeholder="Enter event name"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Distance (km)</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-1 text-sm`}
              value={perimeter}
              onChangeText={setPerimeter}
              placeholder="Enter distance"
              keyboardType="numeric"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => {
                setSelectedCategory(itemValue);
                setSelectedSubcategory(null);
              }}
              style={tw`border border-gray-300 rounded`}
            >
              {categories.map((category) => (
                <Picker.Item key={category.id} label={category.name} value={category.id} />
              ))}
            </Picker>
          </View>

          {selectedCategory !== null && (
            <View style={tw`mb-4`}>
              <Text style={tw`mb-1 text-sm`}>Subcategory</Text>
              <Picker
                selectedValue={selectedSubcategory}
                onValueChange={(itemValue) => setSelectedSubcategory(itemValue)}
                style={tw`border border-gray-300 rounded`}
              >
                {subcategories.map((subcategory) => (
                  <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
                ))}
              </Picker>
            </View>
          )}

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Event Type</Text>
            <Picker
              selectedValue={eventType}
              onValueChange={setEventType}
              style={tw`border border-gray-300 rounded`}
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="Indoor" value="indoor" />
              <Picker.Item label="Outdoor" value="outdoor" />
              <Picker.Item label="Online" value="online" />
            </Picker>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Privacy</Text>
            <Picker
              selectedValue={privacy}
              onValueChange={(value) => setPrivacy(value === '' ? null : value === 'true')}
              style={tw`border border-gray-300 rounded`}
            >
              <Picker.Item label="All" value="" />
              <Picker.Item label="Public" value="false" />
              <Picker.Item label="Private" value="true" />
            </Picker>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Min Price</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-1 text-sm`}
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder="Enter min price"
              keyboardType="numeric"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Max Price</Text>
            <TextInput
              style={tw`border border-gray-300 rounded p-1 text-sm`}
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="Enter max price"
              keyboardType="numeric"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Start Date</Text>
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || startDate;
                setStartDate(currentDate);
              }}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>End Date</Text>
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || endDate;
                setEndDate(currentDate);
              }}
            />
          </View>

          <Button title="Apply Filters" onPress={fetchFilteredEvents} />
        </>
      )}
    </ScrollView>
  );
};

export default FilterAdvanced;