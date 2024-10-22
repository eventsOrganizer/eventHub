import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  children: string;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, variant = 'primary', onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, variant === 'primary' ? styles.primaryButton : styles.secondaryButton]} 
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#E5E5EA',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;