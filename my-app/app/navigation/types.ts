import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    signIn: undefined,
    SignUp: undefined; // Add other routes as necessary
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
  CreateLocalServiceStep4: { 
      formData: { 
          serviceName: string; 
          description: string; 
          images: string[]; 
          price: string; 
      }; 
  };
  CreateLocalServiceStep3: { 
      serviceName: string; 
      description: string; 
  };
  CreateLocalServiceStep2: undefined; // or the appropriate type for the route params
  CreateLocalServiceStep5: { // Add this line
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
};
export type CreateLocalServiceStep4NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateLocalServiceStep4'>;
export type CreateLocalServiceStep5NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateLocalServiceStep5'>;
export type PersonalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalsScreen'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
