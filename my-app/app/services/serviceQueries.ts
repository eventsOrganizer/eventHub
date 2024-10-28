import { supabase } from './supabaseClient';
import { Service } from './serviceTypes';

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
            user_id,
            media (url),
            subcategory!inner (
              id,
              name,
              category!inner (
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
            user_id,
            media (url),
            subcategory!inner (
              id,
              name,
              category!inner (
                name
              )
            )
          `)
          .eq('user_id', userId)
      ]);
  
      if (personalServices.error) throw personalServices.error;
      if (localServices.error) throw localServices.error;
      if (materialServices.error) throw materialServices.error;
  
      const formattedServices: Service[] = [
        ...(personalServices.data || []).map(service => ({
          id: service.id,
          name: service.name,
          details: service.details,
          priceperhour: service.priceperhour,
          user_id: service.user_id,
          type: 'Personal' as const,
          imageUrl: service.media?.[0]?.url || 'https://via.placeholder.com/150',
          category: service.subcategory?.category?.name || 'uncategorized',
          subcategory: {
            id: service.subcategory?.id,
            name: service.subcategory?.name,
            category: service.subcategory?.category?.name || 'uncategorized'
          },
          media: service.media,
          location: service.location || null // Assurez-vous que la localisation est incluse
        })),
        ...(localServices.data || []).map(service => ({
          id: service.id,
          name: service.name,
          details: service.details,
          priceperhour: service.priceperhour,
          user_id: service.user_id,
          type: 'Local' as const,
          imageUrl: service.media?.[0]?.url || 'https://via.placeholder.com/150',
          category: service.subcategory?.category?.name || 'uncategorized',
          subcategory: {
            id: service.subcategory?.id,
            name: service.subcategory?.name,
            category: service.subcategory?.category?.name || 'uncategorized'
          },
          media: service.media
        })),
        ...(materialServices.data || []).map(service => ({
          id: service.id,
          name: service.name,
          details: service.details,
          price: service.price,
          price_per_hour: service.price_per_hour,
          user_id: service.user_id,
          type: 'Material' as const,
          imageUrl: service.media?.[0]?.url || 'https://via.placeholder.com/150',
          category: service.subcategory?.category?.name || 'uncategorized',
          subcategory: {
            id: service.subcategory?.id,
            name: service.subcategory?.name,
            category: service.subcategory?.category?.name || 'uncategorized'
          },
          media: service.media
        }))
      ];
  
      return formattedServices;
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
      let query;
      
      const baseSelect = `
        id,
        name,
        details,
        subcategory (
          id,
          name,
          category (
            id,
            name
          )
        ),
        user_id,
        startdate,
        enddate,
        disabled,
        media (
          id,
          url,
          type
        ),
        location (
          id,
          latitude,
          longitude
        ),
        comment (
          id,
          details,
          created_at,
          parent_id,
          user:user_id (
            id,
            username,
            firstname,
            lastname
          )
        ),
        review (
          id,
          rate,
          user_id,
          user:user_id (
            id,
            username
          )
        ),
        availability (
          id,
          start,
          "end",
          daysofweek,
          date,
          startdate,
          enddate,
          statusday
        )
      `;
  
      switch (serviceType) {
        case 'Personal':
          query = supabase
            .from('personal')
            .select(`
              ${baseSelect},
              priceperhour,
              percentage
            `);
          break;
  
        case 'Local':
          query = supabase
            .from('local')
            .select(`
              ${baseSelect},
              priceperhour
            `);
          break;
  
        case 'Material':
          query = supabase
            .from('material')
            .select(`
              ${baseSelect},
              price,
              price_per_hour,
              quantity,
              sell_or_rent
            `);
          break;
  
        default:
          throw new Error('Type de service non valide');
      }
  
      const { data, error } = await (query as any)
        .eq('id', serviceId)
        .single();
  
      if (error) throw error;
  
      return {
        ...data,
        type: serviceType,
        imageUrl: data.media?.[0]?.url || 'https://via.placeholder.com/150',
        image: data.media?.[0]?.url || 'https://via.placeholder.com/150',
        media: data.media || [],
        location: data.location || null,
        comment: data.comment || [],
        review: data.review || [],
        availability: data.availability || [],
        startdate: data.startdate || '',
        enddate: data.enddate || '',
        status: data.disabled ? 'inactive' : 'active',
        priceperhour: data.priceperhour || 0,
        price: data.price || 0,
        price_per_hour: data.price_per_hour || 0,
        percentage: data.percentage || 0,
        subcategory: data.subcategory,
        details: data.details || ''
      };
  
    } catch (error) {
      console.error('Erreur dans fetchServiceDetail:', error);
      throw error;
    }
  };
  

  export const fetchServiceComments = async (
    serviceId: number,
    serviceType: 'Personal' | 'Local' | 'Material'
  ) => {
    try {
      const columnName = `${serviceType.toLowerCase()}_id`;
      
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
        .eq(columnName, serviceId)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      return data;
  
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
      throw error;
    }
  };
  
  export const addServiceComment = async (
    serviceId: number,
    serviceType: 'Personal' | 'Local' | 'Material',
    userId: string,
    details: string
  ) => {
    try {
      const columnName = `${serviceType.toLowerCase()}_id`;
      const commentData = {
        user_id: userId,
        details,
        [columnName]: serviceId
      };
  
      const { data, error } = await supabase
        .from('comment')
        .insert([commentData])
        .select(`
          id,
          details,
          created_at,
          user:user_id (
            firstname,
            lastname,
            username
          )
        `)
        .single();
  
      if (error) throw error;
      return data;
  
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      throw error;
    }
  };
