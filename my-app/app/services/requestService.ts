import { supabase } from './supabaseClient';

export const makeServiceRequest = async (personalId: number, hours: number, date: string, userId: string | null) => {
  try {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    console.log('Fetching personal data for ID:', personalId);
    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .select('priceperhour')
      .eq('id', personalId)
      .single();
    
    if (personalError) {
      console.error('Error fetching personal data:', personalError);
      throw new Error(`Failed to fetch personal data: ${personalError.message}`);
    }

    if (!personalData) {
      throw new Error('Personal data not found');
    }

    console.log('Personal data fetched successfully:', personalData);

    const totalPrice = personalData.priceperhour * hours;
    const depositAmount = totalPrice * 0.25; // 25% deposit

    // Start a transaction
    const { data, error } = await supabase.rpc('create_service_request', {
      p_user_id: userId,
      p_personal_id: personalId,
      p_hours: hours,
      p_total_price: totalPrice,
      p_deposit_amount: depositAmount,
      p_date: date
    });

    if (error) {
      console.error('Error creating service request:', error);
      throw new Error(`Failed to create service request: ${error.message}`);
    }

    console.log('Service request created successfully:', data);
    return { requestData: data, depositAmount };
  } catch (error) {
    console.error('Error making service request:', error);
    if (error instanceof Error) {
      throw new Error(`Error making service request: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while making the service request');
    }
  }
};

export const checkExistingRequest = async (personalId: number, userId: string) => {
  const { data, error } = await supabase
    .from('personal_user')
    .select('*')
    .eq('personal_id', personalId)
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (error) {
    console.error('Error checking existing request:', error);
    throw error;
  }

  return data.length > 0;
};