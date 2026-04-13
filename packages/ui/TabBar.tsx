import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontWeights } from '@ihotel/config';

export interface TabItem {
  key: string;
  label: string;
  icon: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
}

export function TabBar({ tabs, activeKey, onTabPress }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  icon: {
    fontSize: 20,
    color: '#888780',
  },
  activeIcon: {
    color: colors.primary,
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
