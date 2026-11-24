/**
 * YURI AI — Root Layout
 * Configures providers, fonts, splash screen, and root navigation.
 */

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import Colors from '@/constants/Colors';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && inAuthGroup) {
      // Signed in but on auth screen → go to main app
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inTabsGroup) {
      // Not signed in but on protected screen → go to landing
      router.replace('/');
    }
  }, [isAuthenticated, isInitialized, segments]);
}

function RootLayoutNav() {
  useProtectedRoute();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.midnight },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts (system fallbacks used if unavailable)
        await Font.loadAsync({
          // Add custom font files here when available
          // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        }).catch(() => {
          // Font loading failed — system fonts will be used
        });

        // Initialize auth state
        await initialize();
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
});
