import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Share } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { theme } from '../../../lib/theme';
import tw from 'twrnc';

interface EventCardProps {
  event: {
    id: number;
    name: string;
    media: { url: string }[];
    type: string;
    details: string;
  };
  onPress: () => void;
  children?: React.ReactNode;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, children }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.name}`,
        title: event.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={[
        tw`overflow-hidden rounded-2xl`,
        {
          height: theme.layout.eventCard.height,
          width: theme.layout.eventCard.hotEventWidth,
          marginRight: theme.layout.eventCard.spacing,
        }
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.95}
        style={tw`flex-1`}
      >
        <ImageBackground
          source={{ uri: event.media[0]?.url }}
          style={tw`flex-1`}
          imageStyle={tw`rounded-2xl`}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={tw`flex-1 justify-between`}
          >
            <View style={tw`flex-row justify-between items-start p-3`}>
              <View style={[
                tw`px-2 py-1 rounded-full`,
                { backgroundColor: `${theme.colors.accent}20` }
              ]}>
                <Text style={[
                  tw`text-xs font-medium`,
                  { color: theme.colors.accent }
                ]}>
                  {event.type}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={handleShare}
                style={[
                  tw`w-8 h-8 rounded-full items-center justify-center`,
                  { backgroundColor: `${theme.colors.accent}20` }
                ]}
              >
                <Feather name="share-2" size={16} color={theme.colors.accent} />
              </TouchableOpacity>
            </View>

            <View style={tw`p-3 space-y-2`}>
              <Text style={[
                tw`text-lg font-bold`,
                { color: theme.colors.primary }
              ]}>
                {event.name}
              </Text>
              
              <Text 
                numberOfLines={2}
                style={[
                  tw`text-sm`,
                  { color: `${theme.colors.primary}CC` }
                ]}
              >
                {event.details}
              </Text>

              <View style={tw`flex-row justify-between items-center mt-2`}>
                {children}
              </View>
            </View>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
    </MotiView>
  );
};

export default EventCard;