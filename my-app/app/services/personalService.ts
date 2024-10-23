import { supabase } from './supabaseClient';
import { Service as ImportedService } from './serviceTypes';

export const fetchStaffServices = async (): Promise<ImportedService[]> => {
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
        media (url),
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

interface PersonalData {
  media?: { url: string }[];
  comment?: Comment[];
  like?: Like[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const fetchPersonalDetail = async (id: number): Promise<ImportedService | null> => {
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
        comment (
          details,
          user_id,
          user (username)
        ),
        like (user_id),
        order (user_id, ticket_id),
        personal_user (user_id, status),
        review (user_id, rate),
        location!personal_id (latitude, longitude)
      `)
      .eq('id', id)
      .single();

      if (error) throw error;
      if (!data) return null;
  
      const processedData = {
        ...data,
        imageUrl: data.media && data.media.length > 0
          ? data.media[0].url
          : 'https://via.placeholder.com/150',
        comments: data.comment || [],
        likes: data.like || [],
        location: data.location && data.location.length > 0 ? {
          latitude: parseFloat(data.location[0].latitude) || null,
          longitude: parseFloat(data.location[0].longitude) || null
        } : null
      };
  
      return processedData;
    } catch (error) {
      console.error('Error fetching personal detail:', error);
      return null;
    }
  };
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
}

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