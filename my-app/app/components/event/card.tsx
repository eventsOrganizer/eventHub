import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CardProps {
  title: string;
  icon: React.ReactNode; // Pass any icon component here
  onPress: () => void;
  isSelected: boolean;
}

const Card: React.FC<CardProps> = ({ title, icon, onPress, isSelected }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.card, 
        isSelected && styles.selected, 
        isSelected ? styles.selectedShadow : styles.shadow
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'column', // Stacks icon and text vertically
    alignItems: 'center', // Center the content
    justifyContent: 'center', // Center the content
    width: 100, // Set the desired width
    height: 120, // Set the desired height
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3, // Adds depth in Android
    marginHorizontal: 5, // Add horizontal spacing for scrolling containers
  },
  selected: {
    borderColor: '#5D3FD3', // Primary color to indicate selection
    borderWidth: 2,
  },
  selectedShadow: {
    shadowColor: '#5D3FD3',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5, // Adds a larger shadow when selected
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Regular shadow for unselected cards
  },
  iconContainer: {
    marginBottom: 10, // Space between icon and title
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center', // Center text within the card
    color: '#333',
  },
});

export default Card;
