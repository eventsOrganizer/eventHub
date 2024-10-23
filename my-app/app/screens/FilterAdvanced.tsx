import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';
import * as Location from 'expo-location';

interface FilterAdvancedProps {
  onEventsLoaded: (events: any[]) => void;
}

const FilterAdvanced: React.FC<FilterAdvancedProps> = ({ onEventsLoaded }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string>('');
  const [perimeter, setPerimeter] = useState<string>('');
  const [isPerimeterInputVisible, setIsPerimeterInputVisible] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    console.log('FilterAdvanced component mounted');
    fetchCategories();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      console.log(`Selected category changed to: ${selectedCategory}`);
      fetchSubcategories(selectedCategory);
    } else {
      console.log('Category deselected, clearing subcategories');
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const getUserLocation = useCallback(async () => {
    console.log('Starting getUserLocation process');
    try {
      console.log('Requesting location permission');
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(`Location permission status: ${status}`);
      if (status !== 'granted') {
        console.log('Location permission denied');
        Alert.alert('Permission denied', 'Location permission is required for distance-based filtering.');
        return;
      }

      console.log('Getting current position');
      let location = await Location.getCurrentPositionAsync({});
      console.log(`Location received: ${JSON.stringify(location.coords)}`);
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log('User location set successfully');
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Distance-based filtering may not work.');
    }
  }, []);

  const fetchCategories = async () => {
    console.log('Fetching categories');
    const { data, error } = await supabase
      .from('category')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    console.log(`Categories fetched: ${data.length}`);
    setCategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchSubcategories = async (categoryId: number) => {
    console.log(`Fetching subcategories for category: ${categoryId}`);
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .eq('category_id', categoryId)
      .order('name');

    if (error) {
      console.error('Error fetching subcategories:', error);
      return;
    }

    console.log(`Subcategories fetched: ${data.length}`);
    setSubcategories([{ id: null, name: 'All' }, ...data]);
  };

  const fetchFilteredEvents = async () => {
    console.log('Starting fetchFilteredEvents');
    console.log(`Current filters - Category: ${selectedCategory}, Subcategory: ${selectedSubcategory}, Name: ${eventName}, Perimeter: ${perimeter}`);

    let query = supabase
    .from('event')
    .select(`
      *,
      subcategory!inner (id, name, category_id, category:category_id(id, name)),
      location!inner (id, longitude, latitude),
      availability (id, start, end, daysofweek, date),
      media (url),
      user:user_id (email),
      event_has_user (user_id)
    `)
    .not('location.id', 'is', null);

    if (eventName) {
      query = query.ilike('name', `%${eventName}%`);
    }

    if (selectedCategory) {
      query = query.eq('subcategory.category_id', selectedCategory);
    }

    if (selectedSubcategory) {
      query = query.eq('subcategory_id', selectedSubcategory);
    }

    console.log('Executing Supabase query');
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered events:', error);
      return;
    }

    if (!data) {
      console.log('No events found');
      onEventsLoaded([]);
      return;
    }

    console.log(`Events fetched: ${data.length}`);

    console.log('Raw data from query:', JSON.stringify(data, null, 2));

    let filteredEvents = data;
    console.log(`User location: ${JSON.stringify(userLocation)}`);
console.log(`Total events before filtering: ${data.length}`);
if (perimeter && userLocation) {
  console.log(`Filtering by distance: ${perimeter} km`);
  const perimeterValue = parseFloat(perimeter);
  filteredEvents = data.filter(event => {
    console.log(`Event ${event.id} location:`, JSON.stringify(event.location));
    if (event.location && Array.isArray(event.location) && event.location.length > 0) {
      const eventLocation = event.location[0];
      if (typeof eventLocation.latitude === 'number' && typeof eventLocation.longitude === 'number') {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          eventLocation.latitude,
          eventLocation.longitude
        );
        console.log(`Event ${event.id} distance: ${distance.toFixed(2)} km`);
        return distance <= perimeterValue;
      }
    }
    console.log(`Event ${event.id} skipped (invalid location data)`);
    return false;
  });
}




    

    console.log(`Filtered events: ${filteredEvents.length}`);
    onEventsLoaded(filteredEvents);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <View style={tw`p-4 bg-white`}>
    <Button
      title="Hide Keyboard"
      onPress={() => Keyboard.dismiss()}
      style={tw`mb-4`}
    />
    <Text style={tw`text-lg font-bold mb-2`}>Filter Events</Text>
      <Text style={tw`text-lg font-bold mb-2`}>Filter Events</Text>
      <View style={tw`mb-4`}>
        <Text style={tw`mb-1`}>Event Name</Text>
        <TextInput
          style={tw`border border-gray-300 rounded p-2`}
          value={eventName}
          onChangeText={setEventName}
          placeholder="Enter event name"
        />
      </View>
      <View style={tw`mb-4`}>
        <Text style={tw`mb-1`}>Category</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            console.log(`Category selected: ${itemValue}`);
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
          <Text style={tw`mb-1`}>Subcategory</Text>
          <Picker
            selectedValue={selectedSubcategory}
            onValueChange={(itemValue) => {
              console.log(`Subcategory selected: ${itemValue}`);
              setSelectedSubcategory(itemValue);
            }}
            style={tw`border border-gray-300 rounded`}
          >
            {subcategories.map((subcategory) => (
              <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
            ))}
          </Picker>
        </View>
      )}
      <View style={tw`mb-4`}>
        <Button 
          title={isPerimeterInputVisible ? "Hide Perimeter Input" : "Show Perimeter Input"} 
          onPress={() => {
            console.log(`Toggling perimeter input visibility: ${!isPerimeterInputVisible}`);
            setIsPerimeterInputVisible(prev => !prev);
          }} 
        />
      </View>
      {isPerimeterInputVisible && (
        <View style={tw`mb-4`}>
          <Text style={tw`mb-1`}>Perimeter (in km)</Text>
          <TextInput
            style={tw`border border-gray-300 rounded p-2`}
            value={perimeter}
            onChangeText={(value) => {
              console.log(`Perimeter changed: ${value}`);
              setPerimeter(value);
            }}
            placeholder="Enter perimeter in kilometers"
            keyboardType="numeric"
          />
        </View>
      )}
      <Button title="Apply Filters" onPress={() => {
        console.log('Apply Filters button pressed');
        fetchFilteredEvents();
      }} />
    </View>
  );
};

export default FilterAdvanced;