import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { FlashList } from '@shopify/flash-list';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  Search as SearchIcon,
  X,
  Sparkles,
  LayoutGrid,
  Building2,
  Home,
  Hotel,
  Tent,
  SearchX,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { HotelCard, Pill, TabBar, Button } from '@ihotel/ui';
import type { TabItem } from '@ihotel/ui';
import { useHaptic } from '@ihotel/ui';
import { fetchHotels, searchHotels } from '@ihotel/api';
import { useDebounce, useAsyncData } from '@ihotel/hooks';
import {
  colors,
  radius,
  fontWeights,
  spacing,
  animation,
  easing,
} from '@ihotel/config';
import type { Hotel as HotelType } from '@ihotel/types';

/* ─── constants ─── */

const CATEGORIES = [
  { label: 'Бүгд', Icon: LayoutGrid },
  { label: 'Resort', Icon: Building2 },
  { label: 'Гэр буудал', Icon: Home },
  { label: 'Hotel', Icon: Hotel },
  { label: 'Camp', Icon: Tent },
] as const;

const SORT_OPTIONS = [
  '✨ AI санал',
  'Хямдаас',
  'Рейтинг',
  'Ойр',
  '✓ Verified',
] as const;

const GUEST_TABS: TabItem[] = [
  { key: 'search', label: 'Хайх', icon: 'search' },
  { key: 'ai', label: 'AI', icon: 'sparkles' },
  { key: 'trips', label: 'Аялал', icon: 'map', badge: '1' },
  { key: 'saved', label: 'Хадгал.', icon: 'heart' },
  { key: 'profile', label: 'Профайл', icon: 'user' },
];

/* ─── skeleton loader ─── */

function CardSkeleton() {
  return (
    <SkeletonPlaceholder borderRadius={radius.md}>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        alignItems="center"
        padding={spacing.md}
        gap={spacing.md}
      >
        <SkeletonPlaceholder.Item width={88} height={88} borderRadius={radius.md} />
        <SkeletonPlaceholder.Item flex={1} gap={8}>
          <SkeletonPlaceholder.Item width="80%" height={16} />
          <SkeletonPlaceholder.Item width="50%" height={12} />
          <SkeletonPlaceholder.Item width="40%" height={12} />
          <SkeletonPlaceholder.Item width="35%" height={16} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
}

function LoadingSkeleton() {
  return (
    <View style={skeletonStyles.wrap}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={skeletonStyles.card}>
          <CardSkeleton />
        </View>
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border as string,
    overflow: 'hidden',
  },
});

/* ─── empty state ─── */

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View style={emptyStyles.wrap}>
      <View style={emptyStyles.iconCircle}>
        <SearchX size={48} color={colors.primary} strokeWidth={1.5} />
      </View>
      <Text style={emptyStyles.title}>Тохирох буудал олдсонгүй</Text>
      <Text style={emptyStyles.subtitle}>Шүүлтүүрээ өөрчилж үзээрэй</Text>
      <Button title="Шүүлт цэвэрлэх" variant="ghost" onPress={onReset} />
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

/* ─── search screen ─── */

export default function SearchScreen() {
  const router = useRouter();
  const haptic = useHaptic();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSort, setActiveSort] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const { data: allHotels, loading, refetch } = useAsyncData(
    () => (debouncedQuery ? searchHotels(debouncedQuery) : fetchHotels()),
    [debouncedQuery],
  );

  // blur header on scroll
  const scrollY = useSharedValue(0);

  const blurOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 20, 40], [0, 0, 1], Extrapolation.CLAMP),
  }));

  // AI banner slide-down
  const bannerTranslateY = useSharedValue(-30);
  useEffect(() => {
    bannerTranslateY.value = withSpring(0, easing.outSoft);
  }, []);
  const bannerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bannerTranslateY.value }],
  }));

  // filter logic
  const hotels = useMemo(() => {
    if (!allHotels) return [];
    let filtered = [...allHotels];

    const cat = CATEGORIES[activeCategory]?.label;
    if (cat === 'Resort') {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes('resort') ||
          h.name.toLowerCase().includes('ресорт'),
      );
    } else if (cat === 'Гэр буудал') {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes('гэр') ||
          h.name.toLowerCase().includes('кэмп') ||
          h.name.toLowerCase().includes('camp'),
      );
    } else if (cat === 'Hotel') {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes('отель') ||
          h.name.toLowerCase().includes('hotel'),
      );
    } else if (cat === 'Camp') {
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes('кэмп') ||
          h.name.toLowerCase().includes('camp') ||
          h.name.toLowerCase().includes('глампинг'),
      );
    }

    const sort = SORT_OPTIONS[activeSort];
    if (sort === 'Хямдаас') {
      filtered.sort((a, b) => a.price_min - b.price_min);
    } else if (sort === 'Рейтинг') {
      filtered.sort((a, b) => b.avg_rating - a.avg_rating);
    }

    return filtered;
  }, [allHotels, activeCategory, activeSort]);

  const handleToggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    toast('Шинэчилэв ✓', { duration: 2000 });
  }, [refetch]);

  const handleResetFilters = useCallback(() => {
    setActiveCategory(0);
    setActiveSort(0);
    setQuery('');
  }, []);

  const renderHotelItem = useCallback(
    ({ item }: { item: HotelType }) => (
      <HotelCard
        hotel={item}
        saved={savedIds.has(item.id)}
        onPress={() => router.push(`/hotel/${item.id}`)}
        onToggleSave={handleToggleSave}
      />
    ),
    [savedIds, handleToggleSave],
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header with blur */}
      <View style={styles.headerWrap}>
        <Animated.View style={[StyleSheet.absoluteFill, blurOpacity]}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        </Animated.View>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerLabel}>Хайлт</Text>
            <Text style={styles.headerTitle}>Хархорин · 2 хүн · 2 шөнө</Text>
          </View>
          <Pressable
            style={styles.aiBtn}
            onPress={() => toast('AI туслах удахгүй...', { duration: 2000 })}
          >
            <Sparkles size={18} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={styles.searchBarWrap}>
          <View
            style={[
              styles.searchBar,
              searchFocused && styles.searchBarFocused,
            ]}
          >
            <SearchIcon size={16} color="#888780" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Буудлын нэрээр хайх..."
              placeholderTextColor="#888780"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <X size={14} color="#888780" strokeWidth={2} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = activeCategory === i;
            return (
              <Pressable
                key={cat.label}
                style={styles.categoryItem}
                onPress={() => {
                  haptic.light();
                  setActiveCategory(i);
                }}
              >
                <cat.Icon
                  size={20}
                  color={isActive ? colors.primary : '#888780'}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ opacity: isActive ? 1 : 0.5 }}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Sort pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {SORT_OPTIONS.map((opt, i) => (
            <Pill
              key={opt}
              label={opt}
              active={activeSort === i}
              onPress={() => setActiveSort(i)}
            />
          ))}
        </ScrollView>
      </View>

      {/* AI banner */}
      <Animated.View style={[styles.aiBanner, bannerStyle]}>
        <Sparkles size={14} color="#04342C" strokeWidth={2} />
        <Text style={styles.aiBannerText}>
          AI таны хайлтад тохируулан эрэмбэлсэн
        </Text>
      </Animated.View>

      {/* View toggle */}
      <View style={styles.viewToggle}>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'list' && styles.toggleTextActive,
            ]}
          >
            Жагсаалт
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => {
            setViewMode('map');
            toast('Газрын зураг удахгүй...', { duration: 2000 });
          }}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'map' && styles.toggleTextActive,
            ]}
          >
            Газрын зураг
          </Text>
        </Pressable>
      </View>

      {/* Hotel list */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <FlashList<HotelType>
          data={hotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<EmptyState onReset={handleResetFilters} />}
          onScroll={(e) => {
            scrollY.value = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      {/* Bottom tab bar */}
      <TabBar
        tabs={GUEST_TABS}
        activeKey="search"
        onTabPress={(key) => {
          if (key === 'search') return;
          toast(`${key} удахгүй...`, { duration: 1500 });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F1EFE8',
  },

  /* header */
  headerWrap: {
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg + 4,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: fontWeights.medium as '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginTop: 2,
  },
  aiBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* search bar */
  searchBarWrap: {
    paddingHorizontal: spacing.lg - 2,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    height: 44,
  },
  searchBarFocused: {
    borderColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  /* categories */
  categoryRow: {
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.sm,
    gap: spacing.xl,
  },
  categoryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#888780',
    opacity: 0.5,
  },
  categoryLabelActive: {
    color: colors.primary,
    fontWeight: fontWeights.medium as '500',
    opacity: 1,
  },

  /* pills */
  pillRow: {
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.sm,
    gap: 6,
  },

  /* AI banner */
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#E1F5EE',
    paddingHorizontal: spacing.lg,
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#5DCAA5',
  },
  aiBannerText: {
    fontSize: 12,
    fontWeight: fontWeights.medium as '500',
    color: '#04342C',
  },

  /* view toggle */
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1EFE8',
    borderRadius: radius.pill,
    padding: 4,
    marginHorizontal: spacing.lg,
    marginTop: 14,
    marginBottom: spacing.md,
    gap: 2,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
  },
  toggleActive: {
    backgroundColor: colors.card,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: fontWeights.medium as '500',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textPrimary,
  },

  /* list */
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  separator: {
    height: spacing.sm,
  },
});
