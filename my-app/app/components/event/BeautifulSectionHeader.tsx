import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface BeautifulSectionHeaderProps {
  title: string;
  onSeeAllPress: () => void;
}

const BeautifulSectionHeader: React.FC<BeautifulSectionHeaderProps> = ({ title, onSeeAllPress }) => {
  return (
    <LinearGradient
      colors={['#000000', '#333333', '#666666', '#FFFFFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSeeAllPress} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: width,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: '#00FF00',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default BeautifulSectionHeader;