import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  name: "my-app", // Your app name
  slug: "my-app", // Your app slug
  version: "1.0.0", // Your app version
  orientation: "portrait", // Orientation
  icon: "./assets/icon.png", // Path to app icon
  userInterfaceStyle: "light", // UI style
  splash: {
    image: "./assets/splash.png", // Path to splash image
    resizeMode: "contain", // Resize mode for splash
    backgroundColor: "#ffffff", // Background color for splash
  },
  ios: {
    supportsTablet: true, // Support for tablets on iOS
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png", // Adaptive icon
      backgroundColor: "#ffffff", // Background color for adaptive icon
    },
  },
  web: {
    // Web-specific configurations (if needed)
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL, // Load Supabase URL from .env
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY, // Load Supabase Anon Key from .env
  },
};
