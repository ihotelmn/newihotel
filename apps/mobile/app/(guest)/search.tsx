import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { HotelCard, Pill, TabBar } from '@ihotel/ui';
import type { TabItem } from '@ihotel/ui';
import { fetchHotels, searchHotels } from '@ihotel/api';
import { useDebounce, useAsyncData } from '@ihotel/hooks';
import { colors, radius, fontWeights } from '@ihotel/config';
import type { Hotel } from '@ihotel/types';

const CATEGORIES = ['Бүгд', 'Resort', 'Гэр буудал', 'Hotel', 'Camp'] as const;
const SORT_OPTIONS = ['AI санал', 'Хямдаас', 'Рейтинг', 'Ойр', 'Verified'] as const;

const GUEST_TABS: TabItem[] = [
  { key: 'search', label: 'Хайх', icon: '🔍' },
  { key: 'ai', label: 'AI', icon: '✨' },
  { key: 'trips', label: 'Аялал', icon: '🧳' },
  { key: 'saved', label: 'Хадгал.', icon: '❤️' },
  { key: 'profile', label: 'Профайл', icon: '👤' },
];

type ViewMode = 'list' | 'map';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeSort, setActiveSort] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const debouncedQuery = useDebounce(query, 300);

  const { data: allHotels, loading } = useAsyncData(
    () => (debouncedQuery ? searchHotels(debouncedQuery) : fetchHotels()),
    [debouncedQuery],
  );

  const hotels = useMemo(() => {
    if (!allHotels) return [];
    let filtered = [...allHotels];

    const cat = CATEGORIES[activeCategory];
    if (cat === 'Resort') {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes('resort') ||
        h.name.toLowerCase().includes('ресорт')
      );
    } else if (cat === 'Гэр буудал') {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes('гэр') ||
        h.name.toLowerCase().includes('кэмп') ||
        h.name.toLowerCase().includes('camp')
      );
    } else if (cat === 'Hotel') {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes('отель') ||
        h.name.toLowerCase().includes('hotel')
      );
    } else if (cat === 'Camp') {
      filtered = filtered.filter((h) =>
        h.name.toLowerCase().includes('кэмп') ||
        h.name.toLowerCase().includes('camp') ||
        h.name.toLowerCase().includes('глампинг')
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

  const handleHotelPress = (hotel: Hotel) => {
    router.push(`/hotel/${hotel.id}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Хархорин · 2 хүн</Text>
          <Text style={styles.headerSub}>4-р сар 20 — 22 (2 шөнө)</Text>
        </View>
        <TouchableOpacity style={styles.aiBtn}>
          <Text style={styles.aiBtnText}>✨</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Буудлын нэрээр хайх..."
          placeholderTextColor="#888780"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      {/* Category row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {CATEGORIES.map((cat, i) => (
          <Pill
            key={cat}
            label={cat}
            active={activeCategory === i}
            onPress={() => setActiveCategory(i)}
          />
        ))}
      </ScrollView>

      {/* Sort filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.sortScroll}
      >
        {SORT_OPTIONS.map((opt, i) => (
          <Pill
            key={opt}
            label={i === 0 ? `${opt} ↓` : opt}
            active={activeSort === i}
            onPress={() => setActiveSort(i)}
          />
        ))}
      </ScrollView>

      {/* AI Banner */}
      <View style={styles.aiBanner}>
        <Text style={styles.aiBannerText}>
          ✨ Танд тохирох ажиглалт: жижиг буудлууд эхэнд
        </Text>
      </View>

      {/* View toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
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
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'map' && styles.toggleTextActive,
            ]}
          >
            Газар
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hotel list */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Илэрц олдсонгүй</Text>
          }
        />
      )}

      {/* Bottom tab bar */}
      <TabBar
        tabs={GUEST_TABS}
        activeKey="search"
        onTabPress={(key) => {
          if (key === 'search') return;
          // Other tabs — placeholder
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    gap: 8,
  },
  backBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: colors.textPrimary,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  aiBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBtnText: {
    fontSize: 18,
  },
  searchBarWrap: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  searchInput: {
    backgroundColor: '#F1EFE8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.textPrimary,
  },
  filterScroll: {
    flexGrow: 0,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  sortScroll: {
    flexGrow: 0,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  filterRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  aiBanner: {
    backgroundColor: '#E1F5EE',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#5DCAA5',
  },
  aiBannerText: {
    fontSize: 12,
    fontWeight: fontWeights.medium as '500',
    color: '#04342C',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1EFE8',
    borderRadius: radius.pill,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    gap: 2,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 40,
    fontSize: 16,
  },
});
