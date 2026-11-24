/**
 * VIRTUWEAR AI — Avatar Component
 *
 * Circular avatar with image or initials fallback, online indicator, border ring.
 * Sizes: sm(32) | md(48) | lg(64) | xl(96)
 */

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  source?: ImageSourcePropType | string;
  name?: string;
  size?: AvatarSize;
  showOnline?: boolean;
  showBorder?: boolean;
  style?: ViewStyle;
}

const SIZE_MAP: Record<AvatarSize, { dimension: number; fontSize: number; dotSize: number; borderWidth: number }> = {
  sm: { dimension: 32, fontSize: 12, dotSize: 8, borderWidth: 1.5 },
  md: { dimension: 48, fontSize: 16, dotSize: 10, borderWidth: 2 },
  lg: { dimension: 64, fontSize: 22, dotSize: 12, borderWidth: 2.5 },
  xl: { dimension: 96, fontSize: 32, dotSize: 14, borderWidth: 3 },
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  source,
  name,
  size = 'md',
  showOnline = false,
  showBorder = false,
  style,
}: AvatarProps) {
  const s = SIZE_MAP[size];

  const outerStyle: ViewStyle = {
    width: s.dimension,
    height: s.dimension,
    borderRadius: s.dimension / 2,
    ...(showBorder && {
      borderWidth: s.borderWidth,
      borderColor: Colors.lavender,
    }),
  };

  const imageUri = typeof source === 'string' ? source : undefined;
  const imageSource = typeof source === 'object' ? source : undefined;
  const hasImage = !!source;

  return (
    <View style={[styles.wrapper, outerStyle, style]}>
      {hasImage ? (
        <Image
          source={imageUri ? { uri: imageUri } : imageSource!}
          style={[
            styles.image,
            {
              width: s.dimension - (showBorder ? s.borderWidth * 2 : 0),
              height: s.dimension - (showBorder ? s.borderWidth * 2 : 0),
              borderRadius: s.dimension / 2,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={['#C8B4FF', '#9B7FE6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fallback,
            {
              width: s.dimension - (showBorder ? s.borderWidth * 2 : 0),
              height: s.dimension - (showBorder ? s.borderWidth * 2 : 0),
              borderRadius: s.dimension / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              { fontSize: s.fontSize },
            ]}
          >
            {getInitials(name)}
          </Text>
        </LinearGradient>
      )}

      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: s.dotSize,
              height: s.dotSize,
              borderRadius: s.dotSize / 2,
              borderWidth: s.dotSize > 10 ? 2.5 : 2,
              right: size === 'sm' ? -1 : 0,
              bottom: size === 'sm' ? -1 : 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  image: {
    backgroundColor: Colors.surfaceLight,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.midnight,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: Colors.success,
    borderColor: Colors.midnight,
  },
});
