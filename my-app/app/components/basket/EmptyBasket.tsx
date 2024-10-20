import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

interface EmptyBasketProps {
  onStartShopping: () => void;
}

export const EmptyBasket: React.FC<EmptyBasketProps> = ({ onStartShopping }) => {
  return (
    <View style={styles.emptyContainer}>
      <LottieView
        source={require('../../assets/empty-cart.png')}
        autoPlay
        loop
        style={styles.emptyAnimation}
      />
      <Text style={styles.emptyBasket}>Your basket is empty</Text>
      <TouchableOpacity style={styles.shopButton} onPress={onStartShopping}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyAnimation: {
    width: 200,
    height: 200,
  },
  emptyBasket: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  shopButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});