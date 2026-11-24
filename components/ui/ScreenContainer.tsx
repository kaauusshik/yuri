/**
 * VIRTUWEAR AI — Screen Container
 *
 * Base screen wrapper with SafeAreaView, optional ScrollView, header with back button.
 */

import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  title?: string;
  showBack?: boolean;
  headerRight?: React.ReactNode;
  style?: ViewStyle;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}

export default function ScreenContainer({
  children,
  scrollable = false,
  title,
  showBack = false,
  headerRight,
  style,
  edges = ['top', 'left', 'right'],
}: ScreenContainerProps) {
  const router = useRouter();

  const showHeader = !!(title || showBack || headerRight);

  const header = showHeader ? (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={Layout.hitSlop}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.ivory} />
          </Pressable>
        )}
        {title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
    </View>
  ) : null;

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.body, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.midnight} />
      {header}
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screen.paddingHorizontal,
    paddingTop: 8,
    paddingBottom: 12,
    minHeight: 52,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    flexShrink: 0,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    ...Typography.h3,
    color: Colors.ivory,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screen.paddingHorizontal,
    paddingBottom: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: Layout.screen.paddingHorizontal,
  },
});
