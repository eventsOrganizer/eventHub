import { Alert } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

export const initiatePayment = async (personalId: string, amount: number): Promise<string | null> => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  try {
    // Fetch payment intent client secret from your backend
    const response = await fetch('https://your-backend.com/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ personalId ,amount, currency: 'usd' }),
    });

    const { clientSecret } = await response.json();

    // Initialize the payment sheet
  // Initialize the payment sheet
const { error } = await initPaymentSheet({
    paymentIntentClientSecret: clientSecret,
    merchantDisplayName: 'Your Merchant Name', // Add your merchant display name
    // Add any other required parameters here
  });
    if (error) {
      console.error('Error initializing payment sheet:', error);
      throw new Error('Failed to initialize payment sheet');
    }

    // Present the payment sheet
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      console.error('Error presenting payment sheet:', paymentError);
      Alert.alert('Payment Error', `Failed to complete payment: ${paymentError.message}`);
      return null;
    }

    Alert.alert('Payment Success', 'Your payment was successful!');
    return 'success';
  } catch (error) {
    console.error('Error initiating Stripe payment:', error);
    Alert.alert('Payment Error', 'An unknown error occurred while initiating payment.');
    return null;
  }
};