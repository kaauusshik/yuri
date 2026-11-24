/**
 * YURI AI — Auth Stack Layout
 * Stack navigator for authentication screens with transparent headers.
 */

import { Stack } from 'expo-router';
import Colors from '@/constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.midnight },
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: Colors.ivory,
        headerShadowVisible: false,
        headerTransparent: true,
        headerBackTitle: '',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
