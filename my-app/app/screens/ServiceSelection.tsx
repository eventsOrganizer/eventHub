import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  CreateLocalServiceStep1: undefined;
  CreatePersonalServiceStep1: undefined;
  MaterialServiceCreation: undefined;
};

type ServiceSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window'); // Get the screen width
const cardWidth = width * 0.8; // Set card width to 80% of screen width

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
    } else if (cardType === 'Material') {
      navigation.navigate('MaterialServiceCreation');
    }
    scrollToCard(cardType);
  };

  const scrollToCard = (cardType: string) => {
    const cardIndex = cardType === 'Local' ? 0 : cardType === 'Personnel' ? 1 : 2;
    scrollViewRef.current?.scrollTo({
      x: cardIndex * cardWidth, // Adjust based on card width
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
        snapToInterval={cardWidth} // Adjust based on card width
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
            <Text style={styles.cardText}>Venues</Text>
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
            <Text style={styles.cardText}>Crew</Text>
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
    backgroundColor: '#001F3F', // Dark background color similar to HomeScreen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', // White text for contrast
    textAlign: 'center',
    marginTop: 30,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    justifyContent: 'center',
  },
  card: {
    width: cardWidth,
    height: '100%', // Full-screen height
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent card background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%', // Cover the full card
    resizeMode: 'cover', // Ensures the image covers the whole card
  },
  cardTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background for text
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // White text for better visibility
  },
});

export default ServiceSelection;
