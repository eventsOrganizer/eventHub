import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Heart, ShoppingCart, Calendar, Star, DollarSign } from 'lucide-react-native';
import { Material } from '../../navigation/types';

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
  const actionButtonColor = isRental ? '#4A90E2' : '#7E57C2';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.cardContainer}
    >
      <TouchableOpacity 
        style={styles.cardFrame}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.cardImage}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageOverlay}
        />

        <BlurView intensity={Platform.OS === 'ios' ? 60 : 100} style={styles.topBar}>
          <View style={[styles.badge, { backgroundColor: actionButtonColor }]}>
            {isRental ? (
              <Calendar size={14} color="white" />
            ) : (
              <ShoppingCart size={14} color={actionButtonColor} />
            )}
            <Text style={styles.topBarText}>
              {isRental ? 'RENT' : 'SALE'}
            </Text>
          </View>
        </BlurView>

        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={2}>
            {material.name}
          </Text>

          <View style={styles.cardInfoRow}>
            <View style={styles.priceContainer}>
              <DollarSign size={14} color={actionButtonColor} />
              <Text style={[styles.priceText, { color: actionButtonColor }]}>
                {isRental ? `${material.price_per_hour}/hr` : material.price}
              </Text>
            </View>

            <View style={styles.ratingContainer}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>
                {material.average_rating?.toFixed(1) || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.wishlistButton]}
          onPress={() => onToggleWishlist(material.id)}
        >
          <Heart
            size={18}
            color={isWishlisted ? '#FF6B6B' : '#ffffff'}
            fill={isWishlisted ? '#FF6B6B' : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.basketButton, { backgroundColor: actionButtonColor }]}
          onPress={() => onAddToBasket(material)}
        >
          {isRental ? (
            <Calendar size={18} color="#ffffff" />
          ) : (
            <ShoppingCart size={18} color="#ffffff" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.45,
    height: height * 0.32,
    margin: 8,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardFrame: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  topBarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 4,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  actionButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right: 12,
  },
  wishlistButton: {
    top: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  basketButton: {
    top: 60,
  },
});

export default MaterialCard;