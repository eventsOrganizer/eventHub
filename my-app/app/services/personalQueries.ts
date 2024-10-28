import { supabase } from './supabaseClient';
import { Service } from './serviceTypes';

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
      request (user_id, status, availability_id),
      review (user_id, rate, total)
    `);
    if (error) throw error;

    return data.map((service: Service) => ({
      ...service,
      imageUrl: service.media && service.media.length > 0
        ? service.media[0].url
        : 'https://via.placeholder.com/150',
      comments: service.comment || []
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
        media (url, type),
        availability (start, end, daysofweek, date),
        comment (
          id,
          details,
          user_id,
          created_at,
          user (id, username)
        ),
        like (user_id),
        order (user_id, ticket_id),
        request (user_id, status, availability_id),
        review (user_id, rate)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      ...data,
      imageUrl: data.media && data.media.length > 0
        ? data.media[0].url
        : 'https://via.placeholder.com/150',
      comments: data.comment || []
    };
  } catch (error) {
    console.error('Error fetching personal detail:', error);
    return null;
  }
};