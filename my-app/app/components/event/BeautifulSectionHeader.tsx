import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BeautifulSectionHeaderProps {
  title: string;
  onSeeAllPress: () => void;
}

const BeautifulSectionHeader: React.FC<BeautifulSectionHeaderProps> = ({ title, onSeeAllPress }) => {
  return (
    <LinearGradient
      colors={['#1A1A1A', 'red', '#4D4D4D', '#666666']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSeeAllPress} style={styles.button}>
        <LinearGradient
          colors={['#FF0000', '#CC0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Ionicons name="add" size={24} color="white" />
          <Ionicons name="chevron-forward" size={24} color="white" />
        </LinearGradient>
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
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
});

export default BeautifulSectionHeader;