import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Material } from '../navigation/types';
import { Swipeable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useToast } from "../hooks/use-toast"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { BasketItem } from '../components/basket/BasketItem';
import { EmptyBasket } from '../components/basket/EmptyBasket';

type BasketScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Basket'>;

const BasketScreen = () => {
  const navigation = useNavigation<BasketScreenNavigationProp>();
  const route = useRoute();
  const { basket: initialBasket } = route.params as { basket: Material[] };
  const [basket, setBasket] = useState<Material[]>(initialBasket);
  const { toast } = useToast();

  const handleCheckout = (item: Material) => {
    if (item.sell_or_rent === 'sell') {
      toast({
        title: "Item Added to Cart",
        description: `${item.name} has been added to your cart for purchase.`,
      })
    } else {
      toast({
        title: "Rental Request Sent",
        description: `A request for ${item.name} has been sent to the owner for approval.`,
      })
    }
  };

  const removeItem = (id: string) => {
    setBasket(prevBasket => prevBasket.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your basket.",
      variant: "destructive",
    })
  };

  const renderItem = ({ item }: { item: Material }) => (
    <BasketItem
      item={item}
      onCheckout={handleCheckout}
      onRemove={removeItem}
    />
  );

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Your Basket</Text>
        {basket.length > 0 ? (
          <FlatList
            data={basket}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <EmptyBasket onStartShopping={() => navigation.goBack()} />
        )}
      </View>
    </AnimatedBackground>
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
    paddingBottom: 20,
  },
});

export default BasketScreen;