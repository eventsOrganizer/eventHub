import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

interface AllEventsCardProps {
  event: {
    id: number;
    name: string;
    description: string;
    media?: { url: string }[];
    subcategory?: {
      name: string;
      category?: {
        name: string;
      };
    };
  };
  width: number;
  onPress?: () => void;
  isTopEvents?: boolean;
  isForYou?: boolean;
}

const AllEventsCard: React.FC<AllEventsCardProps> = ({
  event,
  width,
  onPress,
  isTopEvents,
  isForYou
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`rounded-xl overflow-hidden`,
        {
          width,
          aspectRatio: 0.75,
        }
      ]}
    >
      <BlurView intensity={80} tint="dark" style={tw`flex-1`}>
        <Image
          source={{ uri: event.media?.[0]?.url }}
          style={[tw`w-full`, { aspectRatio: 1 }]}
          resizeMode="cover"
        />
        
        <View style={tw`p-2`}>
          {/* Category Tag */}
          <View style={tw`flex-row mb-1`}>
            <Text style={tw`text-white/70 text-xs`}>
              {event.subcategory?.category?.name} • {event.subcategory?.name}
            </Text>
          </View>

          {/* Title */}
          <Text 
            numberOfLines={1} 
            style={tw`text-white font-semibold mb-1`}
          >
            {event.name}
          </Text>

          {/* Description */}
          <Text 
            numberOfLines={2} 
            style={tw`text-white/70 text-xs`}
          >
            {event.description}
          </Text>

          {/* Badges */}
          <View style={tw`flex-row mt-2`}>
            {isTopEvents && (
              <View style={tw`bg-red-500/20 rounded-full px-2 py-1 mr-1`}>
                <Text style={tw`text-red-500 text-xs`}>Hot</Text>
              </View>
            )}
            {isForYou && (
              <View style={tw`bg-blue-500/20 rounded-full px-2 py-1`}>
                <Text style={tw`text-blue-500 text-xs`}>For You</Text>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

export default AllEventsCard;