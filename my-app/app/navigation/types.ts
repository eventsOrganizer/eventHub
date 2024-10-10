import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
    signIn:undefined,
    SignUp: undefined; // Add other routes as necessary
    Home: undefined;
};

  

export interface PersonalData {
    id: string;
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
  PersonalScreen: undefined;
  PersonalDetail: { personalId: string };
};

export type PersonalScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PersonalScreen'>;

 