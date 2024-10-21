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
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

type RootStackParamList = {
  Interests: { onComplete: () => void };
  Home: undefined;
};

type InterestsProps = StackScreenProps<RootStackParamList, 'Interests'>;

const Interests: React.FC<InterestsProps> = ({ navigation, route }) => {
  const { onComplete } = route.params;
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get('window').width;
  const itemsPerRow = 3;
  const itemSize = (screenWidth - 56) / itemsPerRow; // 40 = padding (4 * 2) + gap between items (4 * 3)

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subcategory').select('id, name');
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSubcategories(data || []);
    }
    setLoading(false);
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((interest) => interest !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    if (selectedInterests.length === 0) {
      Alert.alert('Select Interests', 'Please select at least one interest to continue.');
      return;
    }
    onComplete();
    navigation.navigate('Home');
  };

  const renderInterestItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[
        tw`m-1 rounded-xl overflow-hidden justify-center items-center`,
        { width: itemSize, height: itemSize },
      ]}
      onPress={() => toggleInterest(item.id)}
    >
      <BlurView intensity={80} tint="light" style={tw`absolute inset-0`} />
      <LinearGradient
        colors={selectedInterests.includes(item.id)
          ? ['#00BFFF', '#1E90FF']
          : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)']}
        style={tw`absolute inset-0`}
      />
      {selectedInterests.includes(item.id) && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color="white"
          style={tw`absolute top-2 right-2`}
        />
      )}
      <Text
        style={[
          tw`text-center text-sm font-semibold px-2`,
          selectedInterests.includes(item.id) ? tw`text-white` : tw`text-gray-800`,
        ]}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F0F8FF', '#E6E6FA', '#F0FFFF']}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 p-4`}>
          <Text style={tw`text-gray-800 text-3xl font-bold mb-2`}>Discover Your Interests</Text>
          <Text style={tw`text-gray-600 text-lg mb-4`}>Select the topics that excite you!</Text>
          
          <FlatList
            data={subcategories}
            keyExtractor={(item) => item.id}
            renderItem={renderInterestItem}
            numColumns={itemsPerRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={tw`pb-20`}
            key={`grid-${itemsPerRow}`}
          />
          
          <View style={tw`absolute bottom-8 left-4 right-4`}>
            <TouchableOpacity
              style={tw`p-1 rounded-full overflow-hidden ${selectedInterests.length === 0 ? 'opacity-50' : ''}`}
              onPress={handleFinish}
              disabled={selectedInterests.length === 0}
            >
              <LinearGradient
                colors={['#4CAF50', '#45B649']}
                style={tw`px-8 py-4 rounded-full`}
              >
                <Text style={tw`text-white font-bold text-lg text-center`}>
                  Continue ({selectedInterests.length} selected)
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Interests;