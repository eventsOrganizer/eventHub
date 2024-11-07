import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';

interface AllEventsCardProps {
  event: {
    id: number;
    name: string;
    description: string;
    details: string;
    media?: { url: string }[];
    subcategory?: {
      name: string;
      category?: {
        name: string;
      };
    };
    availability?: {
      date: string;
      start: string;
      end: string;
    }[];
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
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[
          tw`rounded-xl overflow-hidden bg-white border border-gray-100`,
          {
            width,
            aspectRatio: 0.85,
          }
        ]}
      >

         {/* Title below card */}
     
        <Image
          source={{ uri: event.media?.[0]?.url }}
          style={[tw`w-full`, { aspectRatio: 1.2 }]}
          resizeMode="cover"
        />
         <Text 
        numberOfLines={2}
        style={tw`text-gray-800 font-semibold mt-2 text-sm px-1`}
      >
        {event.name}
      </Text>
        
        <View style={tw`p-3`}>
          {/* Date */}
          <Text style={tw`text-gray-600 text-xs mb-2`}>
            {event.availability?.[0]?.date 
              ? formatDate(event.availability[0].date)
              : 'Date not set'}
          </Text>

          {/* Category Tag */}
          <View style={tw`flex-row mb-2`}>
            <Text style={tw`text-gray-500 text-xs`}>
              {event.subcategory?.category?.name} • {event.subcategory?.name}
            </Text>
          </View>

          {/* Details */}
          <Text 
            numberOfLines={2} 
            style={tw`text-gray-600 text-xs mb-2`}
          >
            {truncateText(event.details || '', 30)}
          </Text>

          {/* Badges */}
          <View style={tw`flex-row mt-auto`}>
            {isTopEvents && (
              <View style={tw`bg-red-50 rounded-full px-2 py-1 mr-1`}>
                <Text style={tw`text-red-600 text-xs`}>Hot</Text>
              </View>
            )}
            {isForYou && (
              <View style={tw`bg-blue-50 rounded-full px-2 py-1`}>
                <Text style={tw`text-blue-600 text-xs`}>For You</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
     
    </View>
  );
};

export default AllEventsCard;