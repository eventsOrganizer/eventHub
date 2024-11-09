import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import EventCard from './EventCard';
import YourEventCard from './YourEventCard';
import JoinEventButton from './JoinEventButton';
import tw from 'twrnc';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const { height } = Dimensions.get('window');

interface Availability {
  id: number;
  event_id: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  privacy: string;
  user_id: string;
  availabilities?: Availability[];  // Add this to include the related availability data
  subcategory: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  };
  media?: { url: string }[];
}


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface EventSectionProps {
  title: string;
  events: Event[];
  navigation: NavigationProp;
  onSeeAll?: () => void;
  isTopEvents: boolean;
  isLoading?: boolean;
  isForYou?: boolean;
  isSeeAllPage?: boolean;
  searchTerm?: string;
}

const EventSection: React.FC<EventSectionProps> = ({ 
  title, 
  events, 
  navigation, 
  onSeeAll, 
  isTopEvents,
  isLoading = false,
  isForYou = false,
  isSeeAllPage = false,
  searchTerm = ''
}) => {
  if (isLoading) {
    return (
      <View style={tw`h-40 justify-center items-center bg-gray-900/50 rounded-3xl mb-6`}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  if (!events?.length) {
    return (
      <View style={tw`h-40 justify-center items-center bg-gray-900/50 rounded-3xl mb-6`}>
        <Text style={tw`text-white text-lg`}>No events found</Text>
      </View>
    );
  }

  // Filter events if searchTerm is provided
  const filteredEvents = searchTerm 
    ? events.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : events;

  const renderEventCard = ({ item }: { item: Event }) => {
    const CardComponent = isTopEvents || isForYou ? EventCard : YourEventCard;
    
    return (
      <CardComponent 
        key={item.id}
        event={item}
        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
      >
        <JoinEventButton
          eventId={item.id}
          privacy={item.privacy}
          organizerId={item.user_id}
          onJoinSuccess={() => {}}
          onLeaveSuccess={() => {}}
        />
      </CardComponent>
    );
  };

  return (
    <View style={[
      tw`mb-6 rounded-3xl overflow-hidden`, 
      { 
        height: isSeeAllPage ? 'auto' : (isTopEvents || isForYou ? 'auto' : height * 0.8),
        flex: isSeeAllPage ? 1 : undefined
      }
    ]}>
      <BlurView 
        intensity={80} 
        tint="light" 
        style={tw`flex-1 rounded-3xl ${isForYou ? 'bg-purple-900/20' : ''}`}
      >
        <View style={tw`p-4`}>
          {!isSeeAllPage && (
            <View style={tw`flex-row justify-between items-center mb-4 border-b border-[#BAE6FD] pb-2`}>
              <Text style={[tw`text-lg font-bold mb-2`, { color: '#0066CC' }]}>{title}</Text>
              {onSeeAll && (
                <TouchableOpacity 
                  onPress={onSeeAll} 
                  style={tw`flex-row items-center bg-white/20 py-2 px-3 rounded-full`}
                >
                  <Text style={tw`text-black text-sm font-medium mr-1`}>See All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#000000" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <FlatList
            data={filteredEvents}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal={!isSeeAllPage && (isTopEvents || isForYou)}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            numColumns={isSeeAllPage ? 1 : undefined}
            contentContainerStyle={
              isSeeAllPage 
                ? tw`pb-20` 
                : (isTopEvents || isForYou ? tw`pb-2` : tw`pb-4`)
            }
          />
        </View>
      </BlurView>
    </View>
  );
};

export default EventSection;