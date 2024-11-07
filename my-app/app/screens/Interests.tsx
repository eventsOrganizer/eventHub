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

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const itemsPerRow = 3;
  const itemSpacing = 12;
  const horizontalPadding = 16;
  const itemSize = (screenWidth - (horizontalPadding * 2) - (itemSpacing * (itemsPerRow - 1))) / itemsPerRow;

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subcategory')
      .select('id, name')
      .order('name');
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
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
    setLocalSelectedInterests((prev) => {
      return prev.includes(id) 
        ? prev.filter((interest) => interest !== id) 
        : [...prev, id];
    });
  };

  const handleFinish = () => {
    if (localSelectedInterests.length === 0) {
      Alert.alert('Select Interests', 'Please select at least one interest to continue.');
      return;
    }
    
    setSelectedInterests(localSelectedInterests);
    onComplete();
    navigation.navigate('Home');
  };

  const renderInterestItem = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <TouchableOpacity
      style={[
        tw`rounded-2xl overflow-hidden`,
        {
          width: itemSize,
          height: itemSize,
          marginBottom: itemSpacing,
        }
      ]}
      onPress={() => toggleInterest(item.id)}
    >
      <BlurView intensity={90} tint="light" style={tw`absolute inset-0`} />
      <LinearGradient
        colors={localSelectedInterests.includes(item.id)
          ? ['#4B0082', '#0066CC']
          : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.5)']}
        style={tw`flex-1 justify-center items-center p-2`}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={28}
          color={localSelectedInterests.includes(item.id) ? 'white' : '#666'}
        />
        <Text
          style={[
            tw`text-center font-bold mt-2`,
            {
              fontSize: Math.min(itemSize * 0.12, 14),
              color: localSelectedInterests.includes(item.id) ? 'white' : '#666'
            }
          ]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {localSelectedInterests.includes(item.id) && (
          <View style={tw`absolute top-1 right-1 bg-white rounded-full p-1`}>
            <Ionicons name="checkmark-circle" size={16} color="#4B0082" />
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
      <View style={tw`flex-1 px-4`}>
        <Text style={[tw`font-bold text-gray-800 mb-2`, { fontSize: screenHeight * 0.035 }]}>
          What interests you?
        </Text>
        <Text style={[tw`text-gray-600 mb-4`, { fontSize: screenHeight * 0.02 }]}>
          Select your favorite topics to personalize your experience
        </Text>
        
        <FlatList
          data={subcategories}
          renderItem={renderInterestItem}
          keyExtractor={(item) => item.id}
          numColumns={itemsPerRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-24`}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
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
              <Text style={tw`text-white font-bold text-center text-lg`}>
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