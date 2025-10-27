/**
 * Designsystem Tech - Zentrale Tokens für die Excel Business Budget Generator Pro App
 * Alle Farben, Radii, Shadows, Spacing und Typography werden hier definiert
 * und über CSS-Variablen in tailwind.config.ts verwendet
 */

export const techTokens = {
  // Spacing Scale (8px base)
  spacing: {
    '0': '0',
    '1': '0.25rem', // 4px
    '2': '0.5rem',  // 8px
    '3': '0.75rem', // 12px
    '4': '1rem',    // 16px
    '5': '1.25rem', // 20px
    '6': '1.5rem',  // 24px
    '8': '2rem',    // 32px
    '10': '2.5rem', // 40px
    '12': '3rem',   // 48px
    '16': '4rem',   // 64px
    '20': '5rem',   // 80px
    '24': '6rem',   // 96px
  },

  // Border Radius Scale
  radii: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Typography Scale
  typography: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },

  // Shadows Scale
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Color Palettes (Tech Mode)
  colors: {
    // Primary Colors - Tech Blue/Cyan
    primary: {
      '50': '#e6f7ff',
      '100': '#bae7ff',
      '200': '#91d5ff',
      '300': '#69c0ff',
      '400': '#40a9ff',
      '500': '#1890ff',
      '600': '#096dd9',
      '700': '#0050b3',
      '800': '#003a8c',
      '900': '#002766',
      '950': '#001840',
    },

    // Neutral Colors - Cool Grays
    neutral: {
      '50': '#fafafa',
      '100': '#f5f5f5',
      '200': '#e8e8e8',
      '300': '#d9d9d9',
      '400': '#bfbfbf',
      '500': '#8c8c8c',
      '600': '#595959',
      '700': '#434343',
      '800': '#262626',
      '900': '#1f1f1f',
      '950': '#0f0f0f',
    },

    // Success Colors - Green
    success: {
      '50': '#f6ffed',
      '100': '#d9f7be',
      '200': '#b7eb8f',
      '300': '#95de64',
      '400': '#73d13d',
      '500': '#52c41a',
      '600': '#389e0d',
      '700': '#237804',
      '800': '#135200',
      '900': '#092b00',
    },

    // Warning Colors - Orange
    warning: {
      '50': '#fff7e6',
      '100': '#ffe7ba',
      '200': '#ffd591',
      '300': '#ffc069',
      '400': '#ffa940',
      '500': '#fa8c16',
      '600': '#d46b08',
      '700': '#ad4e00',
      '800': '#873800',
      '900': '#612500',
    },

    // Danger/Error Colors - Red
    danger: {
      '50': '#fff1f0',
      '100': '#ffccc7',
      '200': '#ffa39e',
      '300': '#ff7875',
      '400': '#ff4d4f',
      '500': '#f5222d',
      '600': '#cf1322',
      '700': '#a8071a',
      '800': '#820014',
      '900': '#5c0011',
    },

    // Info Colors - Blue
    info: {
      '50': '#e6f7ff',
      '100': '#bae7ff',
      '200': '#91d5ff',
      '300': '#69c0ff',
      '400': '#40a9ff',
      '500': '#1890ff',
      '600': '#096dd9',
      '700': '#0050b3',
      '800': '#003a8c',
      '900': '#002766',
    },
  },
};

// CSS Variables für Light Theme
export const techLightTheme = {
  '--background': '0 0% 100%',
  '--foreground': '221 39% 11%',
  '--card': '0 0% 100%',
  '--card-foreground': '221 39% 11%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '221 39% 11%',
  '--primary': '199 89% 48%', // cyan-500
  '--primary-foreground': '0 0% 100%',
  '--secondary': '210 33% 95%',
  '--secondary-foreground': '221 39% 11%',
  '--muted': '210 33% 97%',
  '--muted-foreground': '215 16% 47%',
  '--accent': '210 33% 95%',
  '--accent-foreground': '221 39% 11%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '0 0% 100%',
  '--border': '214 32% 91%',
  '--input': '214 32% 91%',
  '--ring': '199 89% 48%',
  '--radius': '0.5rem',
};

// CSS Variables für Dark Theme
export const techDarkTheme = {
  '--background': '221 39% 11%',
  '--foreground': '0 0% 98%',
  '--card': '221 39% 11%',
  '--card-foreground': '0 0% 98%',
  '--popover': '221 39% 11%',
  '--popover-foreground': '0 0% 98%',
  '--primary': '199 89% 48%',
  '--primary-foreground': '0 0% 98%',
  '--secondary': '217 23% 28%',
  '--secondary-foreground': '0 0% 98%',
  '--muted': '217 19% 27%',
  '--muted-foreground': '215 20% 65%',
  '--accent': '217 23% 28%',
  '--accent-foreground': '0 0% 98%',
  '--destructive': '0 63% 31%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '217 23% 28%',
  '--input': '217 23% 28%',
  '--ring': '199 89% 48%',
  '--radius': '0.5rem',
};

export default techTokens;

