import { useState } from 'react';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import { PaymentResult } from '../types/paymentTypes';
import { Alert } from 'react-native';
import axios from 'axios';

interface PaymentOrder {
  amount: number;
  serviceId: number;
  serviceType: 'personal' | 'local' | 'material';
  userId: string;
}

export const useStripePayment = () => {
  const { confirmPayment } = useConfirmPayment();
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (
    cardDetails: any,
    billingDetails: { email: string },
    order: PaymentOrder
  ): Promise<PaymentResult> => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card information');
      return { success: false };
    }

    try {
      setLoading(true);
      
      const response = await axios.post('https://api.stripe.com/v1/payment_intents', {
        amount: Math.round(order.amount * 100),
        currency: 'usd',
        // description: `Payment for local ID: ${order.localId}, User ID: ${order.userId}`,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer sk_test_51QFaREKiWYtX8OEl0KqNf9ahbcp2FRIVomn7IQmNrHdYxv9DYBaxH1uUh906CVDUiyuiVNz95KnAWueGR8Mggqlu00mVfistGJ`
        }
      });

      const { client_secret, error: paymentError } = response.data;

      if (paymentError) {
        console.log('Failed to create payment intent', paymentError);
        throw new Error('Failed to create payment intent');
      }

      const { paymentIntent, error } = await confirmPayment(client_secret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentIntent) {
        throw new Error('Payment confirmation failed');
      }

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Error',
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};