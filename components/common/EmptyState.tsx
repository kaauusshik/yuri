/**
 * VIRTUWEAR AI — Empty State Component
 *
 * Centered placeholder with icon, title, description, and optional action button.
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <View style={styles.iconRing}>
          <Ionicons name={icon} size={44} color={Colors.lavender} />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {actionTitle && onAction && (
        <View style={styles.actionWrapper}>
          <Button
            title={actionTitle}
            onPress={onAction}
            variant="secondary"
            size="md"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.lavenderSubtle,
    borderWidth: 1,
    borderColor: 'rgba(200, 180, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h4,
    color: Colors.ivory,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.mutedText,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionWrapper: {
    marginTop: 28,
  },
});
