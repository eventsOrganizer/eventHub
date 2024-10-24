import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  const progressAnim = useRef(new Animated.Value(0)).current; // Create an animated value

  useEffect(() => {
    const progress = (currentStep - 1) / (steps.length - 1) * 100; // Calculate progress percentage
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300, // Duration of the animation
      useNativeDriver: false, // Use native driver for better performance
    }).start();
  }, [currentStep, steps.length]);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, { width: progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }) 
        }]} />
      </View>
      <Text style={styles.stepIndicator}>
        Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  stepIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StepIndicator;
