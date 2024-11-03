import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal ,ScrollView, Alert, Image, ActivityIndicator, Switch } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../../services/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../../UserContext';
import CloudinaryUploadPrivate from '../../../components/event/CloudinaryUploadPrivate';
import MapScreen from '../../../screens/MapScreen';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import TimePicker from '../../../screens/PersonalServiceScreen/components/TimePicker';
import tw from 'twrnc';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import DateTimeSection from './edit/DateTimeSection';
import { StackNavigationProp } from '@react-navigation/stack';

interface EditEventProps {
  route: { params: { eventId: number } };
}

type RootStackParamList = {
  UserProfile: undefined;
  // Add other screens as needed
};

const EditEventScreen: React.FC<EditEventProps> = ({ route }) => {
  const { eventId } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // States
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [availabilityChanges, setAvailabilityChanges] = useState<{
    added: any[];
    updated: any[];
    deleted: number[];
  }>({
    added: [],
    updated: [],
    deleted: []
  });
  // Calendar and Time Picker States
  // const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  // const [showDatePicker, setShowDatePicker] = useState(false);
  // const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  // const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Event Data state
// Remove these states
// const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
// const [showDatePicker, setShowDatePicker] = useState(false);
// const [showStartTimePicker, setShowStartTimePicker] = useState(false);
// const [showEndTimePicker, setShowEndTimePicker] = useState(false);

// Update eventData state to remove date/time fields
const [eventData, setEventData] = useState({
  name: '',
  details: '',
  type: 'indoor',
  privacy: false,
  subcategory_id: '',
  imageUrl: '',
  location: { latitude: 0, longitude: 0 },
  ticketPrice: '',
  ticketQuantity: '',
});

  useEffect(() => {
    Promise.all([
      fetchEventDetails(),
      fetchCategories(),
      fetchMediaId(),
      fetchLocationId()
    ]);
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('event')
        .select(`
          *,
          subcategory (
            id,
            name,
            category (id, name)
          ),
          location (longitude, latitude),
          media (url),
          ticket (price, quantity)
        `)
        .eq('id', eventId)
        .single();
  
      if (error) throw error;
  
      setEventData({
        name: data.name,
        details: data.details || '',
        type: data.type,
        privacy: data.privacy,
        subcategory_id: data.subcategory?.id,
        imageUrl: data.media?.[0]?.url || '',
        location: data.location || { latitude: 0, longitude: 0 },
        ticketPrice: data.ticket?.[0]?.price?.toString() || '',
        ticketQuantity: data.ticket?.[0]?.quantity?.toString() || '',
      });
  
      setSelectedCategory(data.subcategory?.category?.id);
      if (data.subcategory?.category?.id) {
        fetchSubcategories(data.subcategory.category.id);
      }
  
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaId = async () => {
    const { data, error } = await supabase
      .from('media')
      .select('id, url')
      .eq('event_id', eventId)
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (!error && data) {
      setMediaId(data.id);
      setEventData(prev => ({ ...prev, imageUrl: data.url }));
    }
  };

  const handleImageUpload = async (urls: string[]) => {
    if (urls.length === 0) return;

    setLoading(true);
    try {
      if (mediaId) {
        const { error } = await supabase
          .from('media')
          .update({ url: urls[0] })
          .eq('id', mediaId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('media')
          .insert({
            event_id: eventId,
            url: urls[0],
            type: 'image'
          });

        if (error) throw error;
        await fetchMediaId();
      }

      setNewImageUrl(urls[0]);
      setEventData(prev => ({ ...prev, imageUrl: urls[0] }));
      console.log('Image updated successfully!');
      
      // Restore scroll position after state update
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: scrollPosition, animated: false });
      }, 0);

    } catch (error) {
      console.error('Error handling image:', error);
    } finally {
      setLoading(false);
    }
  };

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
    // setShowMap(false);
  };


  const fetchLocationId = async () => {
    const { data, error } = await supabase
      .from('location')
      .select('id, latitude, longitude')
      .eq('event_id', eventId)
      .single();

    if (!error && data) {
      setLocationId(data.id);
      setEventData(prev => ({
        ...prev,
        location: { latitude: data.latitude, longitude: data.longitude }
      }));
    }
  };



// Update handleLocationUpdate function to properly handle updates
const handleLocationUpdate = async (location: { latitude: number; longitude: number }) => {
  setLoading(true);
  try {
    console.log('Updating location with:', { locationId, eventId, location });

    if (locationId) {
      // Update existing location
      const { error } = await supabase
        .from('location')
        .update({
          latitude: location.latitude,
          longitude: location.longitude
        })
        .eq('id', locationId)  // This ensures we update the existing record
        .eq('event_id', eventId);  // Additional safety check

      if (error) throw error;
      console.log('Successfully updated location');
    } else {
      // Only insert if no location exists
      const { data, error } = await supabase
        .from('location')
        .insert({
          event_id: eventId,
          latitude: location.latitude,
          longitude: location.longitude
        })
        .select();

      if (error) throw error;
      
      if (data && data[0] && 'id' in data[0]) {
        setLocationId(data[0].id);
      }
    }

    // Update local state
    setEventData(prev => ({
      ...prev,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    }));

    // Fetch updated location to ensure sync
    await fetchLocationId();
    
    // setShowMap(false);
    Alert.alert('Success', 'Location updated successfully!');

  } catch (error: any) {
    console.error('Error updating location:', error);
    Alert.alert('Error', `Failed to update location: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

// In EditEventScreen.tsx

const handleUpdate = async () => {
  try {
    setLoading(true);

    // Log the data being sent
    console.log('Updating event with:', {
      name: eventData.name,
      details: eventData.details,
      type: eventData.type,
      privacy: eventData.privacy,
      subcategory_id: eventData.subcategory_id
    });

    // Start with event update
    const { data, error: eventError } = await supabase  // Add data to the response
      .from('event')
      .update({
        name: eventData.name,
        details: eventData.details,  // Make sure this is being sent
        type: eventData.type,
        privacy: eventData.privacy,
        subcategory_id: eventData.subcategory_id
      })
      .eq('id', eventId)
      .select();  // Add select() to see what's being returned

    if (eventError) throw eventError;
    
    console.log('Update response:', data); 

    // Location update
    if (eventData.location?.latitude && eventData.location?.longitude) {
      if (locationId) {
        const { error: locationError } = await supabase
          .from('location')
          .update({
            latitude: eventData.location.latitude,
            longitude: eventData.location.longitude
          })
          .eq('id', locationId);

        if (locationError) throw locationError;
      } else {
        const { error: locationError } = await supabase
          .from('location')
          .insert({
            event_id: eventId,
            latitude: eventData.location.latitude,
            longitude: eventData.location.longitude
          });

        if (locationError) throw locationError;
      }
    }

    // Ticket update - First check if ticket exists
    const { data: existingTicket, error: ticketCheckError } = await supabase
      .from('ticket')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (ticketCheckError && ticketCheckError.code !== 'PGRST116') {
      throw ticketCheckError;
    }

    // Handle ticket update/insert
    if (eventData.ticketPrice || eventData.ticketQuantity) {
      const ticketData = {
        event_id: eventId,
        price: parseFloat(eventData.ticketPrice) || 0,
        quantity: parseInt(eventData.ticketQuantity) || 0
      };

      if (existingTicket) {
        // Update existing ticket
        const { error: ticketUpdateError } = await supabase
          .from('ticket')
          .update(ticketData)
          .eq('id', existingTicket.id);

        if (ticketUpdateError) throw ticketUpdateError;
      } else {
        // Insert new ticket
        const { error: ticketInsertError } = await supabase
          .from('ticket')
          .insert([ticketData]);

        if (ticketInsertError) throw ticketInsertError;
      }
    }

    // Handle availability changes
    if (availabilityChanges) {
      await Promise.all([
        availabilityChanges.deleted.length > 0 && supabase
          .from('availability')
          .delete()
          .in('id', availabilityChanges.deleted),

        availabilityChanges.updated.length > 0 && supabase
          .from('availability')
          .upsert(availabilityChanges.updated),

        availabilityChanges.added.length > 0 && supabase
          .from('availability')
          .insert(availabilityChanges.added.map(a => ({
            event_id: eventId,
            date: a.date,
            start: a.start,
            end: a.end
          })))
      ]);
    }

    Alert.alert('Success', 'Event updated successfully');
    navigation.goBack();
  } catch (error: any) {
    console.error('Error updating event:', error);
    Alert.alert('Error', `Failed to update event: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-blue-900`}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
      style={tw`flex-1`}
    >
     <ScrollView 
        ref={scrollViewRef}
        style={tw`flex-1`}
        onScroll={(event) => {
          setScrollPosition(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        <View style={tw`p-4`}>
          <Text style={tw`text-2xl font-bold text-white mb-6`}>Edit Event</Text>
  
          {/* Event Name */}
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
            <Text style={tw`text-white text-lg mb-2`}>Event Name</Text>
            <TextInput
              style={tw`bg-white/20 p-3 rounded-lg text-white`}
              value={eventData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </BlurView>
  
        {/* Event Details */}
<BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
  <Text style={tw`text-white text-lg mb-2`}>Details</Text>
  <TextInput
    style={tw`bg-white/20 p-3 rounded-lg text-white h-24`}
    multiline
    value={eventData.details}
    onChangeText={(value) => {
      console.log('Details changed to:', value);  // Add this log
      handleInputChange('details', value);
    }}
    placeholderTextColor="rgba(255,255,255,0.5)"
  />
</BlurView>
  
          {/* Event Type */}
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
            <Text style={tw`text-white text-lg mb-2`}>Event Type</Text>
            <View style={tw`bg-white/20 rounded-lg`}>
              <Picker
                selectedValue={eventData.type}
                onValueChange={(value) => handleInputChange('type', value)}
                style={tw`text-white`}
              >
                <Picker.Item label="Indoor" value="indoor" />
                <Picker.Item label="Outdoor" value="outdoor" />
                <Picker.Item label="Online" value="online" />
              </Picker>
            </View>
          </BlurView>
  
          {/* Category and Subcategory */}
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
            <Text style={tw`text-white text-lg mb-2`}>Category</Text>
            <View style={tw`bg-white/20 rounded-lg mb-4`}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  fetchSubcategories(value);
                }}
                style={tw`text-white`}
              >
                {categories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))}
              </Picker>
            </View>
  
            <Text style={tw`text-white text-lg mb-2`}>Subcategory</Text>
            <View style={tw`bg-white/20 rounded-lg`}>
              <Picker
                selectedValue={eventData.subcategory_id}
                onValueChange={(value) => handleInputChange('subcategory_id', value)}
                style={tw`text-white`}
              >
                {subcategories.map((subcategory) => (
                  <Picker.Item key={subcategory.id} label={subcategory.name} value={subcategory.id} />
                ))}
              </Picker>
            </View>
          </BlurView>
  
          <DateTimeSection 
  eventId={eventId} 
  onAvailabilityChange={(changes) => setAvailabilityChanges(changes)}
/>

        {/* Location */}
        <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
          <Text style={tw`text-white text-lg mb-2`}>Location</Text>
          <TouchableOpacity
            style={tw`bg-blue-500 p-3 rounded-lg`}
            onPress={() => setShowMap(true)}
          >
            <Text style={tw`text-white text-center`}>
              {eventData.location?.latitude ? 'Change Location' : 'Select Location'}
            </Text>
          </TouchableOpacity>
          {eventData.location?.latitude !== undefined && (
            <Text style={tw`text-white mt-2`}>
              Lat: {eventData.location.latitude?.toFixed(6)}, 
              Long: {eventData.location.longitude?.toFixed(6)}
            </Text>
          )}
        </BlurView>
  
          {/* Image Upload Section */}
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
            <Text style={tw`text-white text-lg mb-2`}>Event Image</Text>
            {(eventData.imageUrl || newImageUrl) && (
              <Image
                source={{ uri: newImageUrl || eventData.imageUrl }}
                style={tw`w-full h-40 rounded-lg mb-2`}
                resizeMode="cover"
              />
            )}
            <CloudinaryUploadPrivate 
              onImagesUploaded={handleImageUpload}
              buttonStyle={tw`bg-blue-500 p-3 rounded-lg`}
              buttonTextStyle={tw`text-white text-center`}
            />
          </BlurView>
  
          {/* Tickets */}
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
            <Text style={tw`text-white text-lg mb-2`}>Tickets</Text>
            <TextInput
              style={tw`bg-white/20 p-3 rounded-lg text-white mb-2`}
              value={eventData.ticketPrice}
              onChangeText={(value) => handleInputChange('ticketPrice', value)}
              placeholder="Ticket Price"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="numeric"
            />
            <TextInput
              style={tw`bg-white/20 p-3 rounded-lg text-white`}
              value={eventData.ticketQuantity}
              onChangeText={(value) => handleInputChange('ticketQuantity', value)}
              placeholder="Ticket Quantity"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="numeric"
            />
          </BlurView>
  
          {/* Privacy Toggle */}
          <BlurView intensity={80} tint="dark" style={tw`rounded-xl p-4 mb-4`}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-white text-lg`}>Private Event</Text>
              <Switch
                value={eventData.privacy}
                onValueChange={(value) => handleInputChange('privacy', value)}
              />
            </View>
          </BlurView>
  
       {/* Buttons */}
       <View style={tw`flex-row justify-between mt-6`}>
          <TouchableOpacity
            style={tw`bg-red-500 p-4 rounded-xl flex-1 mr-2`}
            onPress={() => navigation.navigate('UserProfile')}
          >
            <Text style={tw`text-white text-center text-lg font-bold`}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-green-500 p-4 rounded-xl flex-1 ml-2`}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={tw`text-white text-center text-lg font-bold`}>
              {loading ? 'Updating...' : 'Update Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

{/* Modals */}
{showMap && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={showMap}
  >
    <View style={tw`flex-1 justify-end`}>
      <View style={tw`bg-white h-[80%] rounded-t-3xl overflow-hidden`}>
        <TouchableOpacity 
          style={tw`absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg`}
          onPress={() => setShowMap(false)}
        >
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        
        <MapScreen
          onLocationSelected={(location) => {
            setEventData(prev => ({ ...prev, location }));
            // Remove the handleLocationUpdate call here
            // Let user confirm location by clicking Update Event button
          }}
        />
      </View>
    </View>
  </Modal>
)}

  </LinearGradient>
);
};

export default EditEventScreen;