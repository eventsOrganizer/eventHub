import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { supabase } from '../services/supabaseClient';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SearchResults: { initialSearchTerm: string };
  EventDetails: { eventId: string };
  ServiceDetail: { serviceId: string }; // Ensure this is defined
};

type SearchResultsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SearchResults'
>;

type Props = {
  navigation: SearchResultsScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'SearchResults'>;
};

const SearchResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialSearchTerm = route.params?.initialSearchTerm || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [eventResults, setEventResults] = useState<any[]>([]);
  const [serviceResults, setServiceResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchForServices, setSearchForServices] = useState(false); // New state to toggle between event and service search

  useEffect(() => {
    let isMounted = true; // flag to track if component is still mounted

    const fetchData = async () => {
      if (searchTerm.trim() === '') return;
      setLoading(true);
    
      try {
        console.log('Searching for:', searchTerm); // Log the search term
    
        // Fetch events
        const { data: eventData, error: eventError } = await supabase
          .from('event')
          .select('id, name, details')
          .ilike('name', `%${searchTerm}%`);
    
        if (eventError) throw eventError;
    
        console.log('Event Data:', eventData); // Log the event data
    
        if (isMounted) {
          setEventResults(eventData?.map(item => ({ ...item, type: 'event' })) || []);
        }
    
        // Fetch services if searching for services
        if (searchForServices) {
          const { data: serviceData, error: serviceError } = await supabase
            .from('service') // Assuming you have a service table
            .select('id, name, details')
            .ilike('name', `%${searchTerm}%`);
    
          if (serviceError) throw serviceError;
    
          console.log('Service Data:', serviceData); // Log the service data
    
          if (isMounted) {
            setServiceResults(serviceData?.map(item => ({ ...item, type: 'service' })) || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup if component unmounts
    };
  }, [searchTerm, searchForServices]);

  const handleItemPress = (item: { id: string, type: string }) => {
    if (item.type === 'event') {
      navigation.navigate('EventDetails', { eventId: item.id });
    } else if (item.type === 'service') {
      navigation.navigate('ServiceDetail', { serviceId: item.id });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Refine search..."
        style={styles.searchInput}
      />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !searchForServices && styles.activeToggle]}
          onPress={() => setSearchForServices(false)}
        >
          <Text style={styles.toggleText}>Search Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, searchForServices && styles.activeToggle]}
          onPress={() => setSearchForServices(true)}
        >
          <Text style={styles.toggleText}>Search Services</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={searchForServices ? serviceResults : eventResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.itemContainer}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.details}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: '#00BFFF',
  },
  toggleText: {
    color: '#000',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SearchResultsScreen;
