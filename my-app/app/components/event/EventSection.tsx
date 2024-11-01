import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import EventCard from './EventCard';
import YourEventCard from './YourEventCard';
import JoinEventButton from './JoinEventButton';
import { theme } from '../../../lib/theme';
import tw from 'twrnc';

const { height } = Dimensions.get('window');

interface EventSectionProps {
  title: string;
  events: Array<any>;
  navigation: any;
  onSeeAll: () => void;
  isTopEvents: boolean;
}

const EventSection: React.FC<EventSectionProps> = ({ 
  title, 
  events, 
  navigation, 
  onSeeAll, 
  isTopEvents 
}) => {
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
    <View style={[
      tw`mb-6 rounded-3xl overflow-hidden`,
      { height: isTopEvents ? 'auto' : height * 0.7 } // Reduced height for better proportions
    ]}>
      <BlurView 
        intensity={60} 
        tint="light" 
        style={[
          tw`flex-1 rounded-3xl`,
          { backgroundColor: theme.colors.cardBg }
        ]}
      >
        <View style={tw`flex-1`}>
          <View style={[
            tw`px-6 py-4`,
            {
              backgroundColor: theme.colors.overlay,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.eventBorder,
            }
          ]}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={[
                tw`text-xl font-bold`,
                { color: theme.colors.cardTitle }
              ]}>
                {title}
              </Text>
              <TouchableOpacity 
                onPress={onSeeAll} 
                style={[
                  tw`flex-row items-center py-2 px-4 rounded-full`,
                  { backgroundColor: `${theme.colors.accent}15` }
                ]}
              >
                <Text style={[
                  tw`mr-2 font-semibold`,
                  { color: theme.colors.accent }
                ]}>
                  See All
                </Text>
                <Ionicons 
                  name="arrow-forward" 
                  size={18} 
                  color={theme.colors.accent}
                />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal={isTopEvents}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              tw`p-4`,
              {
                gap: theme.spacing.md,
              }
            ]}
          />
        </View>
      </BlurView>
    </View>
  );
};

export default EventSection;