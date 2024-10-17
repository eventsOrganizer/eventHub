import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NextButtonProps {
  onPress: () => void;
  disabled: boolean;
  isLastStep: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onPress, disabled, isLastStep }) => {
  return (
    <TouchableOpacity
      style={[styles.nextButton, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.nextButtonText}>
        {isLastStep ? 'Finish' : 'Next'}
      </Text>
      <MaterialIcons
        name={isLastStep ? 'check' : 'arrow-forward'}
        size={24}
        color="#fff"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default NextButton;