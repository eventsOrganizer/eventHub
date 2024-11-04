import { supabase } from './supabaseClient';
import { Service } from './serviceTypes';
import { SupabaseServiceResponse } from './supabaseTypes';
import { mapPersonalService, mapLocalService, mapMaterialService } from './serviceMappers';

export const fetchUserServices = async (userId: string): Promise<Service[]> => {
  try {
    const [personalServices, localServices, materialServices] = await Promise.all([
      supabase
        .from('personal')
        .select(`
          id,
          name,
          details,
          priceperhour,
          percentage,
          user_id,
          media (url),
          subcategory!inner (
            id,
            name,
            category!inner (
              id,
              name
            )
          ),
          location (
            id,
            latitude,
            longitude
          )
        `)
        .eq('user_id', userId),
      supabase
        .from('local')
        .select(`
          id,
          name,
          details,
          priceperhour,
          user_id,
          media (url),
          subcategory!inner (
            id,
            name,
            category!inner (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId),
      supabase
        .from('material')
        .select(`
          id,
          name,
          details,
          price,
          price_per_hour,
          quantity,
          sell_or_rent,
          user_id,
          media (url),
          subcategory!inner (
            id,
            name,
            category!inner (
              id,
              name
            )
          )
        `)
        .eq('user_id', userId)
    ]);

    if (personalServices.error) throw personalServices.error;
    if (localServices.error) throw localServices.error;
    if (materialServices.error) throw materialServices.error;

    return [
      ...(personalServices.data || []).map((service: any) => mapPersonalService(service)),
      ...(localServices.data || []).map((service: any) => mapLocalService(service)),
      ...(materialServices.data || []).map((service: any) => mapMaterialService(service))
    ];
  } catch (error) {
    console.error('Error in fetchUserServices:', error);
    throw error;
  }
};