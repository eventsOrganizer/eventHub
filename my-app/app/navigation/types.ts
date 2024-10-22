import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AvailabilityData } from '../services/availabilityService';

export type AuthStackParamList = {
    signIn: undefined,
    SignUp: undefined;
    Home: undefined;
};

export type CreateLocalServiceStep5Params = {
  serviceName: string;
  description: string;
  images: string[];
  price: string;
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
  CreateLocalServiceStep2: undefined;
  CreateLocalServiceStep3: { 
      serviceName: string; 
      description: string; 
  };
  CreateLocalServiceStep4: { 
      formData: { 
          serviceName: string; 
          description: string; 
          images: string[]; 
          price: string; 
      }; 
  };
  CreateLocalServiceStep5: CreateLocalServiceStep5Params;

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

};

export type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookingScreen'>;
export type CommentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CommentsScreen'>;
export type AddReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddReviewScreen'>;

export type CreateLocalServiceStep5NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateLocalServiceStep5'>;
export type PersonalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalsScreen'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export type CreatePersonalServiceStep1NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep1'>;
export type CreatePersonalServiceStep2NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep2'>;
export type CreatePersonalServiceStep3NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep3'>;
export type CreatePersonalServiceStep5NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePersonalServiceStep5'>;