import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CreateLocalServiceStep1: undefined;
  CreatePersonalServiceStep1: undefined;
  MaterialServiceCreation: undefined;
};

type ServiceSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ServiceSelection: React.FC = () => {
  const navigation = useNavigation<ServiceSelectionNavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView

  const localScaleAnimation = new Animated.Value(1);
  const personnelScaleAnimation = new Animated.Value(1);
  const materialScaleAnimation = new Animated.Value(1);

  const handlePressIn = (scaleAnimation: Animated.Value) => {
    Animated.spring(scaleAnimation, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleAnimation: Animated.Value) => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPress = (cardType: string) => {
    if (cardType === 'Local') {
      navigation.navigate('CreateLocalServiceStack');
    } else if (cardType === 'Personnel') {
      navigation.navigate('CreatePersonalServiceStep1');
    }
    scrollToCard(cardType);
  };

  const scrollToCard = (cardType: string) => {
    const cardIndex = cardType === 'Local' ? 0 : cardType === 'Personnel' ? 1 : 2;
    scrollViewRef.current?.scrollTo({
      x: cardIndex * 220, // Adjust based on card width and margin
      animated: true,
    });
  };

  // Scroll to Local card on component mount
  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: 0, // Start at the Local card position
      animated: false, // No animation for initial load
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Service Type</Text>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        horizontal
        showsHorizontalScrollIndicator={false} // Optional: Hide the scroll indicator
        snapToInterval={220} // Adjust based on card width and margin
        decelerationRate="fast" // Makes snapping smoother
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleCardPress('Local')}
          onPressIn={() => handlePressIn(localScaleAnimation)}
          onPressOut={() => handlePressOut(localScaleAnimation)}
        >
          <Animated.Image
            source={require('../assets/images/locals.png')}
            style={[styles.cardImage, { transform: [{ scale: localScaleAnimation }] }]}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardText}>Local</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleCardPress('Personnel')}
          onPressIn={() => handlePressIn(personnelScaleAnimation)}
          onPressOut={() => handlePressOut(personnelScaleAnimation)}
        >
          <Animated.Image
            source={require('../assets/images/staff.png')}
            style={[styles.cardImage, { transform: [{ scale: personnelScaleAnimation }] }]}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardText}>Personnel</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPressIn={() => handlePressIn(materialScaleAnimation)}
          onPressOut={() => handlePressOut(materialScaleAnimation)}
          onPress={() => handleCardPress('Material')}
        >
          <Animated.Image
            source={require('../assets/images/materials.png')}
            style={[styles.cardImage, { transform: [{ scale: materialScaleAnimation }] }]}
          />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardText}>Material</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 30,
  },
  scrollContainer: {
    flexDirection: 'row', // Change direction to row for horizontal scrolling
    alignItems: 'center',
    paddingVertical: 20, // Added vertical padding for aesthetics
    justifyContent: 'center', // Center the cards in the ScrollView
  },
  card: {
    width: 200, // Set a fixed width for each card
    height: 300, // Increased height of the card
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 10, // Space between cards
    overflow: 'hidden',
    justifyContent: 'center', // Center content vertically
  },
  cardImage: {
    width: '100%',
    height: '80%', // 80% of the card height for the image
    resizeMode: 'cover',
  },
  cardTextContainer: {
    height: '20%', // 20% for the white bar at the bottom
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ServiceSelection;
