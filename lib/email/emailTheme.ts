export const colors = {
  blue:           "#0066cc",
  purple:         "#6b46c1",
  green:          "#10b981",
  muted:          "#596070",
  dark:           "#1a1b25",
  pageBg:         "#f5f4f2",
  cardBg:         "#ffffff",
  border:         "#cfd1d4",
  blueSubtitle:   "#cce0f5",
  purpleSubtitle: "#ddd6fe",
  greenSubtitle:  "#d1fae5",
  graySubtitle:   "#d1d5db",
  slate700:       "#374151",
  gray400:        "#9ca3af",
} as const;

export const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue:   colors.blue,
          purple: colors.purple,
          green:  colors.green,
          muted:  colors.muted,
          dark:   colors.dark,
          bg:     colors.pageBg,
          card:   colors.cardBg,
          border: colors.border,
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
};
