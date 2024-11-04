import { supabase } from './supabaseClient';

interface OrderData {
  personal_id?: number;
  local_id?: number;
  material_id?: number;
  user_id: string;
  payment: boolean;
  payment_id: string;
  totalprice: number;
  payedamount: number;
  remainingamount?: number;
}

export const createOrder = async (orderData: OrderData) => {
  try {
    if (!orderData.user_id) {
      throw new Error('User ID is required to create an order');
    }

    // Vérifier si le service existe avant de créer la commande
    if (orderData.personal_id) {
      const { data: personalService, error: personalError } = await supabase
        .from('personal')
        .select('id')
        .eq('id', orderData.personal_id)
        .single();

      if (personalError || !personalService) {
        throw new Error(`Personal service with ID ${orderData.personal_id} does not exist`);
      }
    }

    if (orderData.local_id) {
      const { data: localService, error: localError } = await supabase
        .from('local')
        .select('id')
        .eq('id', orderData.local_id)
        .single();

      if (localError || !localService) {
        throw new Error(`Local service with ID ${orderData.local_id} does not exist`);
      }
    }

    if (orderData.material_id) {
      const { data: materialService, error: materialError } = await supabase
        .from('material')
        .select('id')
        .eq('id', orderData.material_id)
        .single();

      if (materialError || !materialService) {
        throw new Error(`Material service with ID ${orderData.material_id} does not exist`);
      }
    }

    const { data, error } = await supabase
      .from('order')
      .insert({
        personal_id: orderData.personal_id,
        local_id: orderData.local_id,
        material_id: orderData.material_id,
        user_id: orderData.user_id,
        payment: orderData.payment,
        payment_id: orderData.payment_id,
        totalprice: orderData.totalprice,
        payedamount: orderData.payedamount,
        remainingamount: orderData.remainingamount,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};