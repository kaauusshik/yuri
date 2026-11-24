/**
 * VIRTUWEAR AI — Loading Overlay
 *
 * Full-screen loading overlay with blur, pulsing indicator, and optional message.
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface LoadingOverlayProps {
  visible?: boolean;
  message?: string;
}

export default function LoadingOverlay({
  visible = true,
  message,
}: LoadingOverlayProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      pulse.value = withRepeat(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [visible, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.45 + 0.55 * (1 / pulse.value),
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.backdrop} />

      <View style={styles.center}>
        <Animated.View style={[styles.ring, pulseStyle]}>
          <View style={styles.innerRing}>
            <ActivityIndicator size="large" color={Colors.lavender} />
          </View>
        </Animated.View>

        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 19, 24, 0.7)',
  },
  center: {
    alignItems: 'center',
    gap: 20,
  },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: 'rgba(200, 180, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(200, 180, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.ivory,
    textAlign: 'center',
    maxWidth: 240,
  },
});
