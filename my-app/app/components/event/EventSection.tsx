import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import EventCard from './EventCard';
import YourEventCard from './YourEventCard';
import JoinEventButton from './JoinEventButton';
import tw from 'twrnc';

const { height } = Dimensions.get('window');

interface Event {
  id: number;
  name: string;
  description: string;
  privacy: string;
  user_id: string;
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

interface EventSectionProps {
  title: string;
  events: Event[];
  navigation: any;
  onSeeAll: () => void;
  isTopEvents: boolean;
  isLoading?: boolean;
  isForYou?: boolean;
}

const EventSection: React.FC<EventSectionProps> = ({ 
  title, 
  events, 
  navigation, 
  onSeeAll, 
  isTopEvents,
  isLoading = false,
  isForYou = false
}) => {
  if (isLoading) {
    return (
      <View style={tw`h-40 justify-center items-center bg-gray-900/50 rounded-3xl mb-6`}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  if (!events?.length) {
    return null;
  }

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
      { height: isTopEvents || isForYou ? 'auto' : height * 0.8 }
    ]}>
      <BlurView 
        intensity={80} 
        tint="light" 
        style={tw`flex-1 rounded-3xl ${isForYou ? 'bg-purple-900/20' : ''}`}
      >
        <View style={tw`p-4`}>
          <View style={tw`flex-row justify-between items-center mb-4 border-b border-white/30 pb-2`}>
            <Text style={tw`text-2xl font-bold text-white`}>{title}</Text>
            <TouchableOpacity 
              onPress={onSeeAll} 
              style={tw`flex-row items-center bg-white/20 py-2 px-3 rounded-full`}
            >
              <Text style={tw`text-white text-sm font-medium mr-1`}>See All</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal={isTopEvents || isForYou}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isTopEvents || isForYou ? tw`pb-2` : tw`pb-4`}
          />
        </View>
      </BlurView>
    </View>
  );
};

export default EventSection;