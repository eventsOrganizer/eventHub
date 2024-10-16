import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface VIPServicesContainerProps {
  children: React.ReactNode;
}

const VIPServicesContainer: React.FC<VIPServicesContainerProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        {React.Children.map(children, (child, index) => (
          <View key={index} style={styles.sectionWrapper}>
            {child}
          </View>
        ))}
          </View>
    </View>
  );
};
            
const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 15,
  },
  sectionWrapper: {
    marginBottom: 20,
  },
});


export default VIPServicesContainer;