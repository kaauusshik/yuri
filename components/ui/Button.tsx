/**
 * VIRTUWEAR AI — Premium Button Component
 *
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 * Features: loading state, icon support, press animation, disabled styling
 */

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; text: string; border: string; loaderColor: string }
> = {
  primary: {
    bg: Colors.lavender,
    text: Colors.midnight,
    border: Colors.lavender,
    loaderColor: Colors.midnight,
  },
  secondary: {
    bg: Colors.transparent,
    text: Colors.lavender,
    border: Colors.lavender,
    loaderColor: Colors.lavender,
  },
  ghost: {
    bg: Colors.transparent,
    text: Colors.ivory,
    border: Colors.transparent,
    loaderColor: Colors.ivory,
  },
  danger: {
    bg: Colors.danger,
    text: Colors.white,
    border: Colors.danger,
    loaderColor: Colors.white,
  },
};

const SIZE_STYLES: Record<
  ButtonSize,
  { height: number; paddingHorizontal: number; fontSize: number; iconSize: number }
> = {
  sm: { height: 36, paddingHorizontal: 14, fontSize: 13, iconSize: 16 },
  md: { height: 48, paddingHorizontal: 20, fontSize: 15, iconSize: 18 },
  lg: { height: 56, paddingHorizontal: 28, fontSize: 17, iconSize: 20 },
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.96, { duration: 100 });
    opacity.value = withTiming(0.85, { duration: 100 });
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
    opacity.value = withTiming(1, { duration: 150 });
  }, [scale, opacity]);

  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor: v.border,
    borderWidth: variant === 'secondary' ? 1.5 : 0,
    height: s.height,
    paddingHorizontal: s.paddingHorizontal,
    borderRadius: Layout.radius.md,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: isDisabled ? 0.45 : 1,
  };

  const textStyle: TextStyle = {
    color: v.text,
    fontSize: s.fontSize,
    fontWeight: '600',
    letterSpacing: 0.3,
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[styles.base, containerStyle, animatedStyle, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.loaderColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={s.iconSize}
              color={v.text}
              style={styles.icon}
            />
          )}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 2,
  },
});
