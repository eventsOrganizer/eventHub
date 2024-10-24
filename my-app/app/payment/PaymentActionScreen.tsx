import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native'; // Make sure this is installed

interface PaymentActionScreenProps {
    price: number;
    personalId: string;
  }
  
const PaymentActionScreen: React.FC<PaymentActionScreenProps> = ({ price, personalId }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handlePayment = async () => {
    try {
      // Fetch payment intent client secret from your backend
      const response = await fetch('https://your-backend.com/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personalId, amount: price, currency: 'usd' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment intent from the server');
      }

      const { clientSecret } = await response.json();

      // Initialize the payment sheet
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Your Merchant Name',
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert('Payment Initialization Error', error.message);
        return;
      }

      // Present the payment sheet
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
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Action</Text>
      <Button title="Process Payment" onPress={handlePayment} />
    </View>
  );
};

// Moved styles block outside of the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});

export default PaymentActionScreen;