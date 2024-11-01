export const theme = {
  colors: {
    // Primary colors
    primary: '#EDF2F4',
    secondary: '#1C5588',
    accent: '#00BDC8',
    success: '#7ACFB0',
    warning: '#FBCE9E',
    error: '#F88F52',
    // Gradients and variations
    gradientStart: '#EDF2F4',
    gradientMiddle: '#F4F7F9',
    gradientEnd: '#FFFFFF',
    // Component specific
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardTitle: '#1C5588',
    cardDescription: '#666666',
    shadow: 'rgba(28, 85, 136, 0.08)',
    overlay: 'rgba(0, 189, 200, 0.05)',
    // Event specific
    eventTitle: '#1C5588',
    eventText: '#4A5568',
    eventIcon: '#1C5588',
    eventBorder: 'rgba(28, 85, 136, 0.2)',
    eventShadow: 'rgba(28, 85, 136, 0.15)',
    eventBackground: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  shadows: {
    sm: '0 2px 4px rgba(28, 85, 136, 0.08)',
    md: '0 4px 8px rgba(28, 85, 136, 0.12)',
    lg: '0 8px 16px rgba(28, 85, 136, 0.16)',
  },
  typography: {
    title: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700',
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
  },
} as const;

export type ThemeColors = typeof theme.colors;