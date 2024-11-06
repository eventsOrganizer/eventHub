import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import { format } from 'date-fns';
import tw from 'twrnc';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface Event {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
  imageUrl: string;
  details: string;
  subcategory?: {
    name: string;
  };
}

const CalendarComponent = () => {
  const { userId } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    console.log('🔄 Calendar component mounted or dependencies changed');
    console.log('👤 Current userId:', userId);
    console.log('📅 Current month:', format(currentMonth, 'MMMM yyyy'));
    fetchUserEvents();
  }, [userId, currentMonth]);

  const fetchUserEvents = async () => {
    if (!userId) {
      console.log('❌ No user found');
      return;
    }

    setIsLoading(true);
    console.log('🔍 Fetching events for user:', userId);

    try {
      const { data: userEvents, error: userEventsError } = await supabase
        .from('event_has_user')
        .select(`
          event_id,
          event:event_id (
            id,
            name,
            details,
            subcategory (name),
            media (url),
            availability (date, start, end)
          )
        `)
        .eq('user_id', userId);

      if (userEventsError) {
        console.error('❌ Error fetching events:', userEventsError);
        throw userEventsError;
      }

      console.log('📦 Raw user events:', userEvents);

      if (!userEvents?.length) {
        console.log('ℹ️ No events found');
        setEvents([]);
        return;
      }

      const transformedEvents = userEvents.flatMap(userEvent => {
        const eventData = userEvent.event;
        if (!eventData?.availability) return [];

        console.log('🔄 Processing event:', eventData.name);
        return eventData.availability.map(avail => ({
          id: eventData.id,
          name: eventData.name,
          date: avail.date,
          start: avail.start,
          end: avail.end,
          imageUrl: eventData.media?.[0]?.url || '',
          details: eventData.details,
          subcategory: eventData.subcategory
        }));
      });

      console.log('✅ Transformed events:', transformedEvents);
      setEvents(transformedEvents);

    } catch (error) {
      console.error('❌ Error in fetchUserEvents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth.getMonth() &&
           eventDate.getFullYear() === currentMonth.getFullYear();
  });

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity style={tw`flex-row bg-white rounded-xl p-4 mb-3 shadow-sm`}>
      <View style={tw`relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100`}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={tw`w-full h-full`}
            onError={(e) => console.log('🖼️ Image error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={tw`w-full h-full bg-gray-200 items-center justify-center`}>
            <Ionicons name="calendar" size={24} color="#666" />
          </View>
        )}
      </View>
      
      <View style={tw`flex-1 ml-4`}>
        <Text style={tw`text-lg font-semibold text-gray-800`}>{item.name}</Text>
        <Text style={tw`text-sm text-gray-500 mt-1`}>
          {`${format(new Date(`2000-01-01T${item.start}`), 'h:mm a')} - ${format(new Date(`2000-01-01T${item.end}`), 'h:mm a')}`}
        </Text>
        {item.subcategory?.name && (
          <Text style={tw`text-xs text-indigo-600 mt-1`}>{item.subcategory.name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
<Calendar
  current={currentMonth.toISOString().split('T')[0]}
  onDayPress={day => {
    console.log('📅 Selected day:', day);
    setSelectedDate(day.dateString);
  }}
  onMonthChange={month => {
    console.log('📅 Month changed:', month);
    setCurrentMonth(new Date(month.timestamp));
  }}
  markingType="custom"
  markedDates={events.reduce((acc, event) => {
    acc[event.date] = {
      customStyles: {
        container: {
          backgroundColor: selectedDate === event.date ? '#4F46E5' : '#4CAF50', // Green background for events
          borderRadius: 20,
          borderWidth: 1,
          borderColor: selectedDate === event.date ? '#4F46E5' : '#4CAF50'
        },
        text: {
          color: 'white', // White text for better contrast
          fontWeight: '500'
        }
      }
    };
    return acc;
  }, {} as { [key: string]: any })}
  theme={{
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#2d3748',
    selectedDayBackgroundColor: '#4F46E5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#4F46E5',
    dayTextColor: '#2d3748',
    textDisabledColor: '#a0aec0',
    arrowColor: '#4F46E5',
    monthTextColor: '#1a202c',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 14
  }}
/>

      <FlatList
        data={currentMonthEvents}
        keyExtractor={item => `${item.id}-${item.date}`}
        renderItem={renderEventItem}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-8`}>
            <Text style={tw`text-gray-500 text-lg`}>
              {isLoading ? 'Loading events...' : 'No events this month'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default CalendarComponent;