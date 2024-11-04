import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import tw from 'twrnc';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
  import { useUser } from '../../../UserContext';

type InterestsListRouteProp = RouteProp<RootStackParamList, 'InterestsList'>;

interface Interest {
  id: number;
  subcategory: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
}

const InterestsList = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const route = useRoute<InterestsListRouteProp>();
  const navigation = useNavigation();
  const { userId } = useUser(); // Get userId from context instead of route params

  useEffect(() => {
    if (userId) { // Add check for userId
      fetchInterests();
    }
  }, [userId]);

  const fetchInterests = async () => {
    if (!userId) return; // Add safety check

    try {
      const { data, error } = await supabase
        .from('interest')
        .select(`
          id,
          subcategory:subcategory_id (
            id,
            name,
            category (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      
      if (data) {
        setInterests(data);
      }
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
      style={tw`flex-1`}
    >
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`flex-row items-center p-4`}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={tw`mr-4`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white text-xl font-bold`}>Your Interests</Text>
        </View>

        <BlurView intensity={80} tint="dark" style={tw`flex-1 mx-4 rounded-3xl overflow-hidden`}>
          <FlatList
            data={interests}
            contentContainerStyle={tw`p-4`}
            renderItem={({ item }) => (
              <View style={tw`bg-white/20 p-4 rounded-xl mb-3`}>
                <Text style={tw`text-white font-semibold mb-1`}>
                  {item.subcategory.category.name}
                </Text>
                <Text style={tw`text-white/80`}>
                  {item.subcategory.name}
                </Text>
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <View style={tw`flex-1 justify-center items-center p-4`}>
                <Text style={tw`text-white text-center`}>
                  No interests added yet. Add some interests to personalize your experience!
                </Text>
              </View>
            }
          />
        </BlurView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default InterestsList;