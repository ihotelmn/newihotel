import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from '@ihotel/config';

interface BadgeProps {
  label: string;
  variant?: 'teal' | 'outline' | 'muted';
}

export function Badge({ label, variant = 'teal' }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'teal' && styles.teal,
        variant === 'outline' && styles.outline,
        variant === 'muted' && styles.muted,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'teal' && styles.tealText,
          variant === 'outline' && styles.outlineText,
          variant === 'muted' && styles.mutedText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  teal: {
    backgroundColor: '#E1F5EE',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  muted: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  text: {
    fontSize: 12,
    fontWeight: fontWeights.medium as '500',
  },
  tealText: {
    color: '#04342C',
  },
  outlineText: {
    color: colors.textSecondary,
  },
  mutedText: {
    color: colors.textSecondary,
  },
});
