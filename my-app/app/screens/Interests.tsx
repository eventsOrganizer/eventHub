import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type RootStackParamList = {
  Interests: { onComplete: () => void };
  Home: undefined;
};

type InterestsProps = StackScreenProps<RootStackParamList, 'Interests'>;

const Interests: React.FC<InterestsProps> = ({ navigation, route }) => {
  const { onComplete } = route.params;
  const { setSelectedInterests } = useUser();
  const [localSelectedInterests, setLocalSelectedInterests] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Console log when component mounts
  useEffect(() => {
    console.log('Interests Component Mounted');
  }, []);

  // Track local interests changes
  useEffect(() => {
    console.log('Local Selected Interests Updated:', localSelectedInterests);
  }, [localSelectedInterests]);

  const screenWidth = Dimensions.get('window').width;
  const itemsPerRow = 3; // Changed to 3 items per row for better visibility
  const itemSize = (screenWidth - 48) / itemsPerRow;

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    console.log('Fetching Subcategories...');
    setLoading(true);
    
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Error fetching subcategories:', error);
      Alert.alert('Error', error.message);
    } else {
      console.log('Subcategories fetched:', data);
      const subcatsWithIcons = (data || []).map(subcat => ({
        ...subcat,
        icon: getIconForSubcategory(subcat.name)
      }));
      setSubcategories(subcatsWithIcons);
    }
    setLoading(false);
  };

  const getIconForSubcategory = (name: string) => {
    const iconMap: { [key: string]: string } = {
      'Music': 'music',
      'Sports': 'basketball',
      'Food': 'food',
      'Art': 'palette',
      'Technology': 'laptop',
      'Gaming': 'gamepad-variant',
      'Books': 'book-open-variant',
      'Movies': 'movie',
      'Travel': 'airplane',
      'Fashion': 'hanger',
    };
    return iconMap[name] || 'star';
  };

  const toggleInterest = (id: string) => {
    console.log('Toggling interest:', id);
    setLocalSelectedInterests((prev) => {
      const newInterests = prev.includes(id) 
        ? prev.filter((interest) => interest !== id) 
        : [...prev, id];
      console.log('New local interests:', newInterests);
      return newInterests;
    });
  };

  const handleFinish = () => {
    if (localSelectedInterests.length === 0) {
      console.log('No interests selected');
      Alert.alert('Select Interests', 'Please select at least one interest to continue.');
      return;
    }
    
    console.log('Saving interests to context:', localSelectedInterests);
    setSelectedInterests(localSelectedInterests);
    console.log('Navigation to Home...');
    onComplete();
    navigation.navigate('Home');
  };

  const renderInterestItem = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <TouchableOpacity
      style={[
        tw`m-2 rounded-2xl overflow-hidden`,
        { width: itemSize, height: itemSize * 1.2 }, // Made items taller
      ]}
      onPress={() => toggleInterest(item.id)}
    >
      <BlurView intensity={90} tint="light" style={tw`absolute inset-0`} />
      <LinearGradient
        colors={localSelectedInterests.includes(item.id)
          ? ['#4B0082', '#0066CC']
          : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)']}
        style={tw`flex-1 p-4 items-center justify-center`}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={36} // Increased icon size
          color={localSelectedInterests.includes(item.id) ? 'white' : '#666'}
        />
        <Text
          style={[
            tw`text-center text-base font-bold mt-3`, // Increased spacing
            localSelectedInterests.includes(item.id) ? tw`text-white` : tw`text-gray-800`,
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {localSelectedInterests.includes(item.id) && (
          <View style={tw`absolute top-2 right-2 bg-white rounded-full p-1`}>
            <Ionicons name="checkmark-circle" size={24} color="#4B0082" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-4xl font-bold mb-3 text-gray-800`}>
          What interests you?
        </Text>
        <Text style={tw`text-xl mb-6 text-gray-600`}>
          Select your favorite topics to personalize your experience
        </Text>
        
        <FlatList
          data={subcategories}
          keyExtractor={(item) => item.id}
          renderItem={renderInterestItem}
          numColumns={itemsPerRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-24`}
        />
        
        <View style={tw`absolute bottom-8 left-4 right-4`}>
          <TouchableOpacity
            style={tw`rounded-full overflow-hidden ${localSelectedInterests.length === 0 ? 'opacity-50' : ''}`}
            onPress={handleFinish}
            disabled={localSelectedInterests.length === 0}
          >
            <LinearGradient
              colors={['#4B0082', '#0066CC']}
              style={tw`px-8 py-4 rounded-full`}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={tw`text-white font-bold text-xl text-center`}>
                Continue ({localSelectedInterests.length} selected)
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Interests;