import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, fontWeights, spacing, easing } from '@ihotel/config';
import { useHaptic } from './hooks/useHaptic';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const haptic = useHaptic();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, easing.out);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, easing.out);
  };

  const handlePress = () => {
    haptic.light();
    onPress?.();
  };

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const textColor = variantTextColors[variant];
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      style={[
        styles.base,
        variantStyle,
        sizeStyle,
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
        />
      ) : (
        <Text
          style={[
            styles.text,
            sizeTextStyles[size],
            { color: textColor },
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const variantTextColors: Record<Variant, string> = {
  primary: '#FFFFFF',
  secondary: colors.primary,
  ghost: colors.textPrimary,
  destructive: '#FFFFFF',
};

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#DC2626',
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
  },
});

const sizeTextStyles = StyleSheet.create({
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
});

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: fontWeights.medium as '500',
  },
});
