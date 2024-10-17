import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    signIn: undefined,
    SignUp: undefined; // Add other routes as necessary
    Home: undefined;
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
};
export interface Media {
  url: string;
}
export interface Material {
  id: number;
  name: string;
   details?: string; // Optional property
  price: number; // Price for sale
  price_per_hour: number; // Price for rent
  sell_or_rent: 'sell' | 'rent'; // To distinguish between sell and rent
  subcategory_id: number;
  media: Media[]
  subcategory: {
    name: string;
  }; // Array of media objects
}

export type PersonalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalsScreen'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;