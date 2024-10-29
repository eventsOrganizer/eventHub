import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { ShoppingBag } from 'lucide-react-native';

interface EmptyBasketProps {
  onStartShopping: () => void;
}

export const EmptyBasket: React.FC<EmptyBasketProps> = ({ onStartShopping }) => {
  return (
    <View style={styles.container}>
      <ShoppingBag size={64} color="#ccc" />
      <Text style={styles.title}>Your basket is empty</Text>
      <Text style={styles.subtitle}>Add items to start shopping</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});