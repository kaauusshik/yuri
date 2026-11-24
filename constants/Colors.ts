/**
 * VIRTUWEAR AI — Design System Colors
 * Premium fashion editorial + modern AI studio aesthetic
 */

export const Colors = {
  // Core palette
  midnight: '#111318',
  lavender: '#C8B4FF',
  ivory: '#F3F0EA',
  sage: '#A4C9B2',

  // Surfaces
  surface: '#1A1B23',
  surfaceLight: '#242530',

  // Text
  text: '#F3F0EA',
  mutedText: '#8E8E93',

  // Borders
  border: '#2A2B35',

  // Semantic
  danger: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFB74D',

  // Derived / utility
  lavenderMuted: 'rgba(200, 180, 255, 0.15)',
  lavenderSubtle: 'rgba(200, 180, 255, 0.08)',
  overlay: 'rgba(17, 19, 24, 0.85)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;

export default Colors;
