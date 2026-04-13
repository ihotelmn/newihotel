import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Search,
  Sparkles,
  Map,
  Heart,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { colors, fontWeights, spacing } from '@ihotel/config';
import { useHaptic } from './hooks/useHaptic';

export interface TabItem {
  key: string;
  label: string;
  icon: string;
  badge?: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  search: Search,
  sparkles: Sparkles,
  map: Map,
  heart: Heart,
  user: User,
};

export function TabBar({ tabs, activeKey, onTabPress }: TabBarProps) {
  const haptic = useHaptic();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        const IconComponent = ICON_MAP[tab.icon] ?? Search;
        const iconColor = isActive ? colors.primary : '#888780';

        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => {
              haptic.light();
              onTabPress(tab.key);
            }}
          >
            <View style={styles.iconWrap}>
              <IconComponent
                size={22}
                color={iconColor}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {tab.badge && (
                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            {isActive && <View style={styles.activeDot} />}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: spacing.sm,
    paddingBottom: 24,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    position: 'relative',
  },
  badgeWrap: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#E24B4A',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeDot: {
    width: 6,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 10,
    fontWeight: fontWeights.medium as '500',
    color: '#888780',
  },
  activeLabel: {
    color: colors.primary,
  },
});
