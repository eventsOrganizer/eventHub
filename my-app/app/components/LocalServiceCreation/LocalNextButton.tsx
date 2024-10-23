import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface LocalNextButtonProps {
  onPress: () => void;
  disabled: boolean;
  isLastStep: boolean;
}

const LocalNextButton: React.FC<LocalNextButtonProps> = ({ onPress, disabled, isLastStep }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{isLastStep ? 'Complete Setup' : 'Continue'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3b5998', // Adjusted color for local theme
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LocalNextButton;