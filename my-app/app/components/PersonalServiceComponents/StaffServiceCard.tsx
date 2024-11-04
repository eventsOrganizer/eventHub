import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';
import { theme } from '../../../lib/theme';
import { MotiView } from 'moti';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

interface StaffServiceCardProps {
  service: {
    id: number;
    name: string;
    priceperhour: number;
    media: { url: string }[];
    reviews?: number;
    likes?: number;
    subcategory: {
      category: {
        id: number;
        name: string;
        type: string;
      };
      name: string;
    };
  };
  onPress: (service: any) => void;
}

const StaffServiceCard: React.FC<StaffServiceCardProps> = ({ service, onPress }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={[
        tw`overflow-hidden rounded-2xl`,
        {
          width: width * 0.35,
          height: width * 0.5,
          marginRight: theme.spacing.sm,
          marginBottom: theme.spacing.md,
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(service)}
        activeOpacity={0.95}
        style={tw`flex-1`}
      >
        <ImageBackground
          source={{ uri: service.media[0]?.url }}
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
                { backgroundColor: `${theme.colors.secondary}20` }
              ]}>
                <Text style={[
                  tw`text-xs font-medium`,
                  { color: theme.colors.primary }
                ]}>
                  Crew
                </Text>
              </View>
              <View style={styles.suggestButtonContainer}>
                <SuggestToFriendButton itemId={service.id} category={service.subcategory.category} />
              </View>
            </View>
            <View style={tw`p-3 space-y-2`}>
              <Text style={[
                tw`text-base font-bold`,
                { color: theme.colors.primary }
              ]}>
                {service.name}
              </Text>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={[
                  tw`text-sm font-semibold`,
                  { color: theme.colors.accent }
                ]}>
                  ${service.priceperhour}/hr
                </Text>
                <View style={tw`flex-row items-center`}>
                  {service.reviews !== undefined && (
                    <View style={tw`flex-row items-center mr-2`}>
                      <Feather name="star" size={12} color={theme.colors.primary} />
                      <Text style={[tw`ml-1`, { color: theme.colors.primary }]}>{service.reviews}</Text>
                    </View>
                  )}
                  {service.likes !== undefined && (
                    <View style={tw`flex-row items-center`}>
                      <Feather name="heart" size={12} color={theme.colors.primary} />
                      <Text style={[tw`ml-1`, { color: theme.colors.primary }]}>{service.likes}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  suggestButtonContainer: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    zIndex: 1,
  },
});

export default StaffServiceCard;
