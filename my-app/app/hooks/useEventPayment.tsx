import { useState } from 'react';
import { Alert } from 'react-native';
import { useConfirmPayment } from '@stripe/stripe-react-native';
import axios from 'axios';
import Constants from 'expo-constants';

interface EventPaymentOrder {
  amount: number;
  eventId: number;
  ticketId: number;
  userId: string;
  eventType: 'online' | 'indoor' | 'outdoor';
}

export const useEventPayment = () => {
  const { confirmPayment } = useConfirmPayment();
  const [loading, setLoading] = useState(false);

  const initiateEventPayment = async (
    cardDetails: any,
    billingDetails: { email: string },
    order: EventPaymentOrder
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
      const response = await axios.post(
        'https://api.stripe.com/v1/payment_intents',
        new URLSearchParams({
          amount: Math.round(order.amount * 100).toString(),
          currency: 'usd',
          'payment_method_types[]': 'card',  // Changed this line
          'metadata[eventId]': order.eventId.toString(),
          'metadata[ticketId]': order.ticketId.toString(),
          'metadata[eventType]': order.eventType
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${stripeSecretKey}`
          }
        }
      );

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
      console.error('Event payment error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Stripe API Response:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      return { 
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    ;
    } finally {
      setLoading(false);
    }
  };

  return { initiateEventPayment, loading };
};