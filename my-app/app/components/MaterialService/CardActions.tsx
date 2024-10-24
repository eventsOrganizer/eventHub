import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Heart, ShoppingCart, Calendar } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface CardActionsProps {
  isRental: boolean;
  isWishlisted: boolean;
  onAddToBasket: () => void;
  onToggleWishlist: () => void;
}

export const CardActions: React.FC<CardActionsProps> = ({
  isRental,
  isWishlisted,
  onAddToBasket,
  onToggleWishlist,
}) => {
  return (
    <>
      <BlurView intensity={Platform.OS === 'ios' ? 40 : 80} style={[styles.actionButton, styles.wishlistButton]}>
        <TouchableOpacity
          onPress={onToggleWishlist}
          style={[styles.actionInner, isWishlisted && styles.wishlistedButton]}
        >
          <Heart
            size={18}
            color={isWishlisted ? '#FF6B6B' : '#ffffff'}
            fill={isWishlisted ? '#FF6B6B' : 'none'}
          />
        </TouchableOpacity>
      </BlurView>

      <BlurView intensity={Platform.OS === 'ios' ? 40 : 80} style={[styles.actionButton, styles.basketButton]}>
        <TouchableOpacity
          onPress={onAddToBasket}
          style={[styles.actionInner, { backgroundColor: isRental ? '#4A90E2' : '#FF6B6B' }]}
        >
          {isRental ? (
            <Calendar size={18} color="#ffffff" />
          ) : (
            <ShoppingCart size={18} color="#ffffff" />
          )}
        </TouchableOpacity>
      </BlurView>
    </>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    right: 12,
  },
  actionInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  wishlistButton: {
    top: 12,
  },
  wishlistedButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
  },
  basketButton: {
    top: 60,
  },
});