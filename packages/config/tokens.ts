export const colors = {
  primary: '#0F6E56',
  bg: '#F8F7F3',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.06)',
  textPrimary: '#1A1A1A',
  textSecondary: '#5F5E5A',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

export const fontSize = {
  h1: 28,
  h2: 20,
  h3: 16,
  body: 14,
  caption: 12,
  tiny: 10,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const animation = {
  fast: 200,
  base: 300,
  slow: 400,
} as const;

export const easing = {
  out: { damping: 15, stiffness: 150, mass: 0.5 },
  outSoft: { damping: 20, stiffness: 120, mass: 0.8 },
  bounce: { damping: 10, stiffness: 180, mass: 0.5 },
} as const;
