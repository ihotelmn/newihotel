import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from '@ihotel/config';

interface PillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Pill({ label, active = false, onPress }: PillProps) {
  return (
    <TouchableOpacity
      style={[styles.base, active && styles.active]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
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
