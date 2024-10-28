import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FilterButtonProps {
  onPress: () => void;
  isSelected: boolean;
  icon: string;
  label: string;
}

export const FilterButton = ({ onPress, isSelected, icon, label }: FilterButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <MotiView
        animate={{
          scale: isSelected ? 1.1 : 1,
          backgroundColor: isSelected ? '#4CAF50' : 'transparent',
        }}
        transition={{ type: 'timing', duration: 150 }}
        style={styles.buttonContent}
      >
        <Icon 
          name={icon} 
          size={24} 
          color={isSelected ? '#FFFFFF' : '#000000'} 
        />
        <Text style={[
          styles.label,
          isSelected && styles.selectedLabel
        ]}>
          {label}
        </Text>
      </MotiView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
  },
  buttonContent: {
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#000000',
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});