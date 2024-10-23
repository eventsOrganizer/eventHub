import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import LocalStepIndicator from './LocalStepIndicator';
import LocalSubcategoryStep from './LocalSubcategoryStep';
import LocalDetailsStep from './LocalDetailStep';
import LocalPriceStep from './LocalPriceStep';
import LocalAvailabilityStep from './LocalAvailabilityStep';
import LocalNextButton from './LocalNextButton';
import LocalServiceDateManager from './LocalServiceDateManager';

type FormData = {
  subcategory: string;
  title: string;
  details: string;
  price: string;
  image: string | null;
  availableDates: { [date: string]: boolean };
  requiresAvailability: boolean;
};

const LocalOnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    subcategory: '',
    title: '',
    details: '',
    price: '',
    image: null as string | null,
    availableDates: {} as { [date: string]: boolean },
    requiresAvailability: false,
  });

  const getSteps = () => {
    return ['Subcategory', 'Local Details', 'Price', 'Availability', 'Service Date Management'];
  };

  const steps = getSteps();

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Your local service has been created successfully!',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });

    // Reset form and step
    setFormData({
      subcategory: '',
      title: '',
      details: '',
      price: '',
      image: null,
      availableDates: {},
      requiresAvailability: false,
    });
    setStep(1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <LocalSubcategoryStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <LocalDetailsStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <LocalPriceStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <LocalAvailabilityStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <LocalServiceDateManager formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <LocalStepIndicator currentStep={step} steps={steps} />
        {renderStepContent()}
        <LocalNextButton onPress={handleNext} disabled={false} isLastStep={step === steps.length} />
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
  },
});

export default LocalOnboardingScreen;
