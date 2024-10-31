export interface RequestResult {
    success: boolean;
    title: string;
    message: string;
    variant: 'default' | 'destructive';
  }
  
  export interface RequestUser {
    id: string;
    firstname: string;
    lastname: string;
  }
  
  export interface ServiceDetails {
    name: string;
    user: RequestUser;
  }
  
  export interface RequestData {
    id: number;
    user_id: string;
    created_at: string;
    user: RequestUser;
    personal?: ServiceDetails;
    local?: ServiceDetails;
    material?: ServiceDetails;
  }
  
  // Define valid request statuses based on database constraint
  export type ServiceType = 'Personal' | 'Local' | 'Material';
  export type RequestStatus = 'pending' | 'accepted' | 'refused';
  export type PaymentStatus = 'pending' | 'completed' | 'failed' | null;
  export type AvailabilityStatus = 'available' | 'reserved' | 'exception';
  
  export interface ServiceCreator {
    name: string;
    imageUrl: string | null;
  }
  
  export interface Request {
    // Basic request information
    id: number;
    user_id: string;
    status: RequestStatus;
    payment_status?: PaymentStatus;
    createdAt?: string;
  
    // Service identification
    personal_id?: number;
    local_id?: number;
    material_id?: number;
    serviceId?: number;
    serviceType?: ServiceType;
  
    // Service details
    name: string;
    details: string;
    type: ServiceType;
    category: string;
    subcategory: string;
    serviceName?: string;
  
    // Pricing fields
  priceperhour?: number;        // For Personal and Local services
  price?: number;               // For Material services (sell)
  price_per_hour?: number;      // For Material services (rent)
  percentage: number;
  sell_or_rent?: 'sell' | 'rent';
  
    // Scheduling information
    date: string;
    start: string;
    end: string;
    availabilityStatus: AvailabilityStatus;
    statusday?: AvailabilityStatus;
  
    // User information
    requesterName?: string;
    requesterEmail?: string;
    creatorName: string;
    creatorEmail: string;
    creatorImageUrl: string | null;
    serviceCreator: ServiceCreator;
  
    // UI state
    showDetails: boolean;
  
    // Media
    imageUrl?: string | null;
    serviceImageUrl?: string | null;
  }
  
  export interface PaymentResult {
    success: boolean;
    paymentIntentId?: string;
    error?: string;
  }
  
  // Helper type for request creation
  export interface CreateRequestDTO {
    user_id: string;
    service_id: number;
    service_type: ServiceType;
    date: string;
    start: string;
    end: string;
  }
  
  // Helper type for request updates
  export interface UpdateRequestDTO {
    status?: RequestStatus;
    payment_status?: PaymentStatus;
    statusday?: 'available' | 'reserved' | 'exception';
  }
  export interface RouteParams {
    userId: string;
    mode: 'sent' | 'received';
  }
