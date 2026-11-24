/**
 * VIRTUWEAR AI — Layout Constants
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: { width, height },

  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  screen: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },

  isSmallDevice: width < 375,
} as const;

export default Layout;
