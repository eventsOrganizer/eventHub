import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

type RootStackParamList = {
  Interests: { onComplete: () => void };
  Home: undefined;
};

type InterestsProps = StackScreenProps<RootStackParamList, 'Interests'>;

const Interests: React.FC<InterestsProps> = ({ navigation, route }) => {
  const { onComplete } = route.params;
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategory')
        .select('id, name');

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setSubcategories(data || []);
      }
    };

    fetchSubcategories();
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((interest) => interest !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onComplete();
    navigation.navigate('Home'); // Navigate to HomeScreen
  };

  const renderInterestItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[
        tw`m-2 p-3 rounded-full relative`, // Add relative positioning
        selectedInterests.includes(item.id)
          ? tw`bg-[#8B00FF]`  // Neon purple for selected
          : tw`bg-transparent`,  // Transparent for non-selected
        styles.cardShadow,
      ]}
      onPress={() => toggleInterest(item.id)}
    >
      {/* Checkmark icon for selected interests */}
      {selectedInterests.includes(item.id) && (
        <Ionicons
          name="checkmark-circle" // You can choose other icons as well
          size={24}
          color="white"
          style={tw`absolute top-[-10px] right-[-10px]`} // Position the icon partially outside the button
        />
      )}
      <Text
        style={[
          tw`text-center text-sm font-semibold`, // Smaller text size
          selectedInterests.includes(item.id) ? tw`text-black` : tw`text-white`,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail" // Truncate with an ellipsis if too long
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-900 justify-center items-center p-4`}>
      {/* Neon-like gradient background */}
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(75,0,130,0.6)', 'rgba(138,43,226,0.3)']} // Dark to neon gradient
        style={tw`absolute inset-0`}
      />
      <Text style={tw`text-white text-2xl font-bold mb-4`}>Select Your Interests:</Text>
      <FlatList
        data={subcategories}
        keyExtractor={(item) => item.id}
        renderItem={renderInterestItem}
        numColumns={3}
        columnWrapperStyle={tw`justify-center`}
        contentContainerStyle={tw`w-full`}
      />
      {/* Neon-like finish button */}
      <TouchableOpacity style={tw`mt-5 p-4 rounded-md`} onPress={handleFinish}>
        <LinearGradient
          colors={['#FF00FF', '#FF4500']} // Neon pink to orange gradient
          style={tw`p-4 rounded-md`}
        >
          <Text style={tw`text-white font-bold text-center`}>Finish</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Slightly stronger shadow for a neon effect
    shadowRadius: 5,
    elevation: 3,
    width: Dimensions.get('window').width / 3.5,
  },
};

export default Interests;
