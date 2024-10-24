import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

interface PriceStepProps {
  formData: any;
  setFormData: (data: any) => void;
  setIsButtonDisabled: (disabled: boolean) => void; // Added to control the button state
}

const PriceStep: React.FC<PriceStepProps> = ({ formData, setFormData, setIsButtonDisabled }) => {
  const [price, setPrice] = useState<number>(formData.price ? parseFloat(formData.price) : 0);
  const [percentage, setPercentage] = useState<number>(0);

  const priceCheckpoints = [50, 100, 200, 500, 1000, 3000];

  // Check if the form is valid for the next button to be enabled
  useEffect(() => {
    const isFormValid = percentage > 0; // Disable if percentage is 0
    setIsButtonDisabled(!isFormValid); // Disable if the form is not valid
  }, [percentage, setIsButtonDisabled]);

  const handlePriceChange = (value: number) => {
    setPrice(value);
    setFormData({ ...formData, price: value.toString() });
  };

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
  };

  return (
    <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.container}>
      <Text style={styles.label}>Price Per Hour</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={priceCheckpoints[0]}
          maximumValue={priceCheckpoints[priceCheckpoints.length - 1]}
          step={1}
          value={price}
          onValueChange={handlePriceChange}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#ddd"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={price.toString()}
          onChangeText={(text) => handlePriceChange(Number(text))}
        />
      </View>
      <Text style={styles.priceText}>${price}</Text>

      <Text style={styles.label}>Percentage</Text>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={percentage}
          onValueChange={handlePercentageChange}
          minimumTrackTintColor="#4A90E2"
          maximumTrackTintColor="#ddd"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={percentage.toString()}
          onChangeText={(text) => handlePercentageChange(Number(text))}
        />
      </View>
      <Text style={styles.percentageText}>{percentage}%</Text>

      <Text style={styles.resultText}>Calculated Amount: ${(price * (percentage / 100)).toFixed(2)}</Text>
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
    marginBottom: 10,
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    width: '80%',
    height: 40,
  },
  input: {
    width: '15%',
    height: 40,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    textAlign: 'center',
  },
  priceText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  percentageText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
  },
});

export default PriceStep;
