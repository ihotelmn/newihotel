import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Search, X, Star, Sparkles, Map, Heart, User } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'city', label: 'Хотын' },
  { id: 'nature', label: 'Байгаль' },
  { id: 'ger', label: 'Гэр буудал' },
  { id: 'resort', label: 'Рисорт' },
  { id: 'budget', label: 'Хямд' },
];

const HOTELS = [
  { id: '1', name: 'Шангри-Ла Улаанбаатар', city: 'Улаанбаатар', price: 450000, rating: 4.8, reviews: 342, cat: 'city', image: 'https://picsum.photos/seed/hotel1/400/300' },
  { id: '2', name: 'Тэрэлж Лодж', city: 'Тэрэлж', price: 180000, rating: 4.6, reviews: 128, cat: 'nature', image: 'https://picsum.photos/seed/hotel2/400/300' },
  { id: '3', name: 'Говийн Гэр Кэмп', city: 'Өмнөговь', price: 95000, rating: 4.5, reviews: 87, cat: 'ger', image: 'https://picsum.photos/seed/hotel3/400/300' },
  { id: '4', name: 'Хустайн Рисорт', city: 'Хустай', price: 320000, rating: 4.7, reviews: 215, cat: 'resort', image: 'https://picsum.photos/seed/hotel4/400/300' },
  { id: '5', name: 'Номад Гэстхаус', city: 'Улаанбаатар', price: 55000, rating: 4.3, reviews: 64, cat: 'budget', image: 'https://picsum.photos/seed/hotel5/400/300' },
  { id: '6', name: 'Блү Скай Хотел', city: 'Улаанбаатар', price: 380000, rating: 4.7, reviews: 298, cat: 'city', image: 'https://picsum.photos/seed/hotel6/400/300' },
  { id: '7', name: 'Хөвсгөл Лодж', city: 'Хөвсгөл', price: 210000, rating: 4.9, reviews: 176, cat: 'nature', image: 'https://picsum.photos/seed/hotel7/400/300' },
  { id: '8', name: 'Алтай Гэр Кэмп', city: 'Баян-Өлгий', price: 85000, rating: 4.4, reviews: 53, cat: 'ger', image: 'https://picsum.photos/seed/hotel8/400/300' },
  { id: '9', name: 'Чингис Хаан Хотел', city: 'Улаанбаатар', price: 290000, rating: 4.6, reviews: 410, cat: 'city', image: 'https://picsum.photos/seed/hotel9/400/300' },
  { id: '10', name: 'Горхи Тэрэлж Рисорт', city: 'Тэрэлж', price: 350000, rating: 4.8, reviews: 192, cat: 'resort', image: 'https://picsum.photos/seed/hotel10/400/300' },
];

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

const TAB_ICONS: Record<string, typeof Search> = {
  search: Search,
  ai: Sparkles,
  trips: Map,
  saved: Heart,
  profile: User,
};

function TabBar({ active }: { active: string }) {
  const router = useRouter();
  const tabs = [
    { key: 'search', label: 'Хайх', route: '/(guest)/search' },
    { key: 'ai', label: 'AI', route: '/(guest)/ai' },
    { key: 'trips', label: 'Аялал', route: '/(guest)/trips' },
    { key: 'saved', label: 'Хадгал', route: '/(guest)/saved' },
    { key: 'profile', label: 'Профайл', route: '/(guest)/profile' },
  ];
  return (
    <View style={tabS.bar}>
      {tabs.map((t) => {
        const Icon = TAB_ICONS[t.key] ?? Search;
        const isActive = t.key === active;
        return (
          <Pressable
            key={t.key}
            style={tabS.tab}
            onPress={() => {
              if (!isActive) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace(t.route as any);
              }
            }}
          >
            <Icon size={22} color={isActive ? '#0F6E56' : '#999'} strokeWidth={isActive ? 2.2 : 1.8} />
            <Text style={[tabS.label, isActive && tabS.active]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SearchScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = HOTELS.filter((h) => {
    const matchCat = category === 'all' || h.cat === category;
    const matchSearch =
      search === '' ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCategoryPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCategory(id);
  };

  const renderHotel = useCallback(
    ({ item }: { item: (typeof HOTELS)[0] }) => (
      <Pressable
        style={({ pressed }) => [s.card, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
        onPress={() => router.push(`/hotel/${item.id}`)}
      >
        <ExpoImage
          source={{ uri: item.image }}
          placeholder={{ blurhash: BLURHASH }}
          style={s.cardImage}
          contentFit="cover"
          transition={200}
        />
        <View style={s.cardBody}>
          <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={s.cardCity}>{item.city}</Text>
          <View style={s.cardRow}>
            <View style={s.ratingRow}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
              <Text style={s.cardRating}>{item.rating}</Text>
              <Text style={s.cardReviews}>({item.reviews})</Text>
            </View>
            <Text style={s.cardPrice}>
              {'₮' + item.price.toLocaleString()}
              <Text style={s.cardNight}> /шөнө</Text>
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [router],
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.greeting}>{'Сайн байна уу! \u{1F44B}'}</Text>
        <Text style={s.title}>Хаашаа аялах вэ?</Text>
      </View>

      <View style={s.searchBox}>
        <Search size={18} color="#999" strokeWidth={2} />
        <TextInput
          style={s.searchInput}
          placeholder="Хотел, газар хайх..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <X size={18} color="#999" strokeWidth={2} />
          </Pressable>
        )}
      </View>

      <View style={s.catRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catScroll}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={[s.catPill, category === c.id && s.catPillActive]}
              onPress={() => handleCategoryPress(c.id)}
            >
              <Text style={[s.catText, category === c.id && s.catTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderHotel}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyIcon}>{'🔍'}</Text>
            <Text style={s.emptyText}>Илэрц олдсонгүй</Text>
            <Text style={s.emptySub}>Өөр түлхүүр үгээр хайна уу</Text>
          </View>
        }
      />

      <TabBar active="search" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  greeting: { fontSize: 14, color: '#888', marginBottom: 2 },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A1A', marginBottom: 14, letterSpacing: -0.3 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  catRow: { marginBottom: 10 },
  catScroll: { paddingHorizontal: 20, gap: 8 },
  catPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  catPillActive: { backgroundColor: '#0F6E56', borderColor: '#0F6E56' },
  catText: { fontSize: 13, fontWeight: '500', color: '#555' },
  catTextActive: { color: '#FFF', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImage: {
    height: 170,
    width: '100%',
  },
  cardBody: { padding: 14 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 3 },
  cardCity: { fontSize: 13, color: '#888', marginBottom: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardRating: { fontSize: 13, fontWeight: '600', color: '#F59E0B' },
  cardReviews: { fontSize: 12, color: '#999' },
  cardPrice: { fontSize: 17, fontWeight: '700', color: '#0F6E56' },
  cardNight: { fontSize: 12, fontWeight: '400', color: '#888' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  emptySub: { fontSize: 14, color: '#888' },
});

const tabS = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    paddingBottom: 28,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, color: '#999', fontWeight: '500' },
  active: { color: '#0F6E56', fontWeight: '600' },
});
