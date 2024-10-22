import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Material } from '../navigation/types';
import { useToast } from "../hooks/use-toast"
import { AnimatedForBasket } from '../components/MaterialService/AnimatedForBasket';
import { BasketItem } from '../components/basket/BasketItem';
import { EmptyBasket } from '../components/basket/EmptyBasket';

type BasketScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Basket'>;

const BasketScreen = () => {
  const navigation = useNavigation<BasketScreenNavigationProp>();
  const route = useRoute();
  const [basket, setBasket] = useState<Material[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (route.params && 'basket' in route.params) {
      setBasket(route.params.basket as Material[]);
    }
  }, [route.params]);

  const handleCheckout = () => {
    toast({
      title: "Checkout Initiated",
      description: "Your order is being processed.",
    });
    // Implement checkout logic here
  };

  const removeItem = (id: string) => {
    setBasket(prevBasket => prevBasket.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your basket.",
      variant: "destructive",
    });
  };

  const renderItem = ({ item }: { item: Material }) => (
    <BasketItem
      item={item}
      onRemove={() => removeItem(item.id)}
    />
  );

  const totalPrice = basket.reduce((sum, item) => sum + (item.sell_or_rent === 'sell' ? item.price : item.price_per_hour), 0);

  return (
    <AnimatedForBasket>
      <View style={styles.container}>
        <Text style={styles.title}> Basket</Text>
        {basket.length > 0 ? (
          <>
            <FlatList
              data={basket}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
            <View style={styles.summaryContainer}>
              <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EmptyBasket onStartShopping={() => navigation.goBack()} />
        )}
      </View>
    </AnimatedForBasket>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    flexGrow: 1,
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BasketScreen;
