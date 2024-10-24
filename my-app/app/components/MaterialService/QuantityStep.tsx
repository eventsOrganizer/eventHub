import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import NextButton from './NextButton';

interface QuantityStepProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  isLastStep: boolean;
}

const QuantityStep: React.FC<QuantityStepProps> = ({ formData, setFormData, onNext, isLastStep }) => {
  const incrementQuantity = () => {
    setFormData({ ...formData, quantity: String(Number(formData.quantity) + 1) });
  };

  const decrementQuantity = () => {
    if (Number(formData.quantity) > 1) {
      setFormData({ ...formData, quantity: String(Number(formData.quantity) - 1) });
    }
  };

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Quantity</Text>
      <View style={styles.quantityContainer}>
        <Button mode="contained" onPress={decrementQuantity} style={styles.button}>
          -
        </Button>
        <Text style={styles.quantityText}>{formData.quantity}</Text>
        <Button mode="contained" onPress={incrementQuantity} style={styles.button}>
          +
        </Button>
      </View>
      <NextButton onPress={onNext} disabled={false} isLastStep={isLastStep} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    width: 50,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#fff',
  },
});

export default QuantityStep;
