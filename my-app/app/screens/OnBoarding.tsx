import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importing icon library
import TestImageComponent from './TestImageComponent';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Discover Unique Spaces',
    description: 'Find and rent the perfect venue for your events, from cozy halls to spacious venues.',
    colors: ['#FF5F00', '#FF0D95'], // Neon orange to neon pink
    image: require('../assets/images/onBoarding1.png'), // Adjust the path as needed
  },
  {
    key: '2',
    title: 'Connect with Professionals',
    description: 'Easily reach out to event crews and service providers to make your event a success.',
    colors: ['#4E00FF', '#A300FF'], // Neon blue to neon purple
    image: require('../assets/images/onBoarding2.png'), // Adjust the path as needed
  },
  {
    key: '3',
    title: 'Plan Your Event Seamlessly',
    description: 'Organize everything from catering to audio-visual setups in one place, hassle-free.',
    colors: ['#0D0DFF', '#FF0D5F'], // Dark blue to dark pink
    image: require('../assets/images/onBoarding3.png'), // Adjust the path as needed
  },
];

// Define props type
interface OnboardingProps {
  navigation: any;
}

const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentIndex === slides.length - 1) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      buttonOpacity.setValue(0);
    }
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      navigation.navigate('Interests', { onFinish: () => console.log('Finished!') });
    }
  };

  const goToInterests = () => {
    navigation.navigate('Interests', { onFinish: () => console.log('Finished!') });
  };

  const renderSlides = () => {
    return slides.map((slide, index) => (
      <View key={slide.key} style={styles.slide}>
        <LinearGradient colors={slide.colors} style={styles.gradientBackground}>
          <View style={styles.contentContainer}>
            <TestImageComponent images={[slide.image]} />
            <View style={styles.textBox}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Buttons Positioned on Each Slide */}
        <View style={styles.buttonRow}>
        <Button 
  onPress={goToInterests} 
  style={styles.skipButton} 
  labelStyle={{ color: '#A00000' }} // Set the text color to neon red
>
  Skip
</Button>
          <Button onPress={scrollToNext} style={styles.arrowButton}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </Button>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {renderSlides()}
      </Animated.ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111', // Dark background to enhance neon colors
  },
  scrollView: {
    flexGrow: 1,
  },
  slide: {
    width: width,
    height: height,
    position: 'relative',
  },
  gradientBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: 20,
    overflow: 'hidden',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  image: {
    width: '80%',
    height: '40%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black for better contrast with neon colors
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '115%',
    position: 'absolute',
    bottom: -8, // Adjust this if needed for positioning
    height: 250, // You can adjust the height as needed
  },
  title: {
    fontSize: 26, // Increased font size for title
    fontWeight: 'bold',
    color: '#FF7E00', // Keep bright orange for visibility
    textAlign: 'center',
    marginBottom: 15, // Increased spacing from description
  },
  description: {
    fontSize: 16, // Increased font size for description
    color: '#FFFFFF', // Changed to white for contrast against dark background
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 30, // Increased margin for spacing
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  dot: {
    width: 10, // Increased dot size for better visibility
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FF7E00',
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },
  buttonRow: {
    position: 'absolute',
    top: 30, // Adjust the top position for buttons
    left: 20, // Skip button on the left
    right: 20, // Arrow button on the right
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Take full width
  },
  skipButton: {
    backgroundColor: 'transparent',
    color: 'green', // Use bright color for the skip button
  },
  arrowButton: {
    backgroundColor: 'transparent', // Keep it transparent
    padding: 10,
    marginLeft: 190, // Adjust margin to decrease space between buttons
  },
});

export default Onboarding;
