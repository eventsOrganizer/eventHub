import tw from 'twrnc';

// Define color palettes
export const colors = {
  primary: '#FF4500',
  secondary: '#FFA500',
  background: '#f5f5f5',
  text: {
    light: '#fff',
    dark: '#333',
  },
};

// Define typography
export const typography = {
  fontSize: {
    small: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
  },
  fontWeight: {
    regular: '400',
    bold: '700',
  },
};

// Define common styles using Tailwind CSS
export const commonStyles = {
  container: tw`flex-1 bg-[${colors.background}]`,
  header: tw`p-5 items-center rounded-b-3xl bg-gradient-to-r from-[${colors.primary}] to-[${colors.secondary}]`,
  avatar: tw`w-25 h-25 rounded-full mb-2.5`,
  name: tw`text-[${typography.fontSize.xlarge}] font-bold text-[${colors.text.light}] mb-1.25`,
  email: tw`text-[${typography.fontSize.medium}] text-[${colors.text.light}]`,
  buttonContainer: tw`flex-row justify-center mt-2.5 flex-wrap`,
  createButton: tw`flex-row items-center bg-white/20 py-1.25 px-2.5 rounded-full mx-1.25 mb-1.25`,
  createButtonText: tw`text-[${colors.text.light}] ml-1.25 text-[${typography.fontSize.small}]`,
  tabContainer: tw`flex-row justify-around bg-white py-2.5 border-b border-gray-300`,
  tab: tw`py-1.25 px-5`,
  activeTab: tw`border-b-2 border-[${colors.primary}]`,
  tabText: tw`text-[${typography.fontSize.medium}] text-[${colors.text.dark}]`,
  activeTabText: tw`text-[${colors.primary}] font-bold`,
  content: tw`flex-1 p-5`,
  chatButton: tw`bg-[${colors.primary}] flex-row items-center justify-center py-3.75 rounded-full mt-5 mb-5`,
  chatButtonText: tw`text-[${colors.text.light}] text-[${typography.fontSize.large}] font-bold ml-2.5`,
  requestsOverlay: tw`absolute inset-0 bg-black/70 justify-center items-center`,
  closeButton: tw`absolute top-10 right-5 bg-white/30 rounded-full p-1.25`,
};

export default {
  colors,
  typography,
  commonStyles,
};