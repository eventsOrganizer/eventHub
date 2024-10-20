import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import EventCard from './EventCard';
import YourEventCard from './YourEventCard';
import JoinEventButton from './JoinEventButton';
import tw from 'twrnc';

const { height } = Dimensions.get('window');

interface EventSectionProps {
  title: string;
  events: Array<any>;
  navigation: any;
  onSeeAll: () => void;
  isTopEvents: boolean;
}

const EventSection: React.FC<EventSectionProps> = ({ title, events, navigation, onSeeAll, isTopEvents }) => {
  const renderEventCard = ({ item }: { item: any }) => (
    isTopEvents ? (
      <EventCard 
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
      </EventCard>
    ) : (
      <YourEventCard 
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
      </YourEventCard>
    )
  );

  return (
    <View style={[tw`mb-6 rounded-3xl overflow-hidden`, { height: isTopEvents ? 'auto' : height * 0.8 }]}>
      <BlurView intensity={80} tint="light" style={tw`flex-1 rounded-3xl`}>
        <View style={tw`p-4`}>
          <View style={tw`flex-row justify-between items-center mb-4 border-b border-white/30 pb-2`}>
            <Text style={tw`text-2xl font-bold text-white`}>{title}</Text>
            <TouchableOpacity onPress={onSeeAll} style={tw`flex-row items-center bg-white/20 py-2 px-3 rounded-full`}>
              <Text style={tw`text-white text-sm font-medium mr-1`}>See All</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal={isTopEvents}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={isTopEvents ? tw`pb-2` : tw`pb-4`}
          />
        </View>
      </BlurView>
    </View>
  );
};

export default EventSection;