import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Calendar, Heart } from 'lucide-react-native';
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
        icon={({ size }) => <Calendar size={size} color="white" />}
        style={styles.requestRentalButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        Request Rental
      </Button>
      <Button
        mode="outlined"
        onPress={() => onToggleWishlist(material.id)}
        icon={({ size, color }) => (
          <Heart size={size} color={color} fill={isWishlisted ? color : 'none'} />
        )}
        style={styles.wishlistButton}
        contentStyle={styles.buttonContent}
        labelStyle={styles.wishlistButtonLabel}
      >
        {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
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
  requestRentalButton: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#7E57C2',
  },
  wishlistButton: {
    borderRadius: 8,
    borderColor: '#7E57C2',
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
    color: '#7E57C2',
  },
});

export default ActionButtons;