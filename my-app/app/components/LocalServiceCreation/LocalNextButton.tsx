import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.buttonContent}>
        {isLastStep && <Ionicons name="checkmark-circle" size={24} color="#fff" />}
        <Text style={[styles.buttonText, isLastStep && styles.confirmButtonText]}>
          {isLastStep ? 'Complete Setup' : 'Continue'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50', // Same green background as confirm button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row', // Align icon and text in a row
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    marginLeft: 10, // Space between icon and text
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LocalNextButton;
