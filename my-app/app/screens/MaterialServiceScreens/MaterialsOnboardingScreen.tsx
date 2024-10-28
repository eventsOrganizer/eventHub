import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../UserContext';
import { AuthRequiredModal } from '../../components/Auth/AuthRequiredModal';
import StepIndicator from '../../components/MaterialService/StepIndicator';
import SubcategoryStep from '../../components/MaterialService/SubcategoryStep';
import RentOrSaleStep from '../../components/MaterialService/RentOrSaleStep';
import MaterialDetailsStep from '../../components/MaterialService/MaterialDetailsStep';
import PriceStep from '../../components/MaterialService/PriceStep';
import QuantityStep from '../../components/MaterialService/QuantityStep';
import AvailabilityStep from '../../components/MaterialService/AvailabilityStep';
import ConfirmationStep from '../../components/MaterialService/ConfirmationStep';
import NextButton from '../../components/MaterialService/NextButton';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../hooks/use-toast';

const MaterialsOnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userId, isAuthenticated } = useUser();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subcategory: '',
    rentOrSale: '',
    title: '',
    details: '',
    price: '',
    quantity: '1',
    mediaFiles: [],
    availableDates: {},
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

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
        if (!formData.subcategory) {
          toast({
            title: "Error",
            description: "Please select a subcategory",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 2:
        return formData.rentOrSale !== '';
      case 3:
        return formData.title !== '' && formData.details !== '' && formData.mediaFiles.length > 0;
      case 4:
        return formData.price !== '';
      case 5:
        return true;
      case 6:
        if (formData.rentOrSale === 'rent') {
          return Object.keys(formData.availableDates).some(date => formData.availableDates[date]);
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }

    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handleConfirm = async () => {
    if (!isAuthenticated || !userId) {
      setShowAuthModal(true);
      return;
    }

    try {
      const subcategoryId = parseInt(formData.subcategory);
      if (isNaN(subcategoryId)) {
        throw new Error('Invalid subcategory ID');
      }

      // Convert 'sale' to 'sell' to match the database constraint
      const sellOrRentValue = formData.rentOrSale === 'sale' ? 'sell' : formData.rentOrSale;

      // Insert material with proper subcategory_id and sell_or_rent value
      const { data: materialData, error: materialError } = await supabase
        .from('material')
        .insert([{
          subcategory_id: subcategoryId,
          user_id: userId,
          quantity: parseInt(formData.quantity),
          price: sellOrRentValue === 'sell' ? parseInt(formData.price) : null,
          name: formData.title.trim(),
          details: formData.details.trim(),
          sell_or_rent: sellOrRentValue,
          price_per_hour: sellOrRentValue === 'rent' ? parseInt(formData.price) : null,
          startdate: sellOrRentValue === 'rent' ? new Date() : null,
          enddate: null,
          disabled: false
        }])
        .select()
        .single();

      if (materialError) {
        console.error('Material Error:', materialError);
        throw materialError;
      }

      if (!materialData) {
        throw new Error('No material data returned');
      }

      // Insert media entries
      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        const mediaPromises = formData.mediaFiles.map(file => 
          supabase
            .from('media')
            .insert({
              material_id: materialData.id,
              url: file.uri,
              type: file.type === 'video' ? 'video' : 'image'
            })
        );

        await Promise.all(mediaPromises);
      }

      toast({
        title: "Success",
        description: "Material created successfully!",
      });

      // Reset form and navigate back
      setFormData({
        subcategory: '',
        rentOrSale: '',
        title: '',
        details: '',
        price: '',
        quantity: '1',
        mediaFiles: [],
        availableDates: {},
      });
      setStep(1);
      navigation.goBack();

    } catch (error) {
      console.error('Error submitting material:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create material. Please try again.",
        variant: "destructive"
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
      
      <AuthRequiredModal
        visible={showAuthModal}
        onClose={() => navigation.goBack()}
        message="Please sign in to create a new material"
        onSignIn={() => {
          setShowAuthModal(false);
          navigation.navigate('SignIn' as never);
        }}
        onSignUp={() => {
          setShowAuthModal(false);
          navigation.navigate('SignUp' as never);
        }}
      />
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