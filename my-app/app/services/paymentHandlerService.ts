import { supabase } from './supabaseClient';
import { PaymentResult } from '../types/paymentTypes';
import { sendPaymentNotification } from './notificationService';

export const verifyServiceExists = async (serviceId: number, serviceType: string) => {
  console.log('Verifying service existence...');
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
  console.log('Processing payment result...');
  if (!paymentResult.success || !paymentResult.paymentIntentId) {
    throw new Error(paymentResult.error || "Payment failed for an unknown reason");
  }

  const serviceIdField = `${serviceType.toLowerCase()}_id`;
  
  try {
    // Récupérer les informations du service et de l'utilisateur
    const { data: serviceData, error: serviceError } = await supabase
      .from(serviceType.toLowerCase())
      .select(`
        id,
        name,
        user_id
      `)
      .eq('id', serviceId)
      .single();

    if (serviceError || !serviceData) {
      throw new Error('Service not found');
    }

    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('firstname, lastname')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      throw new Error('User not found');
    }

    // Créer la commande
    const { error: orderError } = await supabase
      .from('order')
      .insert({
        [serviceIdField]: serviceId,
        user_id: userId,
        payment: true,
        payment_id: paymentResult.paymentIntentId,
        request_id: requestId,
        totalprice: totalPrice,
        payedamount: amount
      });

    if (orderError) throw orderError;

    // Mettre à jour le statut de paiement de la demande
    const { error: requestError } = await supabase
      .from('request')
      .update({ payment_status: 'completed' })
      .eq('id', requestId);

    if (requestError) throw requestError;

    // Envoyer la notification de paiement
    const userName = `${userData.firstname} ${userData.lastname}`;
    await sendPaymentNotification(
      serviceData.user_id,
      requestId,
      userName,
      serviceData.name
    );

    return paymentResult.paymentIntentId;
  } catch (error) {
    console.error('Error in payment process:', error);
    throw error;
  }
};