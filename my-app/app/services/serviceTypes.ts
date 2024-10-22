import { supabase } from './supabaseClient';



export type Comment = {
  id: number;
  details: string;
  user_id: string;
  created_at: string;
  personal_id: number;
};

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
    media?: { url: string }[];
    imageUrl?: string;
    startdate: string;
    enddate: string;
    availability: Array<{
      date: string;
      statusday: 'available' | 'reserved' | 'exception';
    }>;
    comment: Comment[];
    like: Array<{ user_id: string }>;
    order: Array<{
      user_id: string;
      ticket_id: string;
    }>;
    personal_user: Array<{
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
          // hours: hours,
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

export const initiatePayment = async (requestId: number, amount: number) => {
  const FLOUCI_APP_TOKEN = "4c1e07ef-8533-4e83-bbeb-7f61c0b21931";
  const FLOUCI_APP_SECRET = "ee9d6f08-30c8-4dbb-8578-d51293ff2535";

  try {
    // This is a placeholder for the actual Flouci API call
    // You'll need to implement the actual API call based on Flouci's documentation
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
        // Add any other required parameters
      })
    });

    const paymentData = await response.json();
    return paymentData;
  } catch (error) {
    console.error('Error initiating Flouci payment:', error);
    return null;
  }
};