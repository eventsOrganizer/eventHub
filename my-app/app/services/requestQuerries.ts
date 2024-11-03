import { supabase } from './supabaseClient';
import { Request, ServiceType  } from './requestTypes';

export const formatRequest = (req: any, type: string): Request => {
  const service = req[type];
  const serviceUser = service?.user;
  
  return {
    id: req.id,
    user_id: req.user_id,
    personal_id: type === 'personal' ? req.personal_id || service?.id : undefined,
    local_id: type === 'local' ? req.local_id || service?.id : undefined,
    material_id: type === 'material' ? req.material_id || service?.id : undefined,
    name: service?.name || 'Unnamed Service',
    status: req.status || 'pending',
    type: (type.charAt(0).toUpperCase() + type.slice(1)) as Request['type'],
    subcategory: service?.subcategory?.name || 'Unknown Subcategory',
    category: service?.subcategory?.category?.name || 'Unknown Category',
    details: service?.details || 'No details available',
    priceperhour: (type === 'personal' || type === 'local') ? service?.priceperhour || 0 : undefined,
    price: type === 'material' ? service?.price || 0 : undefined,
    price_per_hour: type === 'material' ? service?.price_per_hour || 0 : undefined,
    percentage: service?.percentage || 0,
    sell_or_rent: type === 'material' ? service?.sell_or_rent : undefined,
    requesterName: `${req.user?.firstname || ''} ${req.user?.lastname || ''}`.trim() || 'Unknown Name',
    requesterEmail: req.user?.email || 'Unknown Email',
    createdAt: req.created_at,
    date: req.availability?.date || 'Not specified',
    start: req.availability?.start || 'Not specified',
    end: req.availability?.end || 'Not specified',
    statusday: req.availability?.statusday || 'available',
    imageUrl: req.user?.media?.[0]?.url || null,
    serviceImageUrl: service?.media?.[0]?.url || null,
    creatorName: `${serviceUser?.firstname || ''} ${serviceUser?.lastname || ''}`.trim() || 'Unknown Name',
    creatorEmail: serviceUser?.email || 'Email not available',
    creatorImageUrl: serviceUser?.media?.[0]?.url || null,
    serviceCreator: {
      name: `${serviceUser?.firstname || ''} ${serviceUser?.lastname || ''}`.trim() || 'Unknown Name',
      imageUrl: serviceUser?.media?.[0]?.url || null
    },
    showDetails: false,
    availabilityStatus: req.availability?.status || 'available',
    is_read: req.is_read || false,
    is_action_read: req.is_action_read || false,
    payment_status: req.payment_status || null
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

 const serviceFields = {
  personal: `
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
  `,
  local: `
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
  `,
  material: `
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
  `
};

export const fetchSentRequests = async (userId: string): Promise<Request[]> => {
  try {
    const { data: requests, error } = await supabase
      .from('request')
      .select(`
        ${baseRequestQuery},
        personal:personal_id (${serviceFields.personal}),
        local:local_id (${serviceFields.local}),
        material:material_id (${serviceFields.material})
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
          personal:personal_id!inner (
            ${serviceFields.personal},
            user_id
          )
        `)
        .eq('personal.user_id', userId)
        .neq('user_id', userId)
        .not('personal_id', 'is', null),

      supabase
        .from('request')
        .select(`
          ${baseRequestQuery},
          local:local_id!inner (
            ${serviceFields.local},
            user_id
          )
        `)
        .eq('local.user_id', userId)
        .neq('user_id', userId)
        .not('local_id', 'is', null),

      supabase
        .from('request')
        .select(`
          ${baseRequestQuery},
          material:material_id!inner (
            ${serviceFields.material},
            user_id
          )
        `)
        .eq('material.user_id', userId)
        .neq('user_id', userId)
        .not('material_id', 'is', null)
    ]);

    if (personalRequests.error) throw personalRequests.error;
    if (localRequests.error) throw localRequests.error;
    if (materialRequests.error) throw materialRequests.error;

    const allRequests = [
      ...(personalRequests.data || []).map(req => formatRequest(req, 'personal')),
      ...(localRequests.data || []).map(req => formatRequest(req, 'local')),
      ...(materialRequests.data || []).map(req => formatRequest(req, 'material'))
    ];
    return allRequests.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error('Error in fetchReceivedRequests:', error);
    throw error;
  }
};