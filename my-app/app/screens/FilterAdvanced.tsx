import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';
import * as Location from 'expo-location';

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
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);


  useEffect(() => {
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

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered events:', error);
      return;
    }

    let filteredEvents = data;
    if (perimeter) {
      const perimeterValue = parseFloat(perimeter);
      filteredEvents = data.filter(event => {
        const eventLocation = event.location[0];
        if (eventLocation) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            eventLocation.latitude,
            eventLocation.longitude
          );
          return distance <= perimeterValue;
        }
        return false;
      });
    }

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
          <Button title="Apply Filters" onPress={fetchFilteredEvents} />
        </>
      )}
    </ScrollView>
  );
};

export default FilterAdvanced;
