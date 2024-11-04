import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import EventCard from './EventCard';
import YourEventCard from './YourEventCard';
import JoinEventButton from './JoinEventButton';
import { theme } from '../../../lib/theme';
import tw from 'twrnc';

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
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      {isTopEvents ? (
        <EventCard 
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
      )}
    </MotiView>
  );

  return (
    <View style={tw`mb-6 rounded-3xl overflow-hidden bg-white/80`}>
      <BlurView intensity={60} tint="light" style={tw`rounded-3xl`}>
        <View style={tw`flex-1`}>
          <View style={[
            tw`px-6 py-4`,
            {
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.eventBorder,
            }
          ]}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={[
                theme.typography.title,
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
              isTopEvents ? {
                paddingRight: theme.spacing.lg
              } : {
                gap: theme.spacing.md,
                paddingBottom: theme.spacing.xl,
              }
            ]}
            style={tw`flex-1`}
            scrollEnabled={true}
            bounces={true}
            nestedScrollEnabled={true}
          />
        </View>
      </BlurView>
    </View>
  );
};

export default EventSection;