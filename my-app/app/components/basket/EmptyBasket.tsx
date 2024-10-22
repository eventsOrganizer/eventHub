import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import LottieView from 'lottie-react-native';

interface EmptyBasketProps {
  onStartShopping: () => void;
}

export const EmptyBasket: React.FC<EmptyBasketProps> = ({ onStartShopping }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/empty-cart.png')}
        style={styles.image}
      />
      <Text style={styles.text}>Your basket is empty</Text>
      <TouchableOpacity style={styles.button} onPress={onStartShopping}>
        <Text style={styles.buttonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
