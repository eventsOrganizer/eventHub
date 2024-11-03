import { supabase } from './supabaseClient';
import { Linking } from 'react-native';


export type ServiceType = 'Personal' | 'Local' | 'Material';

export interface Service {
  id: number;
  name: string;
  details: string;
  user_id: string;
  type?: ServiceType;
   priceperhour?: number;        // Pour Personal et Local
   price?: number;               // Pour Material (vente)
   price_per_hour?: number;      // Pour Material (location)
   percentage?: number;
  quantity?: number;
  sell_or_rent?: 'sell' | 'rent';
  imageUrl?: string;
  category?: string;
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
    id: number;
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
}

export interface LocalService {
  id: number;
  name: string;
  priceperhour: number;
  details: string;
  like?: Array<{ user_id: string }>;
  reviews?: Array<{
    id: number;
    rating: number;
    user_id: string;
    created_at: string;
  }>;
  media?: { url: string }[];
  location: {
    latitude: number;
    longitude: number;
  };
  comment: Array<{
    id: number;
    content: string;
    user?: {
      username: string;
    };
  }>;
  startdate?: Date | string | null;
  enddate?: Date | string | null;
  subcategory?: {
    name: string;
    category?: {
      name: string;
    };
    amenities?: {
      wifi?: boolean;
      parking?: boolean;
      aircon?: boolean;
    };
  
  };
  // ... autres propriétés nécessaires ...
}

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

