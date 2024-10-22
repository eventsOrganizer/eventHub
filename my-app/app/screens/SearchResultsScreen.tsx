import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { supabase } from '../services/supabaseClient';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SearchResults: { initialSearchTerm: string };
  EventDetails: { eventId: string };
  LocalServiceDetails: { localServiceId: string };
  PersonalDetails: { personalId: string };
  MaterialDetails: { materialId: string }; // Assuming you have a MaterialDetails screen
};

type SearchResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchResults'>;

type Props = {
  navigation: SearchResultsScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'SearchResults'>;
};

const SearchResultsScreen: React.FC<Props> = ({ navigation, route }) => {
  const initialSearchTerm = route.params?.initialSearchTerm || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [eventResults, setEventResults] = useState<any[]>([]);
  const [localResults, setLocalResults] = useState<any[]>([]);
  const [personalResults, setPersonalResults] = useState<any[]>([]);
  const [materialResults, setMaterialResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchForServices, setSearchForServices] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() === '') return;
      setLoading(true);

      try {
        console.log('Searching for:', searchTerm);

        // Fetch events
        const { data: eventData, error: eventError } = await supabase
          .from('event')
          .select('id, name, details')
          .ilike('name', `%${searchTerm}%`);

        if (eventError) throw eventError;

        // Adding type 'event' to each item
        const eventsWithType = eventData?.map(item => ({ ...item, type: 'event' })) || [];
        setEventResults(eventsWithType);

        // Fetch locals
        const { data: localData, error: localError } = await supabase
          .from('local')
          .select('id, name, details, priceperhour, media (url)')
          .ilike('name', `%${searchTerm}%`);

        if (localError) throw localError;

        // Adding type 'local' to each item
        const localsWithType = localData?.map(item => ({ ...item, type: 'local' })) || [];
        setLocalResults(localsWithType);

        // Fetch personal services
        const { data: personalData, error: personalError } = await supabase
          .from('personal')
          .select('id, name, details')
          .ilike('name', `%${searchTerm}%`);

        if (personalError) throw personalError;

        // Adding type 'personal' to each item
        const personalsWithType = personalData?.map(item => ({ ...item, type: 'personal' })) || [];
        setPersonalResults(personalsWithType);

        // Fetch materials
        const { data: materialData, error: materialError } = await supabase
          .from('material')
          .select('id, name, details')
          .ilike('name', `%${searchTerm}%`);

        if (materialError) throw materialError;

        // Adding type 'material' to each item
        const materialsWithType = materialData?.map(item => ({ ...item, type: 'material' })) || [];
        setMaterialResults(materialsWithType);

        // Log the fetched data for debugging
        console.log('Fetched Events:', eventsWithType);
        console.log('Fetched Locals:', localsWithType);
        console.log('Fetched Personals:', personalsWithType);
        console.log('Fetched Materials:', materialsWithType);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleItemPress = (item: { id: string; type: string }) => {
    console.log('Item pressed:', item); // Log the entire item

    if (item.type === 'event') {
      navigation.navigate('EventDetails', { eventId: item.id });
    } else if (item.type === 'local') {
      navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
    } else if (item.type === 'personal') {
      navigation.navigate('PersonalDetail', { personalId: item.id });
    } else if (item.type === 'material') {
      navigation.navigate('MaterialDetails', { materialId: item.id });
    } else {
      console.warn('Unknown item type:', item.type); // Log the unknown type
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
          data={searchForServices ? [...personalResults, ...localResults, ...materialResults] : eventResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.itemContainer}>
              {item.media && item.media.length > 0 && item.media[0].url ? (
                <Image source={{ uri: item.media[0].url }} style={styles.itemImage} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.details}</Text>
                {item.priceperhour && <Text style={styles.itemPrice}>${item.priceperhour}/hr</Text>}
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
  itemPrice: {
    fontSize: 16,
    color: 'green',
  },
});

export default SearchResultsScreen;
