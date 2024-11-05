import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabaseClient';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../UserContext';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SQUARE_SIZE = (SCREEN_WIDTH - 48) / 3; // 48 = padding (16 * 2) + gaps between squares

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

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

const InterestsList = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigation = useNavigation();
  const { userId } = useUser();

  useEffect(() => {
    if (userId) {
      fetchInterests();
      fetchCategories();
    }
  }, [userId]);

  const fetchInterests = async () => {
    if (!userId) return;

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
      if (data) setInterests(data);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('category')
        .select(`
          id,
          name,
          subcategories:subcategory(id, name)
        `)
        .eq('type', 'event');

      if (categoriesError) throw categoriesError;
      if (categoriesData) setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addInterest = async (subcategoryId: string) => {
    try {
      const { error } = await supabase
        .from('interest')
        .insert([
          { user_id: userId, subcategory_id: subcategoryId }
        ]);

      if (error) throw error;
      fetchInterests();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding interest:', error);
    }
  };

  const deleteInterest = async (interestId: number) => {
    try {
      const { error } = await supabase
        .from('interest')
        .delete()
        .eq('id', interestId);

      if (error) throw error;
      fetchInterests();
    } catch (error) {
      console.error('Error deleting interest:', error);
    }
  };

// ... previous imports and code remain the same ...

const renderInterestGrid = () => (
  <FlatList
    data={interests}
    numColumns={3}
    contentContainerStyle={tw`p-4`}
    columnWrapperStyle={tw`gap-2`} // Changed from justify-between to gap-2
    renderItem={({ item, index }) => (
      <View style={[
        tw`bg-white/20 rounded-xl mb-4 overflow-hidden`,
        { 
          width: SQUARE_SIZE - 8, // Adjusted for gap
          height: SQUARE_SIZE - 8 // Adjusted for gap
        }
      ]}>
        <BlurView intensity={20} tint="dark" style={tw`flex-1 p-2`}>
          <View style={tw`flex-1 justify-between`}>
            <Text style={tw`text-white font-semibold text-xs`} numberOfLines={1}>
              {item.subcategory.category.name}
            </Text>
            <Text style={tw`text-white/80 text-xs`} numberOfLines={2}>
              {item.subcategory.name}
            </Text>
            {isEditMode && (
              <TouchableOpacity 
                onPress={() => deleteInterest(item.id)}
                style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center`}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </View>
    )}
    keyExtractor={item => item.id.toString()}
    ListEmptyComponent={
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-white text-center`}>
          No interests added yet. Tap the + button to add some!
        </Text>
      </View>
    }
  />
);



  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
    >
      <View style={tw`flex-1 bg-black/50`}>
        <BlurView intensity={80} tint="dark" style={tw`mt-auto rounded-t-3xl overflow-hidden`}>
          <SafeAreaView>
            <View style={tw`p-4`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-white text-xl font-bold`}>
                  {selectedCategory ? 'Select Interest' : 'Select Category'}
                </Text>
                <TouchableOpacity onPress={() => {
                  setShowAddModal(false);
                  setSelectedCategory(null);
                }}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {selectedCategory ? (
                <>
                  <TouchableOpacity 
                    style={tw`mb-4`}
                    onPress={() => setSelectedCategory(null)}
                  >
                    <Text style={tw`text-blue-400`}>← Back to Categories</Text>
                  </TouchableOpacity>
                  <FlatList
                    data={categories.find(c => c.id === selectedCategory)?.subcategories}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={tw`bg-white/20 p-4 rounded-xl mb-2`}
                        onPress={() => addInterest(item.id)}
                      >
                        <Text style={tw`text-white font-medium`}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                  />
                </>
              ) : (
                <FlatList
                  data={categories}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={tw`bg-white/20 p-4 rounded-xl mb-2`}
                      onPress={() => setSelectedCategory(item.id)}
                    >
                      <Text style={tw`text-white font-medium`}>{item.name}</Text>
                      <Text style={tw`text-white/60 text-xs mt-1`}>
                        {item.subcategories.length} interests
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item.id}
                />
              )}
            </View>
          </SafeAreaView>
        </BlurView>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6', '#93C5FD']}
      style={tw`flex-1`}
    >
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`flex-row items-center justify-between p-4`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={tw`mr-4`}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white text-xl font-bold`}>Your Interests</Text>
          </View>
          <View style={tw`flex-row`}>
            <TouchableOpacity 
              onPress={() => setIsEditMode(!isEditMode)}
              style={tw`bg-white/20 p-2 rounded-full mr-2`}
            >
              <Ionicons name={isEditMode ? "close" : "pencil"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowAddModal(true)}
              style={tw`bg-white/20 p-2 rounded-full`}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <BlurView intensity={80} tint="dark" style={tw`flex-1 mx-4 rounded-3xl overflow-hidden`}>
          {renderInterestGrid()}
        </BlurView>

        {renderAddModal()}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default InterestsList;