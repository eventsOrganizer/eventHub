import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import StepIndicator from '../../components/MaterialService/StepIndicator';
import SubcategoryStep from '../../components/MaterialService/SubcategoryStep';
import RentOrSaleStep from '../../components/MaterialService/RentOrSaleStep';
import MaterialDetailsStep from '../../components/MaterialService/MaterialDetailsStep';
import PriceStep from '../../components/MaterialService/PriceStep';
import NextButton from '../../components/MaterialService/NextButton';
import BasketIcon from '../../components/MaterialService/BasketIcon';

const MaterialsOnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subcategory: '',
    rentOrSale: '',
    title: '',
    details: '',
    price: '',
    image: null as string | null,
  });

  const steps = ['Subcategory', 'Rent or Sale', 'Material Details', 'Price'];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form and step
    setFormData({
      subcategory: '',
      rentOrSale: '',
      title: '',
      details: '',
      price: '',
      image: null,
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
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StepIndicator currentStep={step} steps={steps} />
      {renderStepContent()}
      <NextButton onPress={handleNext} disabled={false} isLastStep={step === 4} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default MaterialsOnboardingScreen;