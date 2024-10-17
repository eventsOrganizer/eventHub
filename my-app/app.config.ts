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
      NSLocationWhenInUseUsageDescription: "This app needs access to location when open.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  extra: {
    SUPABASE_URL: process.env.SUPABASE_URL, // Set in .env or through Expo secrets
    SUPABASE_API_KEY: process.env.SUPABASE_API_KEY, // Set in .env or through Expo secrets
  },
};
