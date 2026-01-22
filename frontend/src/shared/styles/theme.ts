export const theme = {
  colors: {
    primary: "#000000",
    secondary: "#FFFFFF",
    accent: "#333333",
    text: "#000000",
    textLight: "#666666",
    background: "#FFFFFF",
    backgroundDark: "#000000",
    border: "#E5E5E5",
    brand: "#9810FA",
    brandDisable: "#C27AFF",
    disable: "A1A1A1",
    purple: {
      50: "#FAF5FF",
      200: "#E9D4FF",
      600: "#9810FA",
      700: "#7E22CE",
      800: "#6E11B0",
      900: "#59168B",
    },
    gray: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#E5E5E5",
      300: "#D4D4D4",
      400: "#A1A1A1",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },

  typography: {
    uncategorized: {
      xl: { fontSize: "2.25rem", fontWeight: 600 },
    },
    heading: {
      "4xl": { fontSize: "3.75rem", fontWeight: 700, lineHeight: 1.2 },
      "3xl": { fontSize: "3rem", fontWeight: 700, lineHeight: 1.2 },
      "2xl": { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
      lg: { fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 },
      sm: { fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.2 },
    },
    body: {
      lg: {
        semibold: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.2 },
        regular: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.2 },
        medium: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.2 },
      },
      md: {
        semibold: { fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.2 },
        regular: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.2 },
        medium: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.2 },
      },
      sm: {
        semibold: { fontSize: "0.75rem", fontWeight: 600, lineHeight: 1.2 },
        regular: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.2 },
        medium: { fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.2 },
      },
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
    xxxl: "4rem",
  },
} as const;

export type AppTheme = typeof theme;
