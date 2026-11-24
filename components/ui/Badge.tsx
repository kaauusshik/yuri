/**
 * VIRTUWEAR AI — Badge / Chip Component
 *
 * Variants: default | success | warning | danger | outline
 * Sizes: sm | md
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: keyof typeof Ionicons.glyphMap;
}

const VARIANT_MAP: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: {
    bg: Colors.lavenderMuted,
    text: Colors.lavender,
    border: 'transparent',
  },
  success: {
    bg: 'rgba(164, 201, 178, 0.18)',
    text: Colors.sage,
    border: 'transparent',
  },
  warning: {
    bg: 'rgba(255, 183, 77, 0.15)',
    text: Colors.warning,
    border: 'transparent',
  },
  danger: {
    bg: 'rgba(255, 107, 107, 0.15)',
    text: Colors.danger,
    border: 'transparent',
  },
  outline: {
    bg: 'transparent',
    text: Colors.ivory,
    border: Colors.border,
  },
};

const SIZE_MAP: Record<BadgeSize, { height: number; px: number; fontSize: number; iconSize: number }> = {
  sm: { height: 22, px: 8, fontSize: 11, iconSize: 11 },
  md: { height: 28, px: 12, fontSize: 13, iconSize: 14 },
};

export default function Badge({ text, variant = 'default', size = 'md', icon }: BadgeProps) {
  const v = VARIANT_MAP[variant];
  const s = SIZE_MAP[size];

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor: v.border,
    borderWidth: variant === 'outline' ? 1 : 0,
    height: s.height,
    paddingHorizontal: s.px,
    borderRadius: s.height / 2,
  };

  const labelStyle: TextStyle = {
    color: v.text,
    fontSize: s.fontSize,
    fontWeight: '600',
    letterSpacing: 0.2,
  };

  return (
    <View style={[styles.base, containerStyle]}>
      {icon && (
        <Ionicons
          name={icon}
          size={s.iconSize}
          color={v.text}
          style={styles.icon}
        />
      )}
      <Text style={labelStyle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
});
