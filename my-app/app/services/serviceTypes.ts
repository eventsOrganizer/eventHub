import { supabase } from './supabaseClient';
import { Linking } from 'react-native';

export type Location = {
  latitude: number | null; // Store latitude, can be null
  longitude: number | null; // Store longitude, can be null
};

export type Comment = {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  personal_id: number;
  user: { username: string; id: string };
};

export interface MediaItem {
  url: string;
  type?: string;
}

export type Service = {
    id: number;
    name: string;
    priceperhour: number;
    details: string;
    user_id: string;
    subcategory?: { 
      name: string;
      category?: {
        name: string;
      };
    };
    media?: MediaItem[];
    imageUrl?: string;
    image: string;
    startdate: string;
    enddate: string;
    availability: Array<{
      id: number;
      start: string;
      end: string;
      daysofweek: string;
      date: string;
    }>;
    comment: Comment[];
    like?: { user_id: string }[];
    order: Array<{
      user_id: string;
      ticket_id: string;
    }>;
    request: Array<{
      user_id: string;
      status: string;
    }>;
    review: Array<{
      user_id: string;
      rate: number;
    }>;
    location?: {
      latitude: number | null;
      longitude: number | null;
    } | null;
};

export type LocalComment = {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  local_id: number;
};

export type LocalService = {
  id: number;
  subcategory_id: number; // Include subcategory_id to match the schema
  user_id: string;
  priceperhour: number;
  name: string;
  details: string;
  startdate: string; // Assuming this is a string type for date representation
  enddate: string; // Same as above
  disabled: boolean;
  percentage?: number; // Assuming this is optional
  location: {          // You can define this as per your needs
    latitude: number | null; // Ensure null is allowed
    longitude: number | null; // Ensure null is allowed
  } | null; // Allow null if no location is provided
  // Other existing properties...
  comment: LocalComment[]; 
  like: Array<{ user_id: string }>;
  order: Array<{
    user_id: string;
    ticket_id: string;
  }>;
  local_user: Array<{
    user_id: string;
    status: string;
  }>;
  review: Array<{
    user_id: string;
    rate: number;
  }>;
};



export type ServiceRequest = {
  requestData: {
    id: number;
    user_id: string;
    personal_id: number;
    status: string;
    created_at: string;
    hours: number;
    total_price: number;
    deposit_amount: number;
  };
  depositAmount: number;
};

export type LocalServiceRequest = {
  requestData: {
    id: number;
    user_id: string;
    local_id: number;
    status: string;
    created_at: string;
    hours: number;
    total_price: number;
    deposit_amount: number;
  };
  depositAmount: number;
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

export const makeLocalServiceRequest = async (localId: number, availabilityId: number, hours: number): Promise<{ requestData: any; depositAmount: number } | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data: localData, error: localError } = await supabase
      .from('local')
      .select('priceperhour')
      .eq('id', localId)
      .single();
    if (localError) throw localError;

    const totalPrice = localData.priceperhour * hours;
    const depositAmount = totalPrice * 0.25; // 25% deposit

    const { data, error } = await supabase
      .from('request')
      .insert({
        user_id: userData.user.id,
        local_id: localId,
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
    console.error('Error making local service request:', error);
    return null;
  }
};

export const initiatePayment = async (requestId: number, amount: number) => {
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
