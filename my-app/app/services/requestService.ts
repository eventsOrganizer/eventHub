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

    console.log('Inserting request with data:', {
      user_id: userId,
      personal_id: personalId,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from('request')
      .insert({
        user_id: userId,
        personal_id: personalId,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error inserting request:', error);
      throw new Error(`Failed to insert request: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('Request was inserted but no data was returned');
    }

    console.log('Request inserted successfully:', data[0]);
    return { requestData: data[0], depositAmount };
  } catch (error) {
    console.error('Error making service request:', error);
    if (error instanceof Error) {
      throw new Error(`Error making service request: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while making the service request');
    }
  }
};