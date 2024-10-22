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
import ConfirmationStep from '../../components/MaterialService/ConfirmationStep';
import NextButton from '../../components/MaterialService/NextButton';
import { supabase } from '../../services/supabaseClient';

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
    const rentSteps = [...baseSteps, 'Availability'];
    const finalSteps = [...(formData.rentOrSale === 'rent' ? rentSteps : baseSteps), 'Confirmation'];
    return finalSteps;
  };

  const steps = getSteps();

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.subcategory !== '';
      case 2:
        return formData.rentOrSale !== '';
      case 3:
        return formData.title !== '' && formData.details !== '' && formData.image !== null;
      case 4:
        return formData.price !== '';
      case 5:
        return true; // Quantity step is not required
      case 6:
        if (formData.rentOrSale === 'rent') {
          return Object.keys(formData.availableDates).some(date => formData.availableDates[date]);
        }
        return true; // For 'sale' items, this step is skipped
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      Toast.show({
        type: 'error',
        text1: 'Required Fields',
        text2: 'Please fill in all required fields before proceeding.',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
      return;
    }

    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handleConfirm = async () => {
    try {
      // Prepare the data for insertion
      const newMaterial = {
        subcategory_id: formData.subcategory, // Assuming subcategory is the ID
        user_id: 'USER_ID_HERE', // Replace with the actual user ID (you might need to fetch this from your auth system)
        quantity: parseInt(formData.quantity),
        price: formData.rentOrSale === 'sell' ? parseInt(formData.price) : null,
        name: formData.title,
        details: formData.details,
        sell_or_rent: formData.rentOrSale,
        price_per_hour: formData.rentOrSale === 'rent' ? parseInt(formData.price) : null,
        startdate: formData.rentOrSale === 'rent' ? new Date() : null, // Set appropriate start date
        enddate: formData.rentOrSale === 'rent' ? null : null, // Set appropriate end date if applicable
        disabled: false,
      };

      // Insert the new material into the Supabase table
      const { data, error } = await supabase
        .from('material')
        .insert([newMaterial])
        .select();

      if (error) throw error;

      console.log('Material added successfully:', data);

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your material has been submitted successfully!',
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
    } catch (error) {
      console.error('Error submitting material:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: 'There was an error submitting your material. Please try again.',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
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
        return (
          <QuantityStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            isLastStep={step === steps.length - 1}
          />
        );
      case 6:
        return formData.rentOrSale === 'rent' ? (
          <AvailabilityStep formData={formData} setFormData={setFormData} />
        ) : (
          <ConfirmationStep formData={formData} onConfirm={handleConfirm} />
        );
      case 7:
        return <ConfirmationStep formData={formData} onConfirm={handleConfirm} />;
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
        {step < steps.length - 1 && step !== 5 && (
          <NextButton onPress={handleNext} disabled={false} isLastStep={false} />
        )}
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
