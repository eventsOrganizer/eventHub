// useStripePayment.ts
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (amount: number) => {
    setLoading(true);
    try {
      // Call your backend to create a payment intent
      const { data, error: supabaseError } = await supabase
        .rpc('create_payment_intent', { amount }); // Adjust based on your backend setup

      if (supabaseError) throw supabaseError;

      const clientSecret = data?.client_secret; // Get the client secret from the response

      return clientSecret; // Return the client secret for further processing
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createPaymentIntent, loading, error };
};

export default useStripePayment;
