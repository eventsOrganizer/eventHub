import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import LocalStepIndicator from './LocalStepIndicator';
import LocalSubcategoryStep from './LocalSubcategoryStep';
import LocalDetailsStep from './LocalDetailStep';
import LocalPriceStep from './LocalPriceStep';
import LocalNextButton from './LocalNextButton';
import LocalServiceDateManager from './LocalServiceDateManager';
import LocalChooseLocation from './LocalChooseLocation';
import LocalFinishedCreation from './LocalFinishedCreation';

type FormData = {
  subcategory: string;
  title: string;
  details: string;
  price: string;
  image: string | null;
  images: string[]; // Initialize images as an empty array
  availableDates: { [date: string]: boolean };
  requiresAvailability: boolean;
  location: { latitude: number; longitude: number } | null;
  interval: string | null;
  startDate: string | null;
  endDate: string | null;
  exceptionDates: string[];
};

const LocalOnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    subcategory: '',
    title: '',
    details: '',
    price: '',
    image: null,
    images: [], // Initialize images as an empty array
    availableDates: {} as { [date: string]: boolean },
    requiresAvailability: false,
    location: null,
    interval: null,
    startDate: null,
    endDate: null,
    exceptionDates: [],
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const getSteps = () => {
    return ['Subcategory', 'Local Details', 'Price', 'Choose Location', 'Service Date Management', 'Review & Confirm'];
  };

  const steps = getSteps();

  const handleNext = () => {
    if (step === 5) {
      setStep(6);
    } else if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    console.log('Form submitted:', formData);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Your local service has been created successfully!',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
    setFormData({
      subcategory: '',
      title: '',
      details: '',
      price: '',
      image: null,
      images: [], // Initialize images as an empty array
      availableDates: {},
      requiresAvailability: false,
      location: null,
      interval: null,
      startDate: null,
      endDate: null,
      exceptionDates: [],
    });
    setStep(1);
  };

  const handleLocationSelected = (location: { latitude: number; longitude: number }) => {
    setFormData((prev) => ({ ...prev, location }));
    setIsButtonDisabled(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <LocalSubcategoryStep 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNext}
            setIsButtonDisabled={setIsButtonDisabled}
          />
        );
      case 2:
        return (
          <LocalDetailsStep 
            formData={formData} 
            setFormData={setFormData} 
            setIsButtonDisabled={setIsButtonDisabled}
          />
        );
      case 3:
        return (
          <LocalPriceStep 
            formData={formData} 
            setFormData={setFormData} 
            setIsButtonDisabled={setIsButtonDisabled}
          />
        );
      case 4:
        return (
          <LocalChooseLocation 
            onLocationSelected={handleLocationSelected}
            setIsButtonDisabled={setIsButtonDisabled}
          />
        );
      case 5:
        return (
          <LocalServiceDateManager 
            formData={formData} 
            setFormData={setFormData} 
            setIsButtonDisabled={setIsButtonDisabled}
          />
        );
      case 6:
        return <LocalFinishedCreation formData={formData} onConfirm={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <LocalStepIndicator currentStep={step} steps={steps} />
        {renderStepContent()}
        {/* Render LocalNextButton only if the step is greater than 1 */}
        {step > 1 && (
          <LocalNextButton onPress={handleNext} disabled={isButtonDisabled} isLastStep={step === steps.length} />
        )}
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { padding: 20 },
});

export default LocalOnboardingScreen;
