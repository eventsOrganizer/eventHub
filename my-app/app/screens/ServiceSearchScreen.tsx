import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../services/supabaseClient';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface Service {
  id: string;
  name: string;
  details: string;
  type: 'personal' | 'local' | 'material';
  priceperhour?: number;
  price?: number;
  price_per_hour?: number;
  sell_or_rent?: 'sell' | 'rent';
  subcategory: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  media: { url: string }[];
  startdate?: string;
  enddate?: string;
}

type ServiceSearchScreenProps = {
  navigation: any;
  onResultsFound: (results: Service[]) => void;
};

const ServiceSearchScreen: React.FC<ServiceSearchScreenProps> = ({ navigation, onResultsFound }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Service[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  
  // Filter states
  const [serviceType, setServiceType] = useState<'personal' | 'local' | 'material'>('personal');
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [name, setName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [sellOrRent, setSellOrRent] = useState<'sell' | 'rent' | 'all'>('all');

  useEffect(() => {
    fetchSubcategories();
  }, [serviceType]);

  const fetchSubcategories = async () => {
    try {
      const categoryId = serviceType === 'personal' ? 41 : 
                        serviceType === 'local' ? 42 : 43;
      
      const { data, error } = await supabase
        .from('subcategory')
        .select('*')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      if (data) {
        setSubcategories(data);
        setSelectedSubcategory(data[0]?.id || 'all');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const searchServices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from(serviceType)
        .select(`
          id,
          name,
          details,
          ${serviceType === 'material' ? 'price, price_per_hour, sell_or_rent,' : 'priceperhour,'}
          startdate,
          enddate,
          subcategory:subcategory_id (
            id,
            name,
            category:category_id (id, name)
          ),
          media (url)
        `);

      if (name) query = query.ilike('name', `%${name}%`);
      if (selectedSubcategory !== 'all') query = query.eq('subcategory_id', selectedSubcategory);
      if (startDate) query = query.gte('startdate', startDate.toISOString());
      if (endDate) query = query.lte('enddate', endDate.toISOString());
      
      const { data, error } = await query;
      
      if (error) throw error;

      if (data) {
        let results = data.map(item => ({
          ...item,
          type: serviceType,
          price: serviceType === 'material' ? 
            (item.sell_or_rent === 'sell' ? item.price : item.price_per_hour) :
            item.priceperhour
        }));

        if (minPrice || maxPrice) {
          results = results.filter(item => {
            const itemPrice = serviceType === 'material' ? 
              (item.sell_or_rent === 'sell' ? item.price : item.price_per_hour) :
              item.priceperhour;
            
            return (!minPrice || itemPrice >= parseFloat(minPrice)) &&
                   (!maxPrice || itemPrice <= parseFloat(maxPrice));
          });
        }

        if (serviceType === 'material' && sellOrRent !== 'all') {
          results = results.filter(item => item.sell_or_rent === sellOrRent);
        }

        setResults(results);
        if (onResultsFound) onResultsFound(results);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setName('');
    setSelectedSubcategory('all');
    setMinPrice('');
    setMaxPrice('');
    setStartDate(null);
    setEndDate(null);
    setSellOrRent('all');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={tw`flex-1 bg-white mt-20`}>
          <View style={tw`p-4 flex-row justify-between items-center border-b border-gray-200`}>
            <Text style={tw`text-lg font-bold`}>Search Services</Text>
            <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
              <Text style={tw`text-blue-500`}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={tw`p-4`}>
            {/* Service Type */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Service Type</Text>
              <View style={tw`flex-row justify-between`}>
                {['personal', 'local', 'material'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={tw`px-4 py-2 rounded-full ${serviceType === type ? 'bg-blue-500' : 'bg-gray-200'}`}
                    onPress={() => setServiceType(type)}
                  >
                    <Text style={tw`${serviceType === type ? 'text-white' : 'text-gray-700'}`}>
                      {type === 'personal' ? 'Crew' : type === 'local' ? 'Local' : 'Material'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Name */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Name</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-2`}
                value={name}
                onChangeText={setName}
                placeholder="Enter service name"
              />
            </View>

            {/* Subcategory */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Subcategory</Text>
              <Picker
                selectedValue={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
                style={tw`border border-gray-300 rounded-lg`}
              >
                <Picker.Item label="All Subcategories" value="all" />
                {subcategories.map(subcategory => (
                  <Picker.Item 
                    key={subcategory.id}
                    label={subcategory.name}
                    value={subcategory.id.toString()}
                  />
                ))}
              </Picker>
            </View>

            {/* Price Range */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>
                {serviceType === 'material' ? 'Price Range' : 'Price per Hour Range'}
              </Text>
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
              <Text style={tw`text-sm font-medium mb-1`}>Date Range</Text>
              <View style={tw`flex-row justify-between`}>
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

            {/* Sell/Rent Filter for Material Services */}
            {serviceType === 'material' && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium mb-1`}>Sell/Rent</Text>
                <Picker
                  selectedValue={sellOrRent}
                  onValueChange={setSellOrRent}
                  style={tw`border border-gray-300 rounded-lg`}
                >
                  <Picker.Item label="All" value="all" />
                  <Picker.Item label="Sell" value="sell" />
                  <Picker.Item label="Rent" value="rent" />
                </Picker>
              </View>
            )}

            {/* Action Buttons */}
            <View style={tw`flex-row justify-between mt-4`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 p-3 rounded-lg mr-2`}
                onPress={resetFilters}
              >
                <Text style={tw`text-center`}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-500 p-3 rounded-lg`}
                onPress={() => {
                  searchServices();
                  setIsFilterVisible(false);
                }}
              >
                <Text style={tw`text-white text-center`}>Search</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Results */}
      {loading ? (
        <ActivityIndicator style={tw`flex-1`} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`p-4 border-b border-gray-200`}
              onPress={() => {
                const screenMap = {
                  personal: 'PersonalDetails',
                  local: 'LocalServiceDetails',
                  material: 'MaterialDetails'
                };
                navigation.navigate(screenMap[item.type], { 
                  [`${item.type}Id`]: item.id 
                });
              }}
            >
              <View style={tw`flex-row`}>
                {item.media && item.media[0] && (
                  <Image
                    source={{ uri: item.media[0].url }}
                    style={tw`w-20 h-20 rounded-lg mr-4`}
                  />
                )}
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-lg mb-1`}>{item.name}</Text>
                  <Text style={tw`text-gray-600 mb-1`}>{item.details}</Text>
                  <Text style={tw`text-blue-500`}>
                    {item.priceperhour ? `$${item.priceperhour}/hr` : 
                     item.price ? `$${item.price}` : 'Price not available'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ServiceSearchScreen;