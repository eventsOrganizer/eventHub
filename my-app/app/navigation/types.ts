import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AvailabilityData } from '../services/availabilityService';

export type AuthStackParamList = {
  signIn: undefined;
  SignUp: undefined;
  Home: undefined;
};

export type CreateLocalServiceStep5Params = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
  location: { latitude: number; longitude: number };
  availabilityFrom: string;
  availabilityTo: string;
  amenities: {
    wifi: boolean;
    parking: boolean;
    aircon: boolean;
  };
};

export interface PersonalData {
  id: number;
  name: string;
  priceperhour: number;
  rating: number;
  reviewCount: number;
  description: string;
  location: string;
  experience: number;
  languages?: string[];
  subcategory?: {
    name: string;
    category?: {
      name: string;
    };
  };
  media?: { url: string }[];
}

export type RootStackParamList = {
 
  Home: undefined;
  PersonalsScreen: { category?: string };
  PersonalDetail: { personalId: number };
  LocalsScreen: { category?: string };
  LocalServiceDetails: { localId: number };
  CreateLocalServiceStep2: undefined;
  CreateLocalServiceStep3: {
    serviceName: string;
    description: string;
    images: string[];
    price: number;
    subcategoryId: string;
    subcategoryName: string;
  };
  CreateLocalServiceStep4: {
    serviceName: string;
    description: string;
    images: string[];
    price: number;
    subcategoryId: string;
    subcategoryName: string;
    startDate: string;
    endDate: string;
    interval: string;
    exceptionDates: string[];
  };
  CreateLocalServiceStep5: {
    serviceName: string;
    description: string;
    images: string[];
    price: string;
    subcategoryId: string;
    subcategoryName: string;
    startDate: string;
    endDate: string;
    interval: string;
    exceptionDates: string[];
    location: {
      latitude: number;
      longitude: number;
    };
    amenities: {
      wifi: boolean;
      parking: boolean;
      aircon: boolean;
    };
  };

  CreatePersonalServiceStep1: undefined;
  CreatePersonalServiceStep2: {
    serviceName: string;
    description: string;
    subcategoryName: string;
    subcategoryId: number;
  };
  CreatePersonalServiceStep3: {
    serviceName: string;
    description: string;
    images: string[];
    subcategoryName: string;
    subcategoryId: number;
  };
  CreatePersonalServiceStep4: {
    serviceName: string;
    description: string;
    subcategoryName: string;
    subcategoryId: number;
    images: string[];
    interval: 'Yearly' | 'Monthly' | 'Weekly';
    startDate: string;
    endDate: string;
    exceptionDates: string[];
    pricePerHour: number;
    depositPercentage: number;
  };
  CreatePersonalServiceStep5: {
    serviceName: string;
    description: string;
    subcategoryName: string;
    subcategoryId: number;
    images: string[];
    interval: 'Yearly' | 'Monthly' | 'Weekly';
    startDate: string;
    endDate: string;
    exceptionDates: string[];
    pricePerHour: number;
    depositPercentage: number;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  BookingScreen: {
    personalId: number;
    userId: string | null;
    availabilityData: AvailabilityData;
  };
  CommentsScreen: {
    personalId: number;
    userId: string | null;
  };
  AddReviewScreen: {
    personalId: number;
    userId: string | null;
  };
  ReviewScreen: { materialId: string; sellOrRent: 'sell' | 'rent' };
  CommentScreen: { materialId: string };
  EventDetails: { eventId: number };
  Basket: { basket: Material[] }; 
  MaterialScreen: { materials: Material[] };
  MaterialsOnboarding: undefined;
  MaterialDetail: { material: Material };
  PaymentScreen: {
    amount: number;
    totalPrice: number;
    serviceId: number;
    serviceType: 'personal' | 'local' | 'material';
    userId: string;
    requestId: number;
    start: string;
    end: string;
  };
  PaymentSuccess: {
    requestId: number;
    serviceId: number;
    serviceType: 'personal' | 'local' | 'material';
    paymentIntentId: string;
    amount: number;
    totalPrice: number;
  };
  YourRequests: {
    mode: 'sent' | 'received';
  };
  LocalServiceDetailScreen: {
    localId: number;
  };
  LocalCommentsScreen: {
    localId: number;
  };
  LocalBookingScreen: {
    localId: number;
    userId: string;
    availabilityData: {
      startDate: string;
      endDate: string;
      availability: any[]; // ajustez le type selon vos besoins
      interval: number;
    };
  };
}

export interface Media {
  url: string;
}

export interface Material {
  id: string;
  name: string;
  price: number;
  price_per_hour: number;
  sell_or_rent: 'sell' | 'rent';
  subcategory_id: number;
  subcategory?: number;
  media: { url: string }[];
  details: string;
  likes?: number;
  average_rating?: number;
}

export interface Request {
  id: number;
  name: string;
  type: string;
  status: string;
  subcategory: string;
  imageUrl: string | null;
  serviceImageUrl: string | null;
  requesterName?: string;
  requesterEmail?: string;
  createdAt?: string;
  date?: string;
  start?: string;
  end?: string;
}

export interface HomeScreenSection {
  title: string;
  data: any[];
  type: 'staff' | 'event' | 'local' | 'material';
  onSeeAll: () => void;
  onItemPress: (item: any) => void;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface HomeScreenSection {
  title: string;
  data: any[];
  type: 'staff' | 'event' | 'local' | 'material';
  onSeeAll: () => void;
  onItemPress: (item: any) => void;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface PaymentModalProps {
  visible?: boolean;
  onClose?: () => void;
  amount: number; // Amount in cents
  ticket_id?: string | undefined;
  local_id?: number  | undefined;
  personal_id?: number | undefined;
  material_id?:  number | undefined;
}
export type CreateLocalServiceStep4NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateLocalServiceStep4'>;
export type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookingScreen'>;
export type CommentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CommentsScreen'>;
export type AddReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddReviewScreen'>;
export type CreateLocalServiceStep5NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateLocalServiceStep5'>;
export type PersonalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalsScreen'>;
export type LocalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LocalsScreen'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type CreatePersonalServiceStep1NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep1'>;
export type CreatePersonalServiceStep2NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep2'>;
export type CreatePersonalServiceStep3NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep3'>;
export type CreatePersonalServiceStep5NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep5'>;
export type CreatePersonalServiceStep4NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep4'>;