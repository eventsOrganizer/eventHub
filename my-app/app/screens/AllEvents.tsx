import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, SafeAreaView, ActivityIndicator, TextInput, Button, Dimensions, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../services/supabaseClient';
import tw from 'twrnc';
import { RootStackParamList } from '../navigation/types';
import { fetchEventsByUserInterests } from '../api/event/interestEventService';
import { useUser } from '../UserContext';
import AllEventsCard from '../components/event/profile/AllEventsCard';
import FilterChip from '../components/common/FilterChip';

type AllEventsRouteProp = RouteProp<RootStackParamList, 'AllEvents'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  category_id: number;
}

const ITEMS_PER_PAGE = 9;
const ITEMS_PER_ROW = 3;
const { width } = Dimensions.get('window');
const CARD_SPACING = 8;
const CONTAINER_PADDING = 16;
const CARD_WIDTH = (width - (2 * CONTAINER_PADDING) - (CARD_SPACING * 2)) / 3;

const AllEvents = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AllEventsRouteProp>();
  const { section } = route.params;
  const { userId, selectedInterests } = useUser();
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  
  // New states for filters
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  // Fetch categories and subcategories
  const loadCategories = async () => {
    const { data: categoriesData } = await supabase
      .from('category')
      .select('*')
      .order('name');
    if (categoriesData) setCategories(categoriesData);
  };

  const loadSubcategories = async (categoryId?: number) => {
    let query = supabase.from('subcategory').select('*').order('name');
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    const { data: subcategoriesData } = await query;
    if (subcategoriesData) setSubcategories(subcategoriesData);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory);
      setSelectedSubcategory(null);
    } else {
      setSubcategories([]);
      setSelectedSubcategory(null);
    }
  }, [selectedCategory]);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      let fetchedEvents: any[] = [];

      switch (section) {
        case 'EVENTS_FOR_YOU':
          fetchedEvents = await fetchEventsByUserInterests(userId, selectedInterests);
          break;
        case 'HOT_EVENTS':
          const { data: hotEvents } = await supabase
            .from('event')
            .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`)
            .order('created_at', { ascending: false });
          fetchedEvents = hotEvents || [];
          break;
        case 'YOUR_EVENTS':
          const { data: allEvents } = await supabase
            .from('event')
            .select(`*, subcategory (id, name, category (id, name)), location (id, longitude, latitude), availability (id, start, end, daysofweek, date), media (url)`);
          fetchedEvents = allEvents || [];
          break;
      }

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  }, [section, userId, selectedInterests]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const getEventRows = useCallback(() => {
    let filteredEvents = events;
    
    // Apply all filters
    filteredEvents = events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = !selectedCategory || 
        event.subcategory?.category?.id === selectedCategory;
        
      const matchesSubcategory = !selectedSubcategory || 
        event.subcategory?.id === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });

    if (section === 'YOUR_EVENTS') {
      const start = page * ITEMS_PER_PAGE;
      filteredEvents = filteredEvents.slice(start, start + ITEMS_PER_PAGE);
    }

    const rows = [];
    for (let i = 0; i < filteredEvents.length; i += ITEMS_PER_ROW) {
      const row = filteredEvents.slice(i, i + ITEMS_PER_ROW);
      while (row.length < ITEMS_PER_ROW) {
        row.push(null);
      }
      rows.push(row);
    }

    return rows;
  }, [events, searchTerm, page, section, selectedCategory, selectedSubcategory]);


  const renderEventRow = ({ item: row }: { item: any[] }) => (
    <View style={[
      tw`flex-row justify-between mb-4`,
      { paddingHorizontal: CONTAINER_PADDING }
    ]}>
      {row.map((event, index) => (
        <View 
          key={event?.id || `empty-${index}`} 
          style={[{
            width: CARD_WIDTH,
            marginHorizontal: CARD_SPACING / 2
          }]}
        >
          {event && (
            <AllEventsCard
              event={event}
              width={CARD_WIDTH}
              isTopEvents={section === 'HOT_EVENTS'}
              isForYou={section === 'EVENTS_FOR_YOU'}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderFilters = () => (
    <View style={tw`px-4 mb-4`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tw`flex-row`}>
          <FilterChip
            label="All Categories"
            selected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
          />
          {categories.map(category => (
            <FilterChip
              key={category.id}
              label={category.name}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </View>
      </ScrollView>
      
      {selectedCategory && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`mt-2`}>
          <View style={tw`flex-row`}>
            <FilterChip
              label="All Subcategories"
              selected={!selectedSubcategory}
              onPress={() => setSelectedSubcategory(null)}
            />
            {subcategories.map(subcategory => (
              <FilterChip
                key={subcategory.id}
                label={subcategory.name}
                selected={selectedSubcategory === subcategory.id}
                onPress={() => setSelectedSubcategory(subcategory.id)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );



  return (
    <SafeAreaView style={tw`flex-1 bg-[#001F3F]`}>
      <View style={tw`flex-1`}>
        <View style={tw`px-4 pt-4`}>
          <TextInput
            style={tw`bg-white/20 p-4 rounded-xl mb-4 text-white`}
            placeholder="Search events..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        {renderFilters()}
        
        <FlatList
          data={getEventRows()}
          keyExtractor={(_, index) => `row-${index}`}
          renderItem={renderEventRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-4`}
          ListFooterComponent={
            section === 'YOUR_EVENTS' && (
              <View style={tw`flex-row justify-between mt-4 px-4`}>
                <Button
                  title="Previous"
                  onPress={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                />
                <Button
                  title="Next"
                  onPress={() => setPage(p => p + 1)}
                  disabled={(page + 1) * ITEMS_PER_PAGE >= events.length}
                />
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AllEvents;