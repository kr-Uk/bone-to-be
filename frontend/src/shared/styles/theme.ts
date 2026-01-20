export const theme = {
  colors: {
    primary: '#000000' as const,
    secondary: '#FFFFFF' as const,
    accent: '#333333' as const,
    text: '#000000' as const,
    textLight: '#666666' as const,
    background: '#FFFFFF' as const,
    backgroundDark: '#000000' as const,
    border: '#E5E5E5' as const,
  },
  typography: {
    heading1: {
      fontSize: '64px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    heading2: {
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    heading3: {
      fontSize: '32px',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    small: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
} as const;

export type AppTheme = typeof theme;
