import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Calendar, Heart, ShoppingCart } from 'lucide-react-native';
import { Material } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionButtonsProps {
  material: Material;
  onAddToBasket: (material: Material) => void;
  onToggleWishlist: (materialId: string) => void;
  isWishlisted: boolean;
  theme: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  material,
  onAddToBasket,
  onToggleWishlist,
  isWishlisted,
  theme,
}) => {
  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.9)', 'white']}
      style={styles.container}
    >
      <Button
        mode="contained"
        onPress={() => onAddToBasket(material)}
        icon={({ size }) => 
          material.sell_or_rent === 'rent' 
            ? <Calendar size={size} color="white" />
            : <ShoppingCart size={size} color="white" />
        }
        style={[styles.mainButton, { backgroundColor: theme.primary }]}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        {material.sell_or_rent === 'rent' ? 'Request Rental' : 'Add to Cart'}
      </Button>
      <Button
        mode="outlined"
        onPress={() => onToggleWishlist(material.id)}
        icon={({ size, color }) => (
          <Heart
            size={size}
            color={color}
            fill={isWishlisted ? color : 'none'}
          />
        )}
        style={[styles.wishlistButton, { borderColor: theme.primary }]}
        contentStyle={styles.buttonContent}
        labelStyle={[styles.wishlistButtonLabel, { color: theme.primary }]}
      >
        {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
      </Button>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  mainButton: {
    marginBottom: 8,
    borderRadius: 12,
  },
  wishlistButton: {
    borderRadius: 12,
    borderWidth: 2,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  wishlistButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ActionButtons;