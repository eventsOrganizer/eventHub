import { useState } from 'react';
import { useConfirmPayment } from '@stripe/stripe-react-native';

const useStripePayment = () => {
  const { confirmPayment, loading } = useConfirmPayment();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const initiatePayment = async (
    cardDetails: any,
    billingDetails: { email: string },
    order: { amount: number; localId: number; userId: number }
  ) => {
    try {
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': `Bearer sk_test_51QClepFlPYG1ImxpA4Br3T5n8kG5Rnsf3Q2xTqPusg5etFWUfHHPqKhFqvpN2zfhXMKtlKRNJ31B5pglrbnchPC600ue5pfwVv`
               }    
         , body: new URLSearchParams({
          amount: (order.amount * 100).toString(), // Stripe expects the amount in cents
          currency: 'usd',
          description: `Payment for local ID: ${order.localId}, User ID: ${order.userId}`,
        }).toString(),
      });

      const { client_secret, error: paymentError } = await response.json();

      if (paymentError) throw new Error(paymentError.message);

      if (client_secret && cardDetails?.complete) {
        const { error, paymentIntent } = await confirmPayment(client_secret, {
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails,
          },
        });

        if (error) {
          console.log("Error from Stripe:", error);
          setErrorMessage(error.message);
          setPaymentSuccess(false);
        } else if (paymentIntent) {
          console.log("Payment successful:", paymentIntent);
          setPaymentSuccess(true);
          setErrorMessage(null);
        }
      } else {
        setErrorMessage('Please complete card details.');
      }
    } catch (error) {
      setErrorMessage((error as Error).message || 'Payment failed.');
      console.error("Payment initiation error:", error);
    }
  };

  return { initiatePayment, loading, paymentSuccess, errorMessage };
};

export default useStripePayment;
