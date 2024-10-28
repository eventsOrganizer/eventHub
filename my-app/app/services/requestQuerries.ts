import { supabase } from './supabaseClient';
import { Request } from './requestTypes';

const formatRequest = (req: any, type: string): Request => {
  const service = req[type];
  const serviceUser = service?.user;
  const serviceMedia = service?.media;
  const requesterMedia = req.user?.media;
  const availability = req.availability;
  
  return {
    id: req.id,
    name: service?.name || 'Unnamed Service',
    status: req.status || 'Unknown Status',
    type: type.charAt(0).toUpperCase() + type.slice(1),
    subcategory: service?.subcategory?.name || 'Unknown Subcategory',
    category: service?.subcategory?.category?.name || 'Unknown Category',
    details: service?.details || 'No details available',
    price: type === 'material' ? (service?.price || 0) : undefined,
    priceperhour: (type === 'personal' || type === 'local') ? (service?.priceperhour || 0) : undefined,
    price_per_hour: type === 'material' ? (service?.price_per_hour || 0) : undefined,
    percentage: service?.percentage || 0,
    sell_or_rent: type === 'material' ? service?.sell_or_rent : undefined,
    requesterName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'Unknown Name',
    requesterEmail: req.user?.email || 'Unknown Email',
    createdAt: req.created_at,
    date: availability?.date || 'Not specified',
    start: availability?.start || 'Not specified',
    end: availability?.end || 'Not specified',
    statusday: req.availability?.statusday || 'available',
    imageUrl: requesterMedia?.[0]?.url || null,
    serviceImageUrl: serviceMedia?.[0]?.url || null,
    creatorName: `${serviceUser?.firstname || ''} ${serviceUser?.lastname || ''}`.trim() || 'Unknown Name',
    creatorEmail: serviceUser?.email || 'Email not available',
    creatorImageUrl: serviceUser?.media?.[0]?.url || null,
    serviceCreator: {
      name: `${serviceUser?.firstname || ''} ${serviceUser?.lastname || ''}`.trim() || 'Unknown Name',
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
    price_per_hour,
    price,
    user (
      firstname,
      lastname,
      email,
      media (url)
    ),
    subcategory:subcategory_id (
      name,
      category:category_id (name)
    ),
    media (url)
  `;
  
  const personalServiceFields = `
    id,
    name,
    details,
    priceperhour,
    percentage,
    user (
      firstname,
      lastname,
      email,
      media (url)
    ),
    subcategory:subcategory_id (
      name,
      category:category_id (name)
    ),
    media (url)
  `;

  const localServiceFields = personalServiceFields; // Identique à personal pour l'instant

  const materialServiceFields = `
    id,
    name,
    details,
    price,
    price_per_hour,
    quantity,
    sell_or_rent,
    percentage,
    user (
      firstname,
      lastname,
      email,
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
        personal:personal_id (
          ${personalServiceFields}
        ),
        local:local_id (
          ${localServiceFields}
        ),
        material:material_id (
          ${materialServiceFields}
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedRequests = requests.map((req: any) => {
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
            personal:personal_id (${personalServiceFields})
          `)
          .eq('status', 'pending')
          .not('personal_id', 'is', null)
          .eq('personal.user_id', userId)
          .order('created_at', { ascending: false }),

        supabase
          .from('request')
          .select(`
            ${baseRequestQuery},
            local:local_id (${localServiceFields})
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
              ${materialServiceFields}
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
