import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import StepIndicator from '../../components/MaterialService/StepIndicator';
import SubcategoryStep from '../../components/MaterialService/SubcategoryStep';
import RentOrSaleStep from '../../components/MaterialService/RentOrSaleStep';
import MaterialDetailsStep from '../../components/MaterialService/MaterialDetailsStep';
import PriceStep from '../../components/MaterialService/PriceStep';
import QuantityStep from '../../components/MaterialService/QuantityStep';
import AvailabilityStep from '../../components/MaterialService/AvailabilityStep';
import NextButton from '../../components/MaterialService/NextButton';

const MaterialsOnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subcategory: '',
    rentOrSale: '',
    title: '',
    details: '',
    price: '',
    quantity: '1',
    image: null as string | null,
    availableDates: {} as { [date: string]: boolean },
  });

  const getSteps = () => {
    const baseSteps = ['Subcategory', 'Rent or Sale', 'Material Details', 'Price', 'Quantity'];
    return formData.rentOrSale === 'rent' ? [...baseSteps, 'Availability'] : baseSteps;
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
      text2: 'Your product has been created successfully!',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });

    // Reset form and step
    setFormData({
      subcategory: '',
      rentOrSale: '',
      title: '',
      details: '',
      price: '',
      quantity: '1',
      image: null,
      availableDates: {},
    });
    setStep(1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <SubcategoryStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <RentOrSaleStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <MaterialDetailsStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <PriceStep formData={formData} setFormData={setFormData} />;
      case 5:
        return <QuantityStep formData={formData} setFormData={setFormData} />;
      case 6:
        return formData.rentOrSale === 'rent' ? <AvailabilityStep formData={formData} setFormData={setFormData} /> : null;
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
        <StepIndicator currentStep={step} steps={steps} />
        {renderStepContent()}
        <NextButton onPress={handleNext} disabled={false} isLastStep={step === steps.length} />
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

export default MaterialsOnboardingScreen;