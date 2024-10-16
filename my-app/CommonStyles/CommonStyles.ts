import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: {
    light: '#FFA07A',
    main: '#FF7F50',
    dark: '#FF4500',
  },
  secondary: {
    light: '#FFD700',
    main: '#FFA500',
    dark: '#FF8C00',
  },
  accent: {
    light: '#40E0D0',
    main: '#00CED1',
    dark: '#008B8B',
  },
  background: {
    light: '#FFF5E6',
    main: '#FFF0D9',
    dark: '#FFE4B5',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF',
  },
  error: '#FF3B30',
  warning: '#FF9500',
  success: '#34C759',
  info: '#5AC8FA',
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 24,
    huge: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const layout = {
  borderRadius: {
    small: 5,
    medium: 10,
    large: 15,
    circular: 9999,
  },
  shadow: {
    small: {
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

export const cardStyles = StyleSheet.create({
    container: {
      width: width * 0.45,
      height: height * 0.28,
      backgroundColor: colors.background.light,
      borderRadius: layout.borderRadius.medium,
      overflow: 'hidden',
      marginBottom: spacing.md,
      ...layout.shadow.medium,
    },
    image: {
      width: '100%',
      height: '60%',
      resizeMode: 'cover',
    },
    content: {
      padding: spacing.sm,
      height: '40%',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold as 'bold',
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    description: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    footerText: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
    },
  });

export const buttonStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.main,
    borderRadius: layout.borderRadius.medium,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...layout.shadow.small,
  },
  text: {
    color: colors.text.light,
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
});

export const seeAllButtonStyles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: layout.borderRadius.circular,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.text.light,
  },
  text: {
    color: colors.text.light,
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
  },
});

export const gradients = {
    primary: [colors.primary.light, colors.primary.main, colors.primary.dark],
    secondary: [colors.secondary.light, colors.secondary.main, colors.secondary.dark],
    vipServices: ['#FF00FF', '#FF78FF', '#FF00FF'],
    marquee: ['#FF416C', '#FF4B2B', '#FF6B6B', '#FF8C00']
   


  };

export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    height: 100,
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary.main,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as 'bold',
    color: colors.text.light,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.light,
    borderRadius: layout.borderRadius.medium,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    borderWidth: 1,
    borderColor: colors.background.dark,
  },
});

export default CommonStyles;