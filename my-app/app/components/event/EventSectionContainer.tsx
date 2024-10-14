import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface EventSectionContainerProps {
  children: React.ReactNode;
}

const EventSectionContainer: React.FC<EventSectionContainerProps> = ({ children }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { transform: [{ translateY }] }]}>
      <LinearGradient
  colors={[ '#87CEFA', 'white', '#DDA0DD']}
  style={styles.gradient}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
/>
      </Animated.View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: 10,
      borderRadius: 15,
      overflow: 'hidden',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    backgroundContainer: {
      ...StyleSheet.absoluteFillObject,
      height: height * 1.2,
    },
    gradient: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      padding: 10,
    },
  });

export default EventSectionContainer;