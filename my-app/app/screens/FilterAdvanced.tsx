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
  lastMarkedLocation?: { latitude: number; longitude: number } | null;
}

// Define proper types for category and subcategory
interface Category {
  id: number | null;
  name: string;
}

interface Subcategory {
  id: number | null;
  name: string;
}

const FilterAdvanced: React.FC<FilterAdvancedProps> = ({ onEventsLoaded, currentLocation, lastMarkedLocation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
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
  const [useMarkedLocation, setUseMarkedLocation] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
    if (!currentLocation) {
      getUserLocation();
    }
  }, []);

  useEffect(() => {
    if (useMarkedLocation && lastMarkedLocation) {
      setUserLocation(lastMarkedLocation);
    } else if (currentLocation) {
      setUserLocation(currentLocation);
    }
  }, [currentLocation, lastMarkedLocation, useMarkedLocation]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setSubcategories([{ id: null, name: 'All' }]);
      setSelectedSubcategory('all');
    } else {
      fetchSubcategories(parseInt(selectedCategory));
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
      Alert.alert('Error', 'Location not available. Please wait for your location to be determined or mark a location on the map.');
      return;
    }

    try {
      // Convert selectedCategory and selectedSubcategory to proper format for the database
      const categoryId = selectedCategory === 'all' ? null : parseInt(selectedCategory);
      const subcategoryId = selectedSubcategory === 'all' ? null : parseInt(selectedSubcategory);

      const { data, error } = await supabase.rpc('filter_events', {
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude,
        max_distance: perimeter ? parseFloat(perimeter) : null,
        search_name: eventName || null,
        input_category_id: categoryId,
        input_subcategory_id: subcategoryId,
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

      let parsedData;
      try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
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
      />
      {isFilterVisible && (
        <>
          <Text style={tw`text-base font-bold mb-2`}>Filter Events</Text>
          
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Use Location</Text>
            <Picker
              selectedValue={useMarkedLocation}
              onValueChange={(value: boolean) => {
                setUseMarkedLocation(value);
                setUserLocation(value && lastMarkedLocation ? lastMarkedLocation : currentLocation || null);
              }}
              style={tw`border border-gray-300 rounded`}
            >
              <Picker.Item label="Current Location" value={false} />
              <Picker.Item label="Marked Location" value={true} />
            </Picker>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue: string) => {
                setSelectedCategory(itemValue);
                setSelectedSubcategory('all');
              }}
              style={tw`border border-gray-300 rounded`}
            >
              <Picker.Item label="All" value="all" />
              {categories
                .filter(category => category.id !== null)
                .map((category) => (
                  <Picker.Item 
                    key={category.id} 
                    label={category.name} 
                    value={category.id.toString()} 
                  />
              ))}
            </Picker>
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm`}>Subcategory</Text>
            <Picker
              selectedValue={selectedSubcategory}
              onValueChange={(itemValue: string) => setSelectedSubcategory(itemValue)}
              style={tw`border border-gray-300 rounded`}
            >
              <Picker.Item label="All" value="all" />
              {subcategories
                .filter(subcategory => subcategory.id !== null)
                .map((subcategory) => (
                  <Picker.Item 
                    key={subcategory.id} 
                    label={subcategory.name} 
                    value={subcategory.id.toString()} 
                  />
              ))}
            </Picker>
          </View>

          {/* Rest of your form fields... */}
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