import { MD3DarkTheme } from 'react-native-paper';

export const OrbitalTheme = {
  ...MD3DarkTheme,
  roundness: 14,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#38BDF8',        // Electric Cyan
    secondary: '#818CF8',      // Orbital Indigo
    background: '#050814',     // Deep Space Void
    surface: '#0F172A',        // Slate Telemetry Panel
    surfaceVariant: '#1E293B', // Elevated Card / Chip
    outline: '#334155',        // Subtle Instrument Border
    onSurface: '#F8FAFC',
    onSurfaceVariant: '#94A3B8',
    error: '#F43F5E',
  },
};

export const UI = {
  bg: '#050814',
  card: '#0F172A',
  cardBorder: '#1E293B',
  accent: '#38BDF8',
  accentGlow: 'rgba(56, 189, 248, 0.14)',
  indigo: '#818CF8',
  success: '#10B981',
  textPrimary: '#F8FAFC',
  textMuted: '#94A3B8',
};