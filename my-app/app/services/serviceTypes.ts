import { supabase } from './supabaseClient';
import { Linking } from 'react-native';



export type Service = {
  id: number;
  name: string;
  details: string;
  user_id: string;
  type?: 'Personal' | 'Local' | 'Material';
  priceperhour?: number;
  price?: number;
  price_per_hour?: number;
  imageUrl?: string;
  category?: string;
  depositPercentage?: number;
  subcategory?: { 
    id: number;
    name: string;
    category?: {
      name: string;
    };
  };
  media?: { url: string }[];
  availability?: Array<{
    id: number;
    start: string;
    end: string;
    daysofweek: string;
    date: string;
    statusday?: 'available' | 'reserved' | 'exception';
  }>;
  comment?: Array<{
    id: number;
    details: string;
    user_id: string;
    created_at: string;
  }>;
  like?: Array<{ user_id: string }>;
  order?: Array<{
    user_id: string;
    ticket_id: string;
  }>;
  personal_user?: Array<{
    user_id: string;
    status: string;
  }>;
  review?: Array<{
    user_id: string;
    rate: number;
    total: number;
  }>;
  location?: {
    latitude: number;
    longitude: number;
  } | null;
  startdate?: string;
  enddate?: string;
  percentage?: number;
};

export const makeServiceRequest = async (personalId: number, availabilityId: number, hours: number): Promise<{ requestData: any; depositAmount: number } | null> => {
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
      .from('request')
      .insert({
        user_id: userData.user.id,
        personal_id: personalId,
        status: 'pending',
        created_at: new Date().toISOString(),
        hours: hours,
        total_price: totalPrice,
        deposit_amount: depositAmount
      })
      .select()
      .single();

    if (error) throw error;
    return { requestData: data, depositAmount };
  } catch (error) {
    console.error('Error making service request:', error);
    return null;
  }
};

export const initiatePayment = async (serviceId: number, amount: number): Promise<string | null> => {
  const FLOUCI_APP_TOKEN = "4c1e07ef-8533-4e83-bbeb-7f61c0b21931";
  const FLOUCI_APP_SECRET = "ee9d6f08-30c8-4dbb-8578-d51293ff2535";

  try {
    const response = await fetch('https://developers.flouci.com/api/generate_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOUCI_APP_TOKEN}`,
      },
      body: JSON.stringify({
        app_token: FLOUCI_APP_TOKEN,
        app_secret: FLOUCI_APP_SECRET,
        amount: amount,
        accept_url: `exp://192.168.100.2:8081/payment-success?serviceId=${serviceId}`,
        cancel_url: `exp://192.168.100.2:8081/payment-cancel?serviceId=${serviceId}`,
        decline_url: `exp://192.168.100.2:8081/payment-decline?serviceId=${serviceId}`,
        webhook_url: `exp://192.168.100.2:8081/api/payment-webhook`,
      }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flouci API error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
  
    const paymentData = await response.json();
    console.log('Payment Response:', paymentData); // Log the full response for debugging
  
    if (paymentData?.result?.link) {
      return paymentData.result.link;
    } else {
      throw new Error('Payment URL not found in the response');
    }
  } catch (error) {
    console.error('Error initiating Flouci payment:', error);
    return null;
  }
};
