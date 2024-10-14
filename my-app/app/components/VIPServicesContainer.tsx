import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface VIPServicesContainerProps {
  children: React.ReactNode;
}

const VIPServicesContainer: React.FC<VIPServicesContainerProps> = ({ children }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { transform: [{ translateY }] }]}>
      <LinearGradient
  colors={['white', 'grey']}
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
    marginVertical: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 15,
  },
});

export default VIPServicesContainer;