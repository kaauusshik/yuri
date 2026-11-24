/**
 * YURI AI — Splash / Landing Screen
 * Premium fashion editorial landing with animated entrance.
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    logoTranslateY.value = withDelay(300, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));

    taglineOpacity.value = withDelay(800, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    subtitleOpacity.value = withDelay(1200, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));

    buttonsOpacity.value = withDelay(1500, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    buttonsTranslateY.value = withDelay(1500, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }));

    // Subtle glow pulse
    glowOpacity.value = withDelay(
      1800,
      withSequence(
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.3, { duration: 2000 }),
        withTiming(0.6, { duration: 2000 })
      )
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['#111318', '#161821', '#111318']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ambient lavender glow behind logo */}
      <Animated.View style={[styles.glowContainer, glowStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(200, 180, 255, 0.06)', 'transparent']}
          style={styles.glow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      {/* Center content area */}
      <View style={styles.content}>
        {/* Logo area */}
        <Animated.View style={[styles.logoArea, logoStyle]}>
          {/* Decorative line above */}
          <View style={styles.decorLine} />

          <View style={styles.logoRow}>
            <Text style={styles.brandText}>YURI</Text>
          </View>

          <View style={styles.aiContainer}>
            <View style={styles.aiLine} />
            <Text style={styles.aiText}>AI</Text>
            <View style={styles.aiLine} />
          </View>

          {/* Decorative line below */}
          <View style={styles.decorLine} />
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineArea, taglineStyle]}>
          <Text style={styles.tagline}>Your style. Your rules.</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleArea, subtitleStyle]}>
          <Text style={styles.subtitle}>
            Try it. Style it. Wear it. Buy it.
          </Text>
        </Animated.View>
      </View>

      {/* Bottom buttons */}
      <Animated.View style={[styles.bottomArea, buttonsStyle, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}>
        <AnimatedPressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={() => router.push('/(auth)/welcome')}
          entering={FadeIn.delay(1500).duration(500)}
        >
          <LinearGradient
            colors={['#C8B4FF', '#B09EE8']}
            style={styles.primaryButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </LinearGradient>
        </AnimatedPressable>

        <Pressable
          style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.ghostButtonText}>I have an account</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 300,
    height: 400,
    borderRadius: 200,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  decorLine: {
    width: 40,
    height: 1,
    backgroundColor: Colors.lavender,
    opacity: 0.3,
    marginVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.ivory,
    letterSpacing: 8,
  },
  aiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  aiLine: {
    width: 24,
    height: 1,
    backgroundColor: Colors.lavender,
    opacity: 0.5,
  },
  aiText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.lavender,
    letterSpacing: 10,
  },
  taglineArea: {
    marginBottom: 12,
  },
  tagline: {
    ...Typography.body,
    color: Colors.mutedText,
    fontSize: 17,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitleArea: {
    marginTop: 4,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.lavender,
    opacity: 0.7,
    fontSize: 14,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  bottomArea: {
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonGradient: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.midnight,
    fontSize: 17,
    fontWeight: '700',
  },
  ghostButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghostButtonPressed: {
    backgroundColor: 'rgba(200, 180, 255, 0.05)',
  },
  ghostButtonText: {
    ...Typography.button,
    color: Colors.ivory,
    fontSize: 16,
    fontWeight: '500',
  },
});
