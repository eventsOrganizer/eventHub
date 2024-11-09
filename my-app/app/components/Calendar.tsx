import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../UserContext';
import { format } from 'date-fns';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

interface CalendarItem {
  id: number;
  name: string;
  date: string;
  start: string;
  end: string;
  imageUrl: string;
  details: string;
  type: 'event' | 'local' | 'personal';
  subcategory?: {
    name: string;
  };
}

const CalendarComponent = () => {
  const { userId } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchAllUserItems = async () => {
    if (!userId) {
      console.log('❌ No user found');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch events
      const { data: eventData, error: eventError } = await supabase
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

      // Transform events
      const eventItems: CalendarItem[] = eventData?.flatMap(userEvent => {
        const eventData = userEvent.event;
        if (!eventData?.availability) return [];

        return eventData.availability.map(avail => ({
          id: eventData.id,
          name: eventData.name,
          date: avail.date,
          start: avail.start,
          end: avail.end,
          imageUrl: eventData.media?.[0]?.url || '',
          details: eventData.details || '',
          type: 'event',
          subcategory: eventData.subcategory
        }));
      }) || [];

      // Fetch accepted requests for local services
      const { data: localData, error: localError } = await supabase
        .from('request')
        .select(`
          id,
          availability_id,
          local:local_id (
            id,
            name,
            details,
            subcategory (name),
            media (url)
          ),
          availability!inner (
            date,
            start,
            end
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'accepted')
        .not('local_id', 'is', null);

      // Transform local services
      const localItems: CalendarItem[] = localData?.map(item => ({
        id: item.local.id,
        name: item.local.name,
        date: item.availability.date,
        start: item.availability.start,
        end: item.availability.end,
        imageUrl: item.local.media?.[0]?.url || '',
        details: item.local.details || '',
        type: 'local',
        subcategory: item.local.subcategory
      })) || [];

      // Fetch accepted requests for personal services
      const { data: personalData, error: personalError } = await supabase
        .from('request')
        .select(`
          id,
          availability_id,
          personal:personal_id (
            id,
            name,
            details,
            subcategory (name),
            media (url)
          ),
          availability!inner (
            date,
            start,
            end
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'accepted')
        .not('personal_id', 'is', null);

      if (personalError) {
        console.error('Personal services error:', personalError);
        throw personalError;
      }

      // Transform personal services
      const personalItems: CalendarItem[] = personalData?.map(item => ({
        id: item.personal.id,
        name: item.personal.name,
        date: item.availability.date,
        start: item.availability.start,
        end: item.availability.end,
        imageUrl: item.personal.media?.[0]?.url || '',
        details: item.personal.details || '',
        type: 'personal',
        subcategory: item.personal.subcategory
      })) || [];

      // Combine all items
      const allItems = [...eventItems, ...localItems, ...personalItems];
      console.log('All calendar items:', allItems);
      setCalendarItems(allItems);

    } catch (error) {
      console.error('❌ Error fetching calendar items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUserItems();
  }, [userId, currentMonth]);

  const currentMonthItems = calendarItems.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === currentMonth.getMonth() &&
           itemDate.getFullYear() === currentMonth.getFullYear();
  });

  // Rest of the component remains the same
  // ... (Calendar rendering and FlatList)

  const getItemColor = (type: string) => {
    switch (type) {
      case 'event': return '#4CAF50';
      case 'local': return '#2196F3';
      case 'personal': return '#9C27B0';
      default: return '#4CAF50';
    }
  };

  const renderCalendarItem = ({ item }: { item: CalendarItem }) => (
    <TouchableOpacity style={tw`flex-row bg-white rounded-xl p-4 mb-3 shadow-sm`}>
      <View style={tw`relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100`}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={tw`w-full h-full`}
            onError={(e) => console.log('🖼️ Image error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={[
            tw`w-full h-full items-center justify-center`,
            { backgroundColor: getItemColor(item.type) }
          ]}>
            <Ionicons name="calendar" size={24} color="white" />
          </View>
        )}
      </View>
      
      <View style={tw`flex-1 ml-4`}>
        <Text style={tw`text-lg font-semibold text-gray-800`}>{item.name}</Text>
        <Text style={tw`text-sm text-gray-500 mt-1`}>
          {`${format(new Date(`2000-01-01T${item.start}`), 'h:mm a')} - ${format(new Date(`2000-01-01T${item.end}`), 'h:mm a')}`}
        </Text>
        <View style={tw`flex-row items-center mt-1`}>
          <Text style={[
            tw`text-xs px-2 py-1 rounded-full mr-2`,
            { backgroundColor: getItemColor(item.type) + '20', color: getItemColor(item.type) }
          ]}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          {item.subcategory?.name && (
            <Text style={tw`text-xs text-indigo-600`}>{item.subcategory.name}</Text>
          )}
        </View>
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
        markedDates={calendarItems.reduce((acc, item) => {
          acc[item.date] = {
            customStyles: {
              container: {
                backgroundColor: selectedDate === item.date ? '#4F46E5' : getItemColor(item.type),
                borderRadius: 20,
                borderWidth: 1,
                borderColor: selectedDate === item.date ? '#4F46E5' : getItemColor(item.type)
              },
              text: {
                color: 'white',
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
        data={currentMonthItems}
        keyExtractor={item => `${item.type}-${item.id}-${item.date}`}
        renderItem={renderCalendarItem}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-8`}>
            <Text style={tw`text-gray-500 text-lg`}>
              {isLoading ? 'Loading items...' : 'No items this month'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default CalendarComponent;