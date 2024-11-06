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

export const fetchServiceDetail = async (
  serviceId: number,
  serviceType: 'Personal' | 'Local' | 'Material'
): Promise<Service | null> => {
  try {
    const tableName = serviceType.toLowerCase();
    let query = supabase.from(tableName).select(`
      id,
      name,
      details,
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
    `);

    // Add specific fields based on service type
    if (serviceType === 'Personal') {
      query = supabase.from(tableName).select(`
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
      `);
    } else if (serviceType === 'Local') {
      query = supabase.from(tableName).select(`
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
      `);
    } else if (serviceType === 'Material') {
      query = supabase.from(tableName).select(`
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
      `);
    }

    const { data, error } = await query.eq('id', serviceId).single();

    if (error) throw error;
    if (!data) return null;

    switch (serviceType) {
      case 'Personal':
        return mapPersonalService(data);
      case 'Local':
        return mapLocalService(data);
      case 'Material':
        return mapMaterialService(data);
      default:
        throw new Error('Invalid service type');
    }
  } catch (error) {
    console.error('Error in fetchServiceDetail:', error);
    throw error;
  }
};

export const fetchServiceComments = async (
  serviceId: number, 
  serviceType: 'Personal' | 'Local' | 'Material'
) => {
  try {
    const { data, error } = await supabase
      .from('comment')
      .select(`
        id,
        details,
        created_at,
        user:user_id (
          id,
          firstname,
          lastname,
          username
        )
      `)
      .eq(`${serviceType.toLowerCase()}_id`, serviceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching service comments:', error);
    throw error;
  }
};