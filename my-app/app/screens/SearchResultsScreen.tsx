import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { supabase } from '../services/supabaseClient';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SearchResults: { initialSearchTerm: string };
  EventDetails: { eventId: string };
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
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() === '') return;
      setLoading(true);
      
      const { data: eventData, error: eventError } = await supabase
        .from('event')
        .select('id, name, details')
        .ilike('name', `%${searchTerm}%`);

      if (eventError) {
        console.error('Error fetching data:', eventError);
      } else {
        setResults(eventData?.map(item => ({ ...item, type: 'event' })) || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [searchTerm]);

  const handleItemPress = (item: { id: string, type: string }) => {
    if (item.type === 'event') {
      navigation.navigate('EventDetails', { eventId: item.id });
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
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={results}
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