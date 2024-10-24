import { useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseStripePaymentResult {
  handlePayment: (personalId: string, amount: number) => Promise<void>;
  loading: boolean;
}

const useStripePayment = (): UseStripePaymentResult => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (personalId: string, amount: number) => {
    setLoading(true);
    try {
      const response = await fetch('https://cdvnddjpkcdvspccjvre.supabase.co/functions/v1/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalId, amount, currency: 'usd' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment intent from the server');
      }

      const { clientSecret } = await response.json();

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'eventHub',
        customerId:personalId

      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert('Payment Initialization Error', error.message);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.error('Error presenting payment sheet:', paymentError);
        Alert.alert('Payment Error', `Failed to complete payment: ${paymentError.message}`);
        return;
      }

      Alert.alert('Payment Success', 'Your payment was successful!');
    } catch (error) {
      console.error('Error initiating Stripe payment:', error);
      Alert.alert('Payment Error', 'An error occurred while initiating payment.');
    } finally {
      setLoading(false);
    }
  };
  return { handlePayment, loading };
};

export default useStripePayment;