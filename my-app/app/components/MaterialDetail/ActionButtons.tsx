import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Heart } from 'lucide-react-native';
import { Material } from '../../navigation/types';

interface ActionButtonsProps {
  material: Material;
  onAddToBasket: (material: Material) => void;
  onToggleWishlist: (materialId: string) => void;
  isWishlisted: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  material,
  onAddToBasket,
  onToggleWishlist,
  isWishlisted,
}) => {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => onAddToBasket(material)}
        icon={material.sell_or_rent === 'sell' ? 'cart' : 'calendar'}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        color="#4A90E2"
      >
        {material.sell_or_rent === 'sell' ? 'Add to Cart' : 'Request Rental'}
      </Button>
      <Button
        mode="outlined"
        onPress={() => onToggleWishlist(material.id)}
        icon={({ size, color }) => (
          <Heart size={size} color={color} fill={isWishlisted ? color : 'none'} />
        )}
        style={styles.wishlistButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        color="#4A90E2"
      >
        {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  button: {
    marginBottom: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  wishlistButton: {
    borderRadius: 8,
    borderColor: '#4A90E2',
  },
});

export default ActionButtons;