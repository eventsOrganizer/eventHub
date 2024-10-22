import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Material } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

interface MaterialCardProps {
  material: Material;
  onAddToBasket: (material: Material) => void;
  onToggleWishlist: (materialId: string) => void;
  isWishlisted: boolean;
  onPress: () => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onAddToBasket,
  onToggleWishlist,
  isWishlisted,
  onPress,
}) => {
  if (!material) {
    return null;
  }

  const imageUrl = material.media && material.media.length > 0
    ? material.media[0].url
    : 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardFrame}>
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>{material.sell_or_rent === 'rent' ? 'Rent' : 'Sale'}</Text>
        </View>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.cardImage} 
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={2}>{material.name}</Text>
          <View style={styles.cardInfoRow}>
            <Ionicons name="cash-outline" size={14} color="#4A90E2" />
            <Text style={styles.cardInfoText}>
              ${material.sell_or_rent === 'rent' ? `${material.price_per_hour}/hr` : material.price}
            </Text>
          </View>
          <View style={styles.reviewLikeRow}>
            <View style={styles.reviewContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.reviewText}>{material.average_rating?.toFixed(1) || 'N/A'}</Text>
            </View>
            <TouchableOpacity onPress={() => onToggleWishlist(material.id)} style={styles.likeContainer}>
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={12}
                color={isWishlisted ? '#FF6B6B' : '#4A90E2'}
              />
              <Text style={styles.likeText}>Wishlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.basketButton}
        onPress={() => onAddToBasket(material)}
      >
        <Ionicons
          name={material.sell_or_rent === 'sell' ? 'cart' : 'calendar'}
          size={20}
          color="white"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.45,
    height: height * 0.32,
    marginRight: 10,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardFrame: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  topBar: {
    height: '8%',
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '62%',
    resizeMode: 'cover',
  },
  cardContent: {
    height: '30%',
    padding: 8,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardInfoText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewLikeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewText: {
    fontSize: 10,
    color: '#333333',
    marginLeft: 2,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 10,
    color: '#4A90E2',
    marginLeft: 2,
  },
  basketButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    padding: 8,
  },
});

export default MaterialCard;