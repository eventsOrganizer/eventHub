import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import SuggestToFriendButton from '../suggestions/SuggestToFriendButton';
import { theme } from '../../../lib/theme';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

interface LocalServiceCardProps {
  item: {
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
  onPress: () => void;
}

const LocalServiceCard: React.FC<LocalServiceCardProps> = ({ item, onPress }) => {
  if (!item) return null;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={[
        tw`overflow-hidden rounded-2xl`,
        {
          width: width * 0.45,
          height: width * 0.6,
          marginRight: theme.spacing.sm,
          marginBottom: theme.spacing.sm,
        }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={tw`flex-1`}
      >
        <ImageBackground
          source={{ uri: item.media?.[0]?.url }}
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
                  {item.subcategory?.name || 'Service'}
                </Text>
              </View>
              <View style={styles.suggestButtonContainer}>
                <SuggestToFriendButton itemId={item.id} category={item.subcategory.category} />
              </View>
            </View>
            <View style={tw`p-3 space-y-2`}>
              <Text style={[
                tw`text-lg font-bold`,
                { color: theme.colors.primary }
              ]}>
                {item.name}
              </Text>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={[
                  tw`text-base font-semibold`,
                  { color: theme.colors.accent }
                ]}>
                  ${item.priceperhour}/hr
                </Text>
                <View style={tw`flex-row items-center`}>
                  {item.reviews && (
                    <View style={tw`flex-row items-center mr-2`}>
                      <Feather name="star" size={12} color={theme.colors.primary} />
                      <Text style={[tw`ml-1`, { color: theme.colors.primary }]}>{item.reviews}</Text>
                    </View>
                  )}
                  {item.likes && (
                    <View style={tw`flex-row items-center`}>
                      <Feather name="heart" size={12} color={theme.colors.primary} />
                      <Text style={[tw`ml-1`, { color: theme.colors.primary }]}>{item.likes}</Text>
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


export default LocalServiceCard;