export interface SubcategoryWithCategory {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  }
  
  export interface ServiceLocation {
    id: number;
    latitude: number;
    longitude: number;
  }
  
  export interface ServiceMedia {
    id?: number;
    url: string;
    type?: string;
  }
  
  export interface BaseServiceResponse {
    id: number;
    name: string;
    details: string;
    user_id: string;
    startdate?: string;
    enddate?: string;
    disabled?: boolean;
    media?: ServiceMedia[];
    location?: ServiceLocation[];
    subcategory: SubcategoryWithCategory;
  }
  
  export interface PersonalServiceResponse extends BaseServiceResponse {
    priceperhour: number;
    percentage: number;
  }
  
  export interface LocalServiceResponse extends BaseServiceResponse {
    priceperhour: number;
  }
  
  export interface MaterialServiceResponse extends BaseServiceResponse {
    price: number;
    price_per_hour: number;
    quantity: number;
    sell_or_rent: 'sell' | 'rent';
  }
  
  export type SupabaseServiceResponse = {
    id: number;
    name: string;
    details: string;
    user_id: string;
    priceperhour?: number;
    percentage?: number;
    price?: number;
    price_per_hour?: number;
    quantity?: number;
    sell_or_rent?: 'sell' | 'rent';
    media: Array<{ url: string }>;
    subcategory: {
      id: number;
      name: string;
      category: {
        id: number;
        name: string;
      };
    };
    location?: Array<{
      id: number;
      latitude: number;
      longitude: number;
    }>;
  };