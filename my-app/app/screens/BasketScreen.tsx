import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, FlatList, FlatListProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInDown,
  withTiming,
  useAnimatedStyle,
  withSequence,
  useAnimatedProps
} from 'react-native-reanimated';
import { useBasket } from '../components/basket/BasketContext';
import { useUser } from '../UserContext';
import { useToast } from "../hooks/use-toast";
import { BasketItem } from '../components/basket/BasketItem';
import { EmptyBasket } from '../components/basket/EmptyBasket';
import { AuthRequiredModal } from '../components/Auth/AuthRequiredModal';
import { BasketHeader } from '../components/basket/BasketHeader';
import { BasketSummary } from '../components/basket/BasketSummary';
import { Material } from '../navigation/types';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<Material>>(FlatList);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const BasketScreen = () => {
  const navigation = useNavigation();
  const { basketItems, removeFromBasket } = useBasket();
  const { isAuthenticated } = useUser();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(0.15, { duration: 300 })
    ),
  }));

  const handleAction = useCallback((item: Material) => {
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
  }, [isAuthenticated, toast]);

  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      setAuthMessage('Please sign in to complete your purchase');
      setShowAuthModal(true);
      return;
    }
    toast({
      title: "Checkout Initiated",
      description: "Proceeding to payment...",
    });
  }, [isAuthenticated, toast, navigation]);

  const renderItem = useCallback(({ item, index }: { item: Material; index: number }) => (
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
  ), [handleAction, navigation, removeFromBasket]);

  const totalPrice = basketItems.reduce((sum, item) => 
    sum + (item.sell_or_rent === 'sell' ? item.price : item.price_per_hour), 0
  );

  return (
    <View style={styles.container}>
      <AnimatedLinearGradient
        colors={['#F0F7FF', '#E1EFFF', '#D6E8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        entering={FadeIn}
      />
      
      <Animated.View style={[styles.backgroundPattern, backgroundStyle]}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.circle, styles.circle4]} />
        <View style={[styles.line, styles.line1]} />
        <View style={[styles.line, styles.line2]} />
        <View style={[styles.dot, styles.dot1]} />
        <View style={[styles.dot, styles.dot2]} />
        <View style={[styles.dot, styles.dot3]} />
      </Animated.View>
      
      <BasketHeader itemCount={basketItems.length} />
      
      {basketItems.length > 0 ? (
        <View style={styles.contentContainer}>
          <AnimatedFlatList
            data={basketItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          
          <BasketSummary 
            totalPrice={totalPrice}
            onCheckout={handleCheckout}
          />
        </View>
      ) : (
        <EmptyBasket onStartShopping={() => navigation.goBack()} />
      )}

      <AuthRequiredModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message={authMessage}
        onSignIn={() => {
          setShowAuthModal(false);
          navigation.navigate('Signin');
        }}
        onSignUp={() => {
          setShowAuthModal(false);
          navigation.navigate('Signup');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  circle1: {
    width: 250,
    height: 250,
    top: -100,
    right: -50,
    transform: [{ scale: 1.2 }],
  },
  circle2: {
    width: 180,
    height: 180,
    bottom: 100,
    left: -90,
    opacity: 0.7,
  },
  circle3: {
    width: 120,
    height: 120,
    bottom: -60,
    right: 40,
    opacity: 0.5,
  },
  circle4: {
    width: 80,
    height: 80,
    top: 150,
    left: 30,
    opacity: 0.3,
  },
  line: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  line1: {
    width: 150,
    height: 3,
    top: '30%',
    left: '20%',
    opacity: 0.4,
  },
  line2: {
    width: 100,
    height: 3,
    bottom: '25%',
    right: '15%',
    opacity: 0.3,
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  dot1: {
    top: '45%',
    left: '10%',
    opacity: 0.5,
  },
  dot2: {
    top: '20%',
    right: '25%',
    opacity: 0.4,
  },
  dot3: {
    bottom: '35%',
    left: '30%',
    opacity: 0.6,
  },
  contentContainer: {
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 280,
  },
  separator: {
    height: 16,
  },
});

export default BasketScreen;
