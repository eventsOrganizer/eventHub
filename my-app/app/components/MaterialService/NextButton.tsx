import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NextButtonProps {
  onPress: () => void;
  disabled: boolean;
  isLastStep: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onPress, disabled, isLastStep }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{isLastStep ? 'Finish' : 'Next'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4c669f',
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

export default NextButton;