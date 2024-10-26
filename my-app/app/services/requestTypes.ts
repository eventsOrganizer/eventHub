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
  export type RequestStatus = 'pending' | 'accepted' | 'refused';

  export interface Request {
    id: number;
    name: string;
    status: 'pending' | 'accepted' | 'refused';
    type: string;
    subcategory: string;
    category: string;
    details: string;
    price?: number;
    requesterName?: string;
    requesterEmail?: string;
    createdAt?: string;
    date: string;
    start: string;
    end: string;
    statusday?: 'available' | 'reserved' | 'exception';
    imageUrl?: string | null;
    serviceImageUrl?: string | null;
    creatorName?: string;
    creatorImageUrl?: string | null;
    serviceCreator: {
      name: string;
      imageUrl: string | null;
    };
  }
  
  export interface RouteParams {
    userId: string;
    mode: 'sent' | 'received';
  }