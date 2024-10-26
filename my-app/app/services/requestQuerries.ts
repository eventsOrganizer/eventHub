import { supabase } from './supabaseClient';
import { Request } from './requestTypes';

const formatRequest = (req: any, type: string): Request => {
    const service = req[type];
    const serviceUser = service?.user;
    const serviceMedia = service?.media;
    const requesterMedia = req.user?.media;
    
    return {
      id: req.id,
      name: service?.name || 'Service sans nom',
      status: req.status || 'Statut inconnu',
      type: type.charAt(0).toUpperCase() + type.slice(1),
      subcategory: service?.subcategory?.name || 'Sous-catégorie inconnue',
      category: service?.subcategory?.category?.name || 'Catégorie inconnue',
      details: service?.details || 'Aucun détail disponible',
      price: service?.priceperhour || service?.price || 0,
      requesterName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'Nom inconnu',
      requesterEmail: req.user?.email || 'Email inconnu',
      createdAt: req.created_at,
      date: req.availability?.date || 'Non spécifié',
      start: req.availability?.start || 'Non spécifié',
      end: req.availability?.end || 'Non spécifié',
      statusday: req.availability?.statusday || 'available',
      imageUrl: requesterMedia?.[0]?.url || null,
      serviceImageUrl: serviceMedia?.[0]?.url || null,
      creatorName: `${serviceUser?.firstname || ''} ${serviceUser?.lastname || ''}`.trim() || 'Nom inconnu',
      creatorImageUrl: serviceUser?.media?.[0]?.url || null,
      serviceCreator: {
        name: `${serviceUser?.firstname || ''} ${serviceUser?.lastname || ''}`.trim() || 'Nom inconnu',
        imageUrl: serviceUser?.media?.[0]?.url || null
      }
    };
  };
  
  const baseRequestQuery = `
    id,
    status,
    created_at,
    availability_id,
    availability!request_availability_id_fkey (
      date,
      start,
      end,
      statusday
    ),
    user:user_id (
      id,
      firstname,
      lastname,
      email,
      media (url)
    )
  `;
  
  const serviceFields = `
    id,
    name,
    details,
    priceperhour,
    user (
      firstname,
      lastname,
      media (url)
    ),
    subcategory:subcategory_id (
      name,
      category:category_id (name)
    ),
    media (url)
  `;
  
  export const fetchSentRequests = async (userId: string): Promise<Request[]> => {
    try {
      const { data: requests, error } = await supabase
        .from('request')
        .select(`
          ${baseRequestQuery},
          personal:personal_id (${serviceFields}),
          local:local_id (${serviceFields}),
          material:material_id (
            id,
            name,
            details,
            price,
            user (
              firstname,
              lastname,
              media (url)
            ),
            subcategory:subcategory_id (
              name,
              category:category_id (name)
            ),
            media (url)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      const formattedRequests = requests.map((req) => {
        const service = req.personal || req.local || req.material;
        const serviceType = req.personal ? 'personal' : req.local ? 'local' : 'material';
        if (!service) return null;
        return formatRequest(req, serviceType);
      });
  
      return formattedRequests.filter((req): req is Request => req !== null);
    } catch (error) {
      console.error('Error in fetchSentRequests:', error);
      throw error;
    }
  };
  
  export const fetchReceivedRequests = async (userId: string): Promise<Request[]> => {
    try {
      const [personalRequests, localRequests, materialRequests] = await Promise.all([
        supabase
          .from('request')
          .select(`
            ${baseRequestQuery},
            personal:personal_id (${serviceFields})
          `)
          .eq('status', 'pending')
          .not('personal_id', 'is', null)
          .eq('personal.user_id', userId)
          .order('created_at', { ascending: false }),
  
        supabase
          .from('request')
          .select(`
            ${baseRequestQuery},
            local:local_id (${serviceFields})
          `)
          .eq('status', 'pending')
          .not('local_id', 'is', null)
          .eq('local.user_id', userId)
          .order('created_at', { ascending: false }),
  
        supabase
          .from('request')
          .select(`
            ${baseRequestQuery},
            material:material_id (
              id,
              name,
              details,
              price,
              user (
                firstname,
                lastname,
                media (url)
              ),
              subcategory:subcategory_id (
                name,
                category:category_id (name)
              ),
              media (url)
            )
          `)
          .eq('status', 'pending')
          .not('material_id', 'is', null)
          .eq('material.user_id', userId)
          .order('created_at', { ascending: false })
      ]);
  
      if (personalRequests.error) throw personalRequests.error;
      if (localRequests.error) throw localRequests.error;
      if (materialRequests.error) throw materialRequests.error;
  
      return [
        ...(personalRequests.data || []).map(req => formatRequest(req, 'personal')),
        ...(localRequests.data || []).map(req => formatRequest(req, 'local')),
        ...(materialRequests.data || []).map(req => formatRequest(req, 'material'))
      ];
    } catch (error) {
      console.error('Error in fetchReceivedRequests:', error);
      throw error;
    }
  };