import dotenv from 'dotenv';

dotenv.config();

export default {
  name: "my-app",
  slug: "my-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "This app needs access to location when open."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  web: {
    // Web-specific configurations (if needed)
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL, // Load Supabase URL from .env
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY, // Load Supabase Anon Key from .env
  },
  plugins: [
     [
        "@stripe/stripe-react-native",
        {
          
          "enableGooglePay": true
        }
      ],
    [
      "expo-font",
      {
        "fonts": [
          "node_modules/@expo-google-fonts/inter/Inter_400Regular.ttf",
          "node_modules/@expo-google-fonts/inter/Inter_500Medium.ttf",
          "node_modules/@expo-google-fonts/inter/Inter_600SemiBold.ttf",
          "node_modules/@expo-google-fonts/inter/Inter_700Bold.ttf"
        ]
      }
    ]
  ]
};