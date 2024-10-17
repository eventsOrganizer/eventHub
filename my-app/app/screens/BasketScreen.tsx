import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Material } from '../navigation/types';

type BasketScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Basket'>;

const BasketScreen = () => {
  const navigation = useNavigation<BasketScreenNavigationProp>();
  const route = useRoute();
  const { basket } = route.params as { basket: Material[] };

  const handleCheckout = (item: Material) => {
    if (item.sell_or_rent === 'sell') {
      Alert.alert('Success', 'Item added to cart for purchase.');
    } else {
      Alert.alert('Rental Request', 'A request has been sent to the owner for approval.');
    }
  };

  const renderItem = ({ item }: { item: Material }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>
        {item.sell_or_rent === 'sell' ? `$${item.price}` : `$${item.price_per_hour}/hr`}
      </Text>
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => handleCheckout(item)}
      >
        <Text style={styles.checkoutButtonText}>
          {item.sell_or_rent === 'sell' ? 'Buy' : 'Request Rental'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Basket</Text>
      {basket.length > 0 ? (
        <FlatList
          data={basket}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyBasket}>Your basket is empty</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 5,
  },
  checkoutButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyBasket: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default BasketScreen;