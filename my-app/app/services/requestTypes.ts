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