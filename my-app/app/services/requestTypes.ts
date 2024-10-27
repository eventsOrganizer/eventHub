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
    price?: number; // Prix fixe pour les services matériels à vendre
    requesterName?: string;
    requesterEmail?: string;
    createdAt?: string;
    date: string;
    start: string;
    end: string;
    statusday?: 'available' | 'reserved' | 'exception';
    imageUrl?: string | null;
    serviceImageUrl?: string | null;
    creatorName: string;
    creatorEmail: string;
    creatorImageUrl: string | null;
    serviceCreator: {
      name: string;
      imageUrl: string | null;
    };
    priceperhour?: number; // Tarif horaire pour les services personnels et locaux
    price_per_hour?: number; // Tarif horaire pour les services matériels à louer
    percentage: number; // Pourcentage d'avance pour tous les types de services
    sell_or_rent?: 'sell' | 'rent'; // Pour les services matériels
    availability?: string; // Ajout de la propriété availability
    serviceName?: string; // Ajout de la propriété serviceName
  }
  
  export interface RouteParams {
    userId: string;
    mode: 'sent' | 'received';
  }
