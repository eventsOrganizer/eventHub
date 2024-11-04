import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Material } from '../../navigation/types';
import { theme } from '../../../lib/theme';
import { MotiView } from 'moti';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

interface MaterialCardProps {
  material: Material;
  onAddToBasket: (material: Material) => void;
  onToggleWishlist: (materialId: string) => void;
  isWishlisted: boolean;
  onPress: () => void;
  index?: number;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onAddToBasket,
  onToggleWishlist,
  isWishlisted,
  onPress,
  index = 0,
}) => {
  if (!material) return null;

  const imageUrl = material.media && material.media.length > 0
    ? material.media[0].url
    : 'https://via.placeholder.com/150';

  const isRental = material.sell_or_rent === 'rent';

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
          margin: theme.spacing.sm,
        }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={tw`flex-1`}
      >
        <ImageBackground
          source={{ uri: imageUrl }}
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
                { backgroundColor: isRental ? `${theme.colors.accent}20` : `${theme.colors.secondary}20` }
              ]}>
                <Text style={[
                  tw`text-xs font-medium`,
                  { color: isRental ? theme.colors.accent : theme.colors.secondary }
                ]}>
                  {isRental ? 'RENT' : 'SALE'}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  tw`w-8 h-8 rounded-full items-center justify-center`,
                  { backgroundColor: `${theme.colors.primary}20` }
                ]}
                onPress={() => onToggleWishlist(material.id)}
              >
                <Feather
                  name="heart"
                  size={16}
                  color={isWishlisted ? theme.colors.error : theme.colors.primary}
                  style={isWishlisted ? tw`fill-current` : {}}
                />
              </TouchableOpacity>
            </View>
            <View style={tw`p-3 space-y-2`}>
              <Text style={[
                tw`text-base font-bold`,
                { color: theme.colors.primary }
              ]}>
                {material.name}
              </Text>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={[
                  tw`text-sm font-semibold`,
                  { color: isRental ? theme.colors.accent : theme.colors.secondary }
                ]}>
                  ${isRental ? `${material.price_per_hour}/hr` : material.price}
                </Text>
                {material.average_rating && (
                  <View style={tw`flex-row items-center`}>
                    <Feather name="star" size={12} color={theme.colors.warning} />
                    <Text style={[tw`ml-1`, { color: theme.colors.primary }]}>
                      {material.average_rating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </BlurView>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          tw`absolute bottom-3 right-3 w-8 h-8 rounded-full items-center justify-center`,
          { backgroundColor: isRental ? theme.colors.accent : theme.colors.secondary }
        ]}
        onPress={() => onAddToBasket(material)}
      >
        <Feather
          name={isRental ? 'calendar' : 'shopping-cart'}
          size={16}
          color={theme.colors.primary}
        />
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

export default MaterialCard;