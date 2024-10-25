import React, { useState } from 'react';
import { View, StyleSheet, Dimensions,FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useBasket } from '../components/basket/BasketContext';
import { useUser } from '../UserContext';
import { useToast } from "../hooks/use-toast";
import { BasketItem } from '../components/basket/BasketItem';
import { EmptyBasket } from '../components/basket/EmptyBasket';
import { AuthRequiredModal } from '../components/Auth/AuthRequiredModal';
import { BasketHeader } from '../components/basket/BasketHeader';
import { themeColors } from '../utils/themeColors';
import { Material } from '../navigation/types';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const BasketScreen = () => {
  const navigation = useNavigation();
  const { basketItems, removeFromBasket } = useBasket();
  const { isAuthenticated } = useUser();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const handleAction = (item: Material) => {
    if (!isAuthenticated) {
      setAuthMessage(item.sell_or_rent === 'rent'
        ? 'Please sign in to send rental requests' 
        : 'Please sign in to complete your purchase'
      );
      setShowAuthModal(true);
      return;
    }

    if (item.sell_or_rent === 'rent') {
      toast({
        title: "Request Sent",
        description: "Your rental request has been sent to the owner.",
      });
    } else {
      toast({
        title: "Purchase Initiated",
        description: "Proceeding to checkout...",
      });
    }
  };

  const renderItem = ({ item, index }: { item: Material; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.itemContainer}
    >
      <BasketItem
        item={item}
        onRemove={() => removeFromBasket(item.id)}
        onPress={() => navigation.navigate('MaterialDetail', { material: item })}
        onAction={() => handleAction(item)}
      />
    </Animated.View>
  );

  const totalPrice = basketItems.reduce((sum, item) => 
    sum + (item.sell_or_rent === 'sell' ? item.price : item.price_per_hour), 0
  );

 
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={themeColors.rent.background}
        style={StyleSheet.absoluteFill}
      />
      
      <BasketHeader itemCount={basketItems.length} />
      
      {basketItems.length > 0 ? (
        <>
          <AnimatedFlatList
            data={basketItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          
          <BlurView intensity={80} tint="light" style={styles.summaryContainer}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>$0.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </BlurView>
        </>
      ) : (
        <EmptyBasket onStartShopping={() => navigation.goBack()} />
      )}

      <AuthRequiredModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
        onSignIn={() => {
          setShowAuthModal(false);
          navigation.navigate('signIn');
        }}
        onSignUp={() => {
          setShowAuthModal(false);
          navigation.navigate('SignUp');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 200,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  summaryContent: {
    padding: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: themeColors.common.gray,
  },
  summaryValue: {
    fontSize: 16,
    color: themeColors.common.black,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColors.common.black,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: themeColors.rent.primary,
  },
});

export default BasketScreen;

