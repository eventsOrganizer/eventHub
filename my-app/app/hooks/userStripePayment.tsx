import { useState } from 'react';
import { Alert } from 'react-native';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';
import Constants from 'expo-constants';

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
  ) => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card information');
      return { success: false };
    }

    try {
      setLoading(true);
      
      const stripeSecretKey = Constants.expoConfig?.extra?.STRIPE_SECRET_KEY;
      if (!stripeSecretKey) {
        throw new Error('Stripe secret key is not configured');
      }

      const response = await axios.post('https://api.stripe.com/v1/payment_intents', {
        amount: Math.round(order.amount * 100),
        currency: 'usd',
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${stripeSecretKey}`
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
      return { 
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading };
};