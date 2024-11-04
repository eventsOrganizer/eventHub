import { supabase } from './supabaseClient';
import { Service as ImportedService } from './serviceTypes';

interface Comment {
  details: string;
  user_id: string;
  user: { username: string };
}

interface Like {
  user_id: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface Service extends Omit<ImportedService, 'comment'> {
  comments?: Comment[];
  likes?: Like[];
  location?: Location | null;
  imageUrl?: string;
  priceperhour: number;
  percentage?: number;
  media?: { url: string; type?: string }[];
  subcategory?: {
    id: number;
    name: string;
    category?: {
      name: string;
    };
  };
}

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
        media (url, type),
        like (user_id),
        review (user_id, rate)
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching staff services:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No services found in the database');
      return [];
    }

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
        request (user_id, status, availability_id),
        review (user_id, rate),
        location (latitude, longitude)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      images: data.media?.map((item: { url: string }) => item.url) || [],
      comments: data.comment || [],
      likes: data.like || [],
      location: data.location?.[0] ? {
        latitude: parseFloat(data.location[0].latitude),
        longitude: parseFloat(data.location[0].longitude)
      } : null,
      priceperhour: data.priceperhour || 0
    };
  } catch (error) {
    console.error('Error fetching personal detail:', error);
    return null;
  }
};

export const toggleLike = async (personalId: number, userId: string | null) => {
  try {
    if (!userId) throw new Error('User not authenticated');

    const { data: existingLike, error: fetchError } = await supabase
      .from('like')
      .select('*')
      .eq('personal_id', personalId)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('like')
        .delete()
        .eq('personal_id', personalId)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;
      return false;
    } else {
      const { error: insertError } = await supabase
        .from('like')
        .insert({ personal_id: personalId, user_id: userId });

      if (insertError) throw insertError;
      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return null;
  }
};

export const addReview = async (personalId: number, userId: string, rating: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('review')
      .insert({
        personal_id: personalId,
        user_id: userId,
        rate: rating,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding review:', error);
    return false;
  }
};