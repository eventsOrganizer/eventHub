import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { StackNavigationProp, RouteProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import SearchEventFilter from './SearchEventFilter';
import ServiceSearchScreen from './ServiceSearchScreen';
import tw from 'twrnc';

type RootStackParamList = {
  SearchResults: { initialSearchTerm: string };
  AdvancedSearch: { searchForServices: boolean; searchTerm: string };
  EventDetails: { eventId: string };
  LocalServiceDetails: { localServiceId: string };
  PersonalDetails: { personalId: string };
  MaterialDetails: { materialId: string };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AdvancedSearch'>;
  route: RouteProp<RootStackParamList, 'AdvancedSearch'>;
};

interface SearchResult {
  id: string;
  name: string;
  details: string;
  type: 'event' | 'local' | 'personal' | 'material';
  media?: { url: string }[];
  priceperhour?: number;
  price_per_hour?: number;
  price?: number;
  distance?: number;
  startdate?: string;
  enddate?: string;
}

const AdvancedSearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchForServices, setSearchForServices] = useState(route.params?.searchForServices || false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  useEffect(() => {
    setResults([]);
    setIsFilterVisible(true);
  }, [searchForServices]); // Added searchForServices as dependency

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setResults([]);
    setIsFilterVisible(true);
    setRefreshing(false);
  }, []);

  const handleItemPress = useCallback((item: SearchResult) => {
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
  }, [navigation]);

  const handleToggleServices = () => {
    setResults([]);
    setSearchForServices(true);
    setIsFilterVisible(true);
    setError(null);
  };
  
  const handleToggleEvents = () => {
    setResults([]);
    setSearchForServices(false);
    setIsFilterVisible(true);
    setError(null);
  };

  const handleResultsFound = (newResults: SearchResult[]) => {
    if (newResults.length > 0) {
      setResults(newResults);
      setIsFilterVisible(false);
    } else {
      setResults([]);
      setError('No results found');
    }
  };

  const renderToggleButtons = () => (
    <View style={tw`flex-row justify-between mb-4`}>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          style={tw`${!searchForServices ? 'bg-blue-600' : 'bg-blue-300'} py-2 px-4 rounded-l-lg`}
          onPress={handleToggleEvents}
        >
          <Text style={tw`text-white font-semibold`}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`${searchForServices ? 'bg-blue-600' : 'bg-blue-300'} py-2 px-4 rounded-r-lg`}
          onPress={handleToggleServices}
        >
          <Text style={tw`text-white font-semibold`}>Services</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={tw`bg-purple-500 py-2 px-4 rounded-lg`}
        onPress={() => navigation.navigate('SearchResultsScreen', { 
          initialSearchTerm: route.params?.searchTerm || '' 
        })}
      >
        <Text style={tw`text-white font-semibold`}>Simple Search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={tw`flex-1`}
    >
      <View style={tw`flex-1 p-4 pt-12`}>
        {renderToggleButtons()}
        
        {isFilterVisible && (
          <View style={tw`flex-1`}>
            {searchForServices ? (
              <ServiceSearchScreen 
                navigation={navigation}
                onResultsFound={handleResultsFound}
                isVisible={isFilterVisible}
              />
            ) : (
              <SearchEventFilter
                onEventsLoaded={handleResultsFound}
                onClose={() => setIsFilterVisible(false)}
                isVisible={isFilterVisible}
              />
            )}
          </View>
        )}

        {!isFilterVisible && (
          loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <FlatList
              data={results}
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
                    {(item.priceperhour || item.price_per_hour || item.price) && (
                      <Text style={tw`text-blue-500 font-semibold`}>
                        ${item.priceperhour || item.price_per_hour || item.price}
                        {item.type !== 'material' ? '/hr' : ''}
                      </Text>
                    )}
                    {item.distance && (
                      <Text style={tw`text-xs text-gray-500`}>
                        {item.distance.toFixed(1)} km away
                      </Text>
                    )}
                    <Text style={tw`text-xs text-gray-500 mt-1 capitalize`}>
                      {item.type}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#ffffff"
                />
              }
              ListEmptyComponent={
                <Text style={tw`text-center text-white text-lg mt-4`}>
                  {error || 'No results found'}
                </Text>
              }
            />
          )
        )}
      </View>
    </LinearGradient>
  );
};

export default AdvancedSearchScreen;