import { supabase } from './supabaseClient';

export type Service = {
  id: number;
  name: string;
  priceperhour: number;
  subcategory?: { name: string };
  media?: { url: string }[];
  imageUrl?: string;
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
        media (url)
      `);

    if (error) throw error;

    return data.map((service: Service) => ({
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