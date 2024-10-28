import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  UserServices: { userId: string };
  ServicesDetails: {
    serviceId: number;
    serviceType: 'Personal' | 'Local' | 'Material';
  };
  CommentsScreen: {
    serviceId: number;
    userId: string | null;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
