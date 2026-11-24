/**
 * VIRTUWEAR AI — Premium Text Input Component
 *
 * Features: label, error, left icon, password toggle, focus animation.
 */

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TextInputProps,
  ViewStyle,
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

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  multiline?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  editable?: boolean;
  maxLength?: number;
  style?: ViewStyle;
}

const AnimatedView = Animated.View;

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  icon,
  multiline = false,
  keyboardType,
  autoCapitalize = 'none',
  editable = true,
  maxLength,
  style,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const borderProgress = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    borderProgress.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderProgress.value = withTiming(0, { duration: 200 });
  };

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor:
      error
        ? Colors.danger
        : borderProgress.value > 0.5
        ? Colors.lavender
        : Colors.border,
  }));

  const showPassword = secureTextEntry && !passwordVisible;

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <AnimatedView style={[styles.container, animatedBorder, multiline && styles.multiline]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? Colors.lavender : Colors.mutedText}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            secureTextEntry && styles.inputWithToggle,
            multiline && styles.multilineInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.mutedText}
          secureTextEntry={showPassword}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={Colors.lavender}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setPasswordVisible((v) => !v)}
            hitSlop={Layout.hitSlop}
            style={styles.toggle}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.mutedText}
            />
          </Pressable>
        )}
      </AnimatedView>

      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={Colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    ...Typography.label,
    color: Colors.ivory,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Layout.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minHeight: 50,
  },
  multiline: {
    minHeight: 110,
    alignItems: 'flex-start',
  },
  leftIcon: {
    marginLeft: 14,
  },
  input: {
    flex: 1,
    color: Colors.ivory,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  inputWithToggle: {
    paddingRight: 44,
  },
  multilineInput: {
    paddingTop: 14,
    minHeight: 100,
  },
  toggle: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
  },
});
