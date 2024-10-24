// supabase/functions/create-payment-intent/index.ts
import { serve } from 'https://deno.land/std@0.114.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@10.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2020-08-27',
});
 

serve(async (req) => {
  try {
    const { amount, currency } = await req.json();
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});