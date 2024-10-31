import { supabase } from './supabaseClient';
import { createOrder } from './orderService';
import { PaymentResult } from '../services/requestTypes';

export const verifyServiceExists = async (serviceId: number, serviceType: string) => {
  if (!serviceId || !serviceType) {
    throw new Error('Service ID and type are required');
  }

  const { data, error } = await supabase
    .from(serviceType.toLowerCase())
    .select('id')
    .eq('id', serviceId)
    .single();

  if (error || !data) {
    throw new Error(`Service with ID ${serviceId} not found`);
  }
};

export const handlePaymentProcess = async (
  paymentResult: PaymentResult,
  serviceId: number,
  serviceType: string,
  userId: string,
  requestId: number,
  amount: number,
  totalPrice: number
) => {
  if (paymentResult.success && paymentResult.paymentIntentId) {
    const serviceIdField = `${serviceType.toLowerCase()}_id`;
    
    // Create order with new fields
    const orderData = {
      [serviceIdField]: serviceId,
      user_id: userId,
      payment: true,
      payment_id: paymentResult.paymentIntentId,
      request_id: requestId,
      totalprice: totalPrice,
      payedamount: amount
    };

    const { error: orderError } = await supabase
      .from('order')
      .insert([orderData]);

    if (orderError) throw orderError;

    // Update request payment status
    const { error: requestError } = await supabase
      .from('request')
      .update({ payment_status: 'completed' })
      .eq('id', requestId);

    if (requestError) throw requestError;

    return paymentResult.paymentIntentId;
  }

  throw new Error(paymentResult.error || "Payment failed for an unknown reason");
};