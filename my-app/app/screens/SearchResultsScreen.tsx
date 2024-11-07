import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { supabase } from '../services/supabaseClient';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

type RootStackParamList = {
  SearchResults: { initialSearchTerm: string };
  AdvancedSearch: { searchForServices: boolean; searchTerm: string };
  EventDetails: { eventId: string };
  LocalServiceDetails: { localServiceId: string };
  PersonalDetails: { personalId: string };
  MaterialDetails: { materialId: string };
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
        const { data: eventData, error: eventError } = await supabase
          .from('event')
          .select('id, name, details, media (url)')
          .ilike('name', `%${searchTerm}%`);
        if (eventError) throw eventError;

        const eventsWithType = eventData?.map(item => ({ ...item, type: 'event' })) || [];
        setEventResults(eventsWithType);

        const { data: localData, error: localError } = await supabase
          .from('local')
          .select('id, name, details, priceperhour, media (url)')
          .ilike('name', `%${searchTerm}%`);
        if (localError) throw localError;

        const localsWithType = localData?.map(item => ({ ...item, type: 'local' })) || [];
        setLocalResults(localsWithType);

        const { data: personalData, error: personalError } = await supabase
          .from('personal')
          .select('id, name, details, priceperhour, media (url)')
          .ilike('name', `%${searchTerm}%`);
        if (personalError) throw personalError;

        const personalsWithType = personalData?.map(item => ({ ...item, type: 'personal' })) || [];
        setPersonalResults(personalsWithType);

        const { data: materialData, error: materialError } = await supabase
          .from('material')
          .select('id, name, details, price, media (url)')
          .ilike('name', `%${searchTerm}%`);
        if (materialError) throw materialError;

        const materialsWithType = materialData?.map(item => ({ ...item, type: 'material' })) || [];
        setMaterialResults(materialsWithType);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleItemPress = (item: { id: string; type: string }) => {
    switch (item.type) {
      case 'event':
        navigation.navigate('EventDetails', { eventId: item.id });
        break;
      case 'local':
        navigation.navigate('LocalServiceDetails', { localServiceId: item.id });
        break;
      case 'personal':
        navigation.navigate('PersonalDetails', { personalId: item.id });
        break;
      case 'material':
        navigation.navigate('MaterialDetails', { materialId: item.id });
        break;
    }
  };

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={tw`flex-1 p-4 pt-12`}
    >
      <View style={tw`bg-white rounded-lg flex-row items-center px-4 mb-4 shadow-md`}>
        <Ionicons name="search" size={24} color="#666" />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search events and services..."
          style={tw`flex-1 h-12 ml-2`}
          placeholderTextColor="#666"
        />
        {searchTerm !== '' && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Ionicons name="close-circle" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={tw`flex-row justify-between mb-4`}>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`${!searchForServices ? 'bg-blue-600' : 'bg-blue-300'} py-2 px-4 rounded-l-lg`}
            onPress={() => setSearchForServices(false)}
          >
            <Text style={tw`text-white font-semibold`}>Events</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`${searchForServices ? 'bg-blue-600' : 'bg-blue-300'} py-2 px-4 rounded-r-lg`}
            onPress={() => setSearchForServices(true)}
          >
            <Text style={tw`text-white font-semibold`}>Services</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tw`bg-purple-500 py-2 px-4 rounded-lg`}
          onPress={() => navigation.navigate('AdvancedSearchScreen', { 
            searchForServices,
            searchTerm 
          })}
        >
          <Text style={tw`text-white font-semibold`}>Advanced Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={searchForServices ? [...personalResults, ...localResults, ...materialResults] : eventResults}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleItemPress(item)} 
              style={tw`flex-row p-4 bg-white rounded-lg shadow-lg mb-4`}
            >
              {item.media && item.media.length > 0 && item.media[0].url ? (
                <Image 
                  source={{ uri: item.media[0].url }} 
                  style={tw`w-16 h-16 rounded-full mr-4`}
                />
              ) : (
                <View style={tw`w-16 h-16 bg-gray-300 rounded-full mr-4 items-center justify-center`}>
                  <Ionicons 
                    name={
                      item.type === 'event' ? 'calendar' :
                      item.type === 'personal' ? 'person' :
                      item.type === 'local' ? 'business' : 'cube'
                    } 
                    size={24} 
                    color="#666" 
                  />
                </View>
              )}
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>{item.name}</Text>
                <Text style={tw`text-gray-600`}>{item.details}</Text>
                {(item.priceperhour || item.price) && (
                  <Text style={tw`text-blue-500 font-semibold`}>
                    ${item.priceperhour || item.price}
                    {item.type !== 'material' ? '/hr' : ''}
                  </Text>
                )}
                <Text style={tw`text-xs text-gray-500 mt-1 capitalize`}>
                  {item.type}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default SearchResultsScreen;