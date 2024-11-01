import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStripePayment } from '../hooks/userStripePayment';
import { useToast } from '../hooks/useToast';
import PaymentForm from './payment/PaymentForm';
import { verifyServiceExists, handlePaymentProcess } from '../services/paymentHandlerService';
import { PaymentResult, ServiceType } from '../types/paymentTypes';

type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentScreen'>;

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route, navigation }) => {
  const { initiatePayment, loading: stripeLoading } = useStripePayment();
  const { toast } = useToast();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const { amount, totalPrice, serviceId, serviceType, requestId, userId } = route.params;

  const handlePayment = async (): Promise<PaymentResult> => {
    console.log('Starting payment process with:', {
      amount,
      totalPrice,
      serviceId,
      serviceType,
      requestId,
      userId
    });

    if (!userId || !serviceId || !serviceType || !requestId || !amount || !totalPrice) {
      const missingParams = [];
      if (!userId) missingParams.push('userId');
      if (!serviceId) missingParams.push('serviceId');
      if (!serviceType) missingParams.push('serviceType');
      if (!requestId) missingParams.push('requestId');
      if (!amount) missingParams.push('amount');
      if (!totalPrice) missingParams.push('totalPrice');

      const error = `Missing required parameters: ${missingParams.join(', ')}`;
      console.error(error);
      setErrorMessage(error);
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return { success: false, error };
    }

    if (!cardDetails?.complete) {
      console.log('Card details incomplete:', cardDetails);
      setErrorMessage("Please enter valid card information");
      return { success: false, error: "Invalid card information" };
    }

    setIsProcessing(true);
    setErrorMessage(undefined);

    try {
      console.log('Verifying service existence...');
      await verifyServiceExists(serviceId, serviceType);

      console.log('Initiating payment with Stripe...');
      const result = await initiatePayment(cardDetails, { email: 'test@example.com' }, {
        amount,
        serviceId,
        serviceType,
        userId,
      });

      console.log('Payment result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      console.log('Processing payment result...');
      const paymentIntentId = await handlePaymentProcess(
        result,
        serviceId,
        serviceType,
        userId,
        requestId,
        amount,
        totalPrice
      );

      console.log('Payment successful, navigating to success screen...');
      navigation.navigate('PaymentSuccess', {
        requestId,
        serviceId,
        serviceType,
        paymentIntentId,
        amount,
        totalPrice
      });

      return { success: true, paymentIntentId };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Payment failed. Please try again.";
      console.error('Payment error details:', error);
      setErrorMessage(errorMsg);
      toast({
        title: "Payment Error",
        description: errorMsg,
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    } finally {
      setIsProcessing(false);
      console.log('Payment process completed');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <PaymentForm
        isProcessing={isProcessing || stripeLoading}
        onCardChange={setCardDetails}
        onSubmit={handlePayment}
        amount={amount}
        errorMessage={errorMessage}
      />
    </View>
  );
};

export default PaymentScreen;