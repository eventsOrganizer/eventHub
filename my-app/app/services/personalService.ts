import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

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
  availability: Array<{
    id: number;
    start: string;
    end: string;
    daysofweek: string;
    date: string;
  }>;
  comments: Array<{
    details: string;
    user_id: string;
  }>;
  likes: Array<{ user_id: string }>;
  orders: Array<{
    user_id: string;
    ticket_id: string;
  }>;
  personal_users: Array<{
    user_id: string;
    status: string;
  }>;
  reviews: Array<{
    user_id: string;
    rate: number;
    total: number;
  }>;
};

export const fetchStaffServices = async (): Promise<Service[]> => {
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
        review (user_id, rate, total)
      `)
      .in('subcategory.name', ['Cooker', 'Security', 'Waiter']);

    if (error) throw error;

    return (data || []).map((service: Service) => ({
      ...service,
      imageUrl: service.media && service.media.length > 0
        ? service.media[0].url
        : 'https://via.placeholder.com/150'
    }));
  } catch (error) {
    console.error('Error fetching staff services:', error);
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
        review (user_id, rate, total)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return data ? {
      ...data,
      imageUrl: data.media && data.media.length > 0
        ? data.media[0].url
        : 'https://via.placeholder.com/150'
    } : null;
  } catch (error) {
    console.error('Error fetching personal detail:', error);
    return null;
  }
};

export const addComment = async (personalId: number, userId: string, comment: string) => {
  try {
    const { data, error } = await supabase
      .from('comment')
      .insert({ personal_id: personalId, user_id: userId, details: comment });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

export const toggleLike = async (personalId: number) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data: existingLike, error: fetchError } = await supabase
      .from('likes')
      .select('*')
      .eq('personal_id', personalId)
      .eq('user_id', userData.user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('personal_id', personalId)
        .eq('user_id', userData.user.id);

      if (deleteError) throw deleteError;
      return false;
    } else {
      const { error: insertError } = await supabase
        .from('likes')
        .insert({ personal_id: personalId, user_id: userData.user.id });

      if (insertError) throw insertError;
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return null;
  }
};
export const makeServiceRequest = async (personalId: number, availabilityId: number) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('request')
      .insert({
        user_id: userData.user.id,
        personal_id: personalId,
        availability_id: availabilityId,
        status: 'pending'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error making service request:', error);
    return null;
  }
};