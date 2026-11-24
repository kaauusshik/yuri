/**
 * VIRTUWEAR AI — Premium Card Component
 *
 * Elevated surface card with rounded corners, subtle border, and optional press behavior.
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevated?: boolean;
}

export default function Card({ children, style, onPress, elevated = false }: CardProps) {
  const cardStyle: ViewStyle[] = [
    styles.card,
    elevated && styles.elevated,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Layout.padding.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  elevated: {
    ...Platform.select({
      ios: {
        shadowColor: Colors.lavender,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    borderColor: 'rgba(200, 180, 255, 0.12)',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
