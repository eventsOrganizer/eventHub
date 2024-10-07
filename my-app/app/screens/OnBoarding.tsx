// app/screens/Onboarding.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to EventHub!',
    description: 'Create and manage your events easily.',
    colors: ['#FF7E00', '#FFCC00'], // Orange to yellow
  },
  {
    key: '2',
    title: 'Step 1',
    description: 'Fill in event details like title, description, and date.',
    colors: ['#FFB300', '#FF9800'], // Bright yellow to orange
  },
  {
    key: '3',
    title: 'Step 2',
    description: 'Invite participants and manage tickets.',
    colors: ['#FF8C00', '#FFC107'], // Vibrant orange to yellow
  },
  {
    key: '4',
    title: 'Get Started!',
    description: 'Let’s create your first event.',
    colors: ['#FF5722', '#FF3D00'], // Red to vibrant orange
  },
];

// Define props type
interface OnboardingProps {
  onNext: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onNext }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const renderSlides = () => {
    return slides.map((slide, index) => (
      <View key={slide.key} style={styles.slide}>
        <LinearGradient colors={slide.colors} style={styles.gradientBackground}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            {index === slides.length - 1 && (
              <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
                <Button mode="contained" onPress={onNext} style={styles.button}>
  Let's Go!
</Button>
              </Animated.View>
            )}
          </View>
        </LinearGradient>
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
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {renderSlides()}
      </Animated.ScrollView>
      <View style={styles.skipContainer}>
        <Button onPress={onNext} style={styles.skipButton}>
          Skip
        </Button>
      </View>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#ffcc00',
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },
  button: {
    width: '100%',
    height: 60, // Large button height
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 40,
  },
  skipContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  skipButton: {
    backgroundColor: 'transparent',
    color: '#007BFF',
  },
});

export default Onboarding;
