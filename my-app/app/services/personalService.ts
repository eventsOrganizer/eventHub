import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import { Service } from './serviceTypes';

export const makeServiceRequest = async (personalId: number, hours: number, date: string) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data: personalData, error: personalError } = await supabase
      .from('personal')
      .select('priceperhour')
      .eq('id', personalId)
      .single();
    if (personalError) throw personalError;

    const totalPrice = personalData.priceperhour * hours;
    const depositAmount = totalPrice * 0.25; // 25% deposit

    const { data, error } = await supabase
      .from('requests')
      .insert({
        user_id: userData.user.id,
        personal_id: personalId,
        status: 'pending',
        created_at: new Date().toISOString(),
        hours: hours,
        date: date,
        total_price: totalPrice,
        deposit_amount: depositAmount
      });

    if (error) throw error;
    return { requestData: data, depositAmount };
  } catch (error) {
    console.error('Error making service request:', error);
    return null;
  }
};

export const initiatePayment = async (requestId: number, amount: number) => {
  const FLOUCI_APP_TOKEN = "4c1e07ef-8533-4e83-bbeb-7f61c0b21931";
  const FLOUCI_APP_SECRET = "ee9d6f08-30c8-4dbb-8578-d51293ff2535";

  try {
    const response = await fetch('https://api.flouci.com/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOUCI_APP_TOKEN}`
      },
      body: JSON.stringify({
        app_token: FLOUCI_APP_TOKEN,
        app_secret: FLOUCI_APP_SECRET,
        amount: amount,
        accept_url: `https://yourapp.com/payment-success?requestId=${requestId}`,
        cancel_url: `https://yourapp.com/payment-cancel?requestId=${requestId}`,
        decline_url: `https://yourapp.com/payment-decline?requestId=${requestId}`,
      })
    });

    const paymentData = await response.json();
    return paymentData;
  } catch (error) {
    console.error('Error initiating Flouci payment:', error);
    return null;
  }
};

export const fetchStaffServices = async (): Promise<Service[]> => {
  try {
    console.log('Fetching staff services...');
    const { data, error } = await supabase
      .from('personal')
      .select(`
        *,
        subcategory (
          name,
          category (
            name
          )
        ),
        media (url)
      `);

    if (error) {
      console.error('Error fetching staff services:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No services found in the database');
      return [];
    }

    console.log(`Found ${data.length} services`);
    return data.map((service: any) => ({
      ...service,
      imageUrl: service.media && service.media.length > 0
        ? service.media[0].url
        : 'https://via.placeholder.com/150',
    }));
  } catch (error) {
    console.error('Unexpected error fetching staff services:', error);
    return [];
  }
};

export const fetchPersonalDetail = async (id: number): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('personal')
      .select(`
        *,
        subcategory (
          name,
          category (
            name
          )
        ),
        media (url),
        availability (start, end, daysofweek, date),
        comment (details, user_id),
        like (user_id),
        order (user_id, ticket_id),
        personal_user (user_id, status),
        review (user_id, rate)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      imageUrl: data.media && data.media.length > 0
        ? data.media[0].url
        : 'https://via.placeholder.com/150',
      comments: data.comment || [],
      likes: data.like || []
    };
  } catch (error) {
    console.error('Error fetching personal detail:', error);
    return null;
  }
};

export const toggleLike = async (personalId: number) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data: existingLike, error: fetchError } = await supabase
      .from('like')
      .select('*')
      .eq('personal_id', personalId)
      .eq('user_id', userData.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('like')
        .delete()
        .eq('personal_id', personalId)
        .eq('user_id', userData.user.id);

      if (deleteError) throw deleteError;
      return false;
    } else {
      const { error: insertError } = await supabase
        .from('like')
        .insert({ personal_id: personalId, user_id: userData.user.id });

      if (insertError) throw insertError;
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return null;
  }
};