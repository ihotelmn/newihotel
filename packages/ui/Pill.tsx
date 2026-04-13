import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, radius, fontWeights, easing } from '@ihotel/config';
import { useHaptic } from './hooks/useHaptic';

interface PillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Pill({ label, active = false, onPress }: PillProps) {
  const scale = useSharedValue(1);
  const haptic = useHaptic();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, easing.out);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, easing.out);
  };

  const handlePress = () => {
    haptic.light();
    onPress?.();
  };

  return (
    <AnimatedPressable
      style={[styles.base, active && styles.active, animatedStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#F1EFE8',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  active: {
    backgroundColor: '#04342C',
  },
  text: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: colors.textSecondary,
  },
  activeText: {
    color: '#FFFFFF',
  },
});
