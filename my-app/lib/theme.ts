export const theme = {
  colors: {
    // Primary colors
    primary: '#1B365D',    // Navy blue
    secondary: '#219EBC',  // Teal
    accent: '#8ECAE6',     // Light blue
    highlight: '#FFB703',  // Yellow
    
    // UI variations
    background: '#FFFFFF',
    foreground: '#1B365D',
    
    // Component specific
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardTitle: '#1B365D',
    cardDescription: '#4A5568',
    shadow: 'rgba(27, 54, 93, 0.1)',
    overlay: 'rgba(33, 158, 188, 0.05)',
    
    // Event specific
    eventTitle: '#1B365D',
    eventText: '#4A5568',
    eventIcon: '#219EBC',
    eventBorder: 'rgba(27, 54, 93, 0.2)',
    eventShadow: 'rgba(27, 54, 93, 0.15)',
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
  layout: {
    eventCard: {
      height: 220,
      hotEventWidth: 280,
      spacing: 12
    },
    personalDetail: {
      imageHeight: 300,
      cardSpacing: 16,
      mapHeight: 300
    }
  },

  transitions: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    }
  },
  
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    active: 1,
    overlay: 0.5,
  },

  input: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
    },
    padding: {
      sm: 8,
      md: 12,
      lg: 16,
    }
  },

  button: {
    height: {
      sm: 32,
      md: 40,
      lg: 48,
    },
    padding: {
      sm: { x: 12, y: 6 },
      md: { x: 16, y: 8 },
      lg: { x: 24, y: 12 },
    }
  },

  zIndex: {
    modal: 1000,
    overlay: 900,
    drawer: 800,
    popover: 700,
    header: 600,
    footer: 500,
  },

  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  }
} as const;

export type ThemeColors = typeof theme.colors;