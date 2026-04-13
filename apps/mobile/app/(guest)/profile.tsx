import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  Edit3,
  Map,
  Heart,
  Star,
  Percent,
  ChevronRight,
  Settings,
  HelpCircle,
  Building2,
  Lock,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  colors,
  fontWeights,
  fontSize,
  spacing,
  radius,
  easing,
  animation,
} from '@ihotel/config';
import { Avatar, TabBar, useHaptic } from '@ihotel/ui';
import type { TabItem } from '@ihotel/ui';

/* ─── constants ─── */

const GUEST_TABS: TabItem[] = [
  { key: 'search', label: 'Хайх', icon: 'search' },
  { key: 'ai', label: 'AI', icon: 'sparkles' },
  { key: 'trips', label: 'Аялал', icon: 'map', badge: '1' },
  { key: 'saved', label: 'Хадгал.', icon: 'heart' },
  { key: 'profile', label: 'Профайл', icon: 'user' },
];

const QUICK_ACTIONS = [
  { key: 'trips', label: 'Аялал', Icon: Map, color: '#3B82F6' },
  { key: 'saved', label: 'Хадгал.', Icon: Heart, color: '#E24B4A' },
  { key: 'reviews', label: 'Үнэлгээ', Icon: Star, color: '#F59E0B' },
  { key: 'deals', label: 'Хөнгөлөлт', Icon: Percent, color: '#8B5CF6' },
] as const;

const DISCOVERY_HOTELS = [
  { id: 'h1', name: 'Тэрэлж Lodge', city: 'Тэрэлж', price: 180000, image: 'https://picsum.photos/seed/lodge1/280/200' },
  { id: 'h2', name: 'Хустай Camp', city: 'Хустай', price: 120000, image: 'https://picsum.photos/seed/camp2/280/200' },
  { id: 'h3', name: 'Горхи Resort', city: 'Горхи-Тэрэлж', price: 250000, image: 'https://picsum.photos/seed/resort3/280/200' },
];

/* ─── loyalty card ─── */

function LoyaltyCard() {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, easing.out));
    opacity.value = withDelay(200, withTiming(1, { duration: animation.base }));
    translateY.value = withDelay(200, withSpring(0, easing.out));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[loyaltyStyles.wrap, animStyle]}>
      <LinearGradient
        colors={['#04342C', '#0F6E56']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={loyaltyStyles.card}
      >
        <View style={loyaltyStyles.topRow}>
          <View>
            <Text style={loyaltyStyles.tierLabel}>Silver tier</Text>
            <Text style={loyaltyStyles.points}>240 оноо</Text>
          </View>
          <Text style={loyaltyStyles.tierEmoji}>🥈</Text>
        </View>

        <View style={loyaltyStyles.progressBg}>
          <View style={loyaltyStyles.progressFill} />
        </View>

        <Text style={loyaltyStyles.progressLabel}>
          110 оноо Gold болох
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const loyaltyStyles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: radius.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#04342C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg + 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  tierLabel: {
    fontSize: fontSize.caption,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.xs,
  },
  points: {
    fontSize: fontSize.h1,
    fontWeight: fontWeights.semibold as '600',
    color: '#FFFFFF',
  },
  tierEmoji: {
    fontSize: 36,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: spacing.sm,
  },
  progressFill: {
    width: '65%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5DCAA5',
  },
  progressLabel: {
    fontSize: fontSize.caption,
    color: 'rgba(255,255,255,0.7)',
  },
});

/* ─── menu row ─── */

function MenuRow({
  label,
  badge,
  onPress,
  featured,
  dark,
}: {
  label: string;
  badge?: string;
  onPress?: () => void;
  featured?: boolean;
  dark?: boolean;
}) {
  return (
    <Pressable
      style={[
        menuStyles.row,
        featured && menuStyles.featured,
        dark && menuStyles.dark,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          menuStyles.label,
          featured && menuStyles.featuredLabel,
          dark && menuStyles.darkLabel,
        ]}
      >
        {label}
      </Text>
      <View style={menuStyles.right}>
        {badge && (
          <View style={menuStyles.badge}>
            <Text style={menuStyles.badgeText}>{badge}</Text>
          </View>
        )}
        <ChevronRight
          size={16}
          color={dark ? '#FFFFFF' : featured ? colors.primary : colors.textSecondary}
          strokeWidth={2}
        />
      </View>
    </Pressable>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg - 2,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border as string,
    minHeight: 52,
  },
  featured: {
    backgroundColor: '#E1F5EE',
    borderBottomColor: '#B8E4D4',
  },
  dark: {
    backgroundColor: colors.textPrimary,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
  },
  featuredLabel: {
    fontWeight: fontWeights.medium as '500',
    color: '#04342C',
  },
  darkLabel: {
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
});

/* ─── profile screen ─── */

export default function ProfileScreen() {
  const router = useRouter();
  const haptic = useHaptic();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar name="Бат-Эрдэнэ" size={56} />
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Бат-Эрдэнэ</Text>
              </View>
              <Text style={styles.sub}>8811-2345 · 3 захиалга · ★ 4.9</Text>
            </View>
          </View>
          <Pressable style={styles.editBtn} hitSlop={12}>
            <Edit3 size={18} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Loyalty card */}
        <LoyaltyCard />

        {/* Quick actions */}
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={styles.quickItem}
              onPress={() => haptic.light()}
            >
              <View
                style={[
                  styles.quickIcon,
                  { backgroundColor: action.color + '12' },
                ]}
              >
                <action.Icon size={24} color={action.color} strokeWidth={1.8} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Discovery row */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Шинэ санал</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.discoveryRow}
        >
          {DISCOVERY_HOTELS.map((h) => (
            <Pressable
              key={h.id}
              style={styles.discoveryCard}
              onPress={() => {
                haptic.light();
                router.push(`/hotel/${h.id}`);
              }}
            >
              <Image
                source={{ uri: h.image }}
                style={styles.discoveryImage}
                contentFit="cover"
                transition={200}
              />
              <Text style={styles.discoveryName} numberOfLines={1}>
                {h.name}
              </Text>
              <Text style={styles.discoveryMeta}>
                {h.city} · ₮{(h.price / 1000).toFixed(0)}K
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Menu */}
        <View style={styles.menuSection}>
          <MenuRow label="Миний аялал" badge="3" />
          <MenuRow label="Хадгалсан" />
          <MenuRow label="Үнэлгээ" badge="2" />
        </View>

        <View style={styles.menuSection}>
          <MenuRow
            label="🏨 Буудлын эзэн үү?"
            featured
            onPress={() => haptic.light()}
          />
          <MenuRow
            label="XRoom · Хувийн орон зай"
            dark
            onPress={() => haptic.light()}
          />
        </View>

        <View style={styles.menuSection}>
          <MenuRow label="Тохиргоо" />
          <MenuRow label="Тусламж" />
        </View>

        {/* Version */}
        <Text style={styles.version}>iHotel v1.0.0 · Made in Mongolia 🇲🇳</Text>
      </ScrollView>

      {/* Bottom tab */}
      <TabBar
        tabs={GUEST_TABS}
        activeKey="profile"
        onTabPress={(key) => {
          if (key === 'profile') return;
          if (key === 'search') router.replace('/(guest)/search');
          else if (key === 'ai') router.push('/(guest)/ai');
          else if (key === 'trips') router.push('/(guest)/trips');
          else if (key === 'saved') router.push('/(guest)/saved');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xl },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg + 4,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  headerInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.h2,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* quick actions */
  quickGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeights.medium as '500',
    color: colors.textSecondary,
  },

  /* discovery */
  sectionHeader: {
    paddingHorizontal: spacing.lg + 4,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.h3,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  discoveryRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  discoveryCard: {
    width: 140,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.border as string,
  },
  discoveryImage: {
    width: 140,
    height: 96,
  },
  discoveryName: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  discoveryMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    marginTop: 2,
  },

  /* menu */
  menuSection: {
    marginBottom: spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: colors.border as string,
  },

  /* version */
  version: {
    textAlign: 'center',
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    opacity: 0.5,
    paddingVertical: spacing.lg,
  },
});
