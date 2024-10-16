import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface EventSectionContainerProps {
  children: React.ReactNode;
}

const EventSectionContainer: React.FC<EventSectionContainerProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[ 'white']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  content: {
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default EventSectionContainer;