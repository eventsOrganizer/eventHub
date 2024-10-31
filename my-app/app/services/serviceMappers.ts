import { Service } from './serviceTypes';
import { 
  SupabaseServiceResponse,
  PersonalServiceResponse, 
  LocalServiceResponse, 
  MaterialServiceResponse 
} from './supabaseTypes';

const normalizeSubcategory = (response: SupabaseServiceResponse) => ({
    id: response.subcategory?.id || 0,
    name: response.subcategory?.name || 'uncategorized',
    category: {
      name: response.subcategory?.category?.name || 'uncategorized'
    }
  });
  
  export const mapPersonalService = (response: SupabaseServiceResponse): Service => ({
    id: response.id,
    name: response.name,
    details: response.details,
    priceperhour: response.priceperhour || 0,
    percentage: response.percentage || 0,
    user_id: response.user_id,
    type: 'Personal',
    imageUrl: response.media?.[0]?.url || 'https://via.placeholder.com/150',
    category: response.subcategory?.category?.name || 'uncategorized',
    subcategory: normalizeSubcategory(response),
    media: response.media || [],
    location: response.location?.[0] || null
  });
  
  export const mapLocalService = (response: SupabaseServiceResponse): Service => ({
    id: response.id,
    name: response.name,
    details: response.details,
    priceperhour: response.priceperhour || 0,
    user_id: response.user_id,
    type: 'Local',
    imageUrl: response.media?.[0]?.url || 'https://via.placeholder.com/150',
    category: response.subcategory?.category?.name || 'uncategorized',
    subcategory: normalizeSubcategory(response),
    media: response.media || []
  });
  
  export const mapMaterialService = (response: SupabaseServiceResponse): Service => ({
    id: response.id,
    name: response.name,
    details: response.details,
    price: response.price || 0,
    price_per_hour: response.price_per_hour || 0,
    percentage: 0,
    quantity: response.quantity || 0,
    sell_or_rent: response.sell_or_rent || 'rent',
    user_id: response.user_id,
    type: 'Material',
    imageUrl: response.media?.[0]?.url || 'https://via.placeholder.com/150',
    category: response.subcategory?.category?.name || 'uncategorized',
    subcategory: normalizeSubcategory(response),
    media: response.media || []
  });