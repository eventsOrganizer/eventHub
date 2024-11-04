import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchEventFilterProps {
  onEventsLoaded: (events: any[]) => void;
  onClose: () => void;
  isVisible: boolean;
  savedFilters?: any;
  onSaveFilters?: (filters: any) => void;
}

interface Category {
  id: number | null;
  name: string;
}

interface Subcategory {
  id: number | null;
  name: string;
}

const SearchEventFilter: React.FC<SearchEventFilterProps> = ({ 
  onEventsLoaded, 
  onClose,
  isVisible,
  savedFilters,
  onSaveFilters 
}) => {
  const [isFilterVisible, setIsFilterVisible] = useState(isVisible);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(savedFilters?.category || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(savedFilters?.subcategory || 'all');
  const [eventName, setEventName] = useState<string>(savedFilters?.eventName || '');
  const [eventType, setEventType] = useState<string>(savedFilters?.eventType || '');
  const [privacy, setPrivacy] = useState<boolean | null>(savedFilters?.privacy ?? null);
  const [minPrice, setMinPrice] = useState<string>(savedFilters?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState<string>(savedFilters?.maxPrice || '');
  const [startDate, setStartDate] = useState<Date | null>(savedFilters?.startDate ? new Date(savedFilters.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(savedFilters?.endDate ? new Date(savedFilters.endDate) : null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [perimeter, setPerimeter] = useState<string>(savedFilters?.perimeter || '');

  // Update filter visibility when prop changes
  useEffect(() => {
    setIsFilterVisible(isVisible);
  }, [isVisible]);

  // Reset results when filter becomes visible
  useEffect(() => {
    if (isFilterVisible) {
      onEventsLoaded([]);
    }
  }, [isFilterVisible]);

  useEffect(() => {
    fetchCategories();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchSubcategories(parseInt(selectedCategory));
    } else {
      setSubcategories([]);
      setSelectedSubcategory('all');
    }
  }, [selectedCategory]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for distance-based search.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Some features may be limited.');
    }
  };

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

  const handleClose = () => {
    setIsFilterVisible(false);
    onClose();
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

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setEventName('');
    setEventType('');
    setPrivacy(null);
    setMinPrice('');
    setMaxPrice('');
    setStartDate(null);
    setEndDate(null);
    setPerimeter('');
    onEventsLoaded([]);
  };

  const handleSearch = async () => {
    if (!userLocation) {
      Alert.alert('Error', 'Location not available. Please wait for your location to be determined.');
      return;
    }
  
    try {
      const filters = {
        category: selectedCategory,
        subcategory: selectedSubcategory,
        eventName,
        eventType,
        privacy,
        minPrice,
        maxPrice,
        startDate,
        endDate,
        perimeter
      };
  
      if (onSaveFilters) {
        onSaveFilters(filters);
      }
  
      onEventsLoaded([]); // Clear existing results
  
      // First get the filtered events
      const { data: filteredEvents, error: filterError } = await supabase.rpc('filter_events', {
        search_name: eventName || null,
        input_category_id: selectedCategory === 'all' ? null : parseInt(selectedCategory),
        input_subcategory_id: selectedSubcategory === 'all' ? null : parseInt(selectedSubcategory),
        event_type: eventType || null,
        is_private: privacy,
        min_price: minPrice ? parseFloat(minPrice) : null,
        max_price: maxPrice ? parseFloat(maxPrice) : null,
        start_date: startDate?.toISOString() || null,
        end_date: endDate?.toISOString() || null,
        max_distance: perimeter ? parseFloat(perimeter) : null,
        user_lat: userLocation.latitude,
        user_lon: userLocation.longitude
      });
  
      if (filterError) throw filterError;
  
      // If we have filtered events, get their media
      if (filteredEvents && filteredEvents.length > 0) {
        // Get all event IDs
        const eventIds = filteredEvents.map(event => event.id);
        
        // Fetch event details with media in a single query
        const { data: eventsWithMedia, error: mediaError } = await supabase
          .from('event')
          .select(`
            *,
            media (url)
          `)
          .in('id', eventIds);
  
        if (mediaError) throw mediaError;
  
        // Map the media data to the filtered events
        const resultsWithMedia = filteredEvents.map(event => {
          const eventWithMedia = eventsWithMedia?.find(e => e.id === event.id);
          return {
            ...event,
            media: eventWithMedia?.media || [],
            media_urls: eventWithMedia?.media?.map(m => m.url) || []
          };
        });
  
        onEventsLoaded(resultsWithMedia);
        
        if (resultsWithMedia.length > 0) {
          handleClose();
        }
      } else {
        onEventsLoaded([]);
      }
    } catch (error) {
      console.error('Error searching events:', error);
      Alert.alert('Error', 'Failed to search events. Please try again.');
    }
  };

  return (
    <Modal
    visible={isFilterVisible}
    animationType="slide"
    transparent={true}
  >
    <View style={tw`flex-1 bg-white mt-[20%]`}>
        <View style={tw`p-4 flex-row justify-between items-center border-b border-gray-200`}>
          <Text style={tw`text-lg font-bold`}>Advanced Event Search</Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons  name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={tw`flex-1 p-4`}>
          {/* All your existing filter components with the same functionality */}
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm font-medium`}>Event Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2`}
              value={eventName}
              onChangeText={setEventName}
              placeholder="Search by name"
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm font-medium`}>Distance (km)</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2`}
              value={perimeter}
              onChangeText={setPerimeter}
              placeholder="Maximum distance"
              keyboardType="numeric"
            />
          </View>

          {/* Category Picker */}
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm font-medium`}>Category</Text>
            <View style={tw`border border-gray-300 rounded-lg overflow-hidden`}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
                style={tw`bg-white`}
              >
                <Picker.Item label="All Categories" value="all" />
                {categories
                  .filter(category => category.id !== null)
                  .map(category => (
                    <Picker.Item 
                      key={category.id?.toString()} 
                      label={category.name} 
                      value={category.id?.toString()} 
                    />
                  ))
                }
              </Picker>
            </View>
          </View>

          {/* Subcategory Picker (conditional) */}
          {selectedCategory !== 'all' && (
            <View style={tw`mb-4`}>
              <Text style={tw`mb-1 text-sm font-medium`}>Subcategory</Text>
              <View style={tw`border border-gray-300 rounded-lg overflow-hidden`}>
                <Picker
                  selectedValue={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                  style={tw`bg-white`}
                >
                  <Picker.Item label="All Subcategories" value="all" />
                  {subcategories
                    .filter(subcategory => subcategory.id !== null)
                    .map(subcategory => (
                      <Picker.Item
                        key={subcategory.id?.toString()}
                        label={subcategory.name}
                        value={subcategory.id?.toString()}
                      />
                    ))
                  }
                </Picker>
              </View>
            </View>
          )}

          {/* Event Type Picker */}
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm font-medium`}>Event Type</Text>
            <View style={tw`border border-gray-300 rounded-lg overflow-hidden`}>
              <Picker
                selectedValue={eventType}
                onValueChange={setEventType}
                style={tw`bg-white`}
              >
                <Picker.Item label="All Types" value="" />
                <Picker.Item label="Public" value="public" />
                <Picker.Item label="Private" value="private" />
              </Picker>
            </View>
          </View>

          {/* Price Range */}
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm font-medium`}>Price Range</Text>
            <View style={tw`flex-row space-x-2`}>
              <TextInput
                style={tw`flex-1 border border-gray-300 rounded-lg p-2`}
                value={minPrice}
                onChangeText={setMinPrice}
                placeholder="Min"
                keyboardType="numeric"
              />
              <TextInput
                style={tw`flex-1 border border-gray-300 rounded-lg p-2`}
                value={maxPrice}
                onChangeText={setMaxPrice}
                placeholder="Max"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Date Range */}
          <View style={tw`mb-4`}>
            <Text style={tw`mb-1 text-sm font-medium`}>Date Range</Text>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                style={tw`flex-1 border border-gray-300 rounded-lg p-2 mr-2`}
              >
                <Text>{startDate ? startDate.toLocaleDateString() : 'Start Date'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={tw`flex-1 border border-gray-300 rounded-lg p-2`}
              >
                <Text>{endDate ? endDate.toLocaleDateString() : 'End Date'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Pickers */}
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartDatePicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndDatePicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}

          {/* Action Buttons */}
          <View style={tw`flex-row justify-end space-x-4 mt-6 mb-4`}>
            <TouchableOpacity
              onPress={handleClose}
              style={tw`bg-gray-200 px-6 py-3 rounded-lg`}
            >
              <Text style={tw`text-gray-800 font-medium`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSearch}
              style={tw`bg-blue-600 px-6 py-3 rounded-lg`}
            >
              <Text style={tw`text-white font-medium`}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SearchEventFilter;