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

const CATEGORIES = [
  { id: 'all', label: 'Бүгд' },
  { id: 'city', label: 'Хотын' },
  { id: 'nature', label: 'Байгаль' },
  { id: 'ger', label: 'Гэр буудал' },
  { id: 'resort', label: 'Рисорт' },
  { id: 'budget', label: 'Хямд' },
];

const HOTELS = [
  { id: '1', name: 'Шангри-Ла Улаанбаатар', city: 'Улаанбаатар', price: 450000, rating: 4.8, reviews: 342, cat: 'city', color: '#E8D5B7' },
  { id: '2', name: 'Тэрэлж Лодж', city: 'Тэрэлж', price: 180000, rating: 4.6, reviews: 128, cat: 'nature', color: '#C5D9C3' },
  { id: '3', name: 'Говийн Гэр Кэмп', city: 'Өмнөговь', price: 95000, rating: 4.5, reviews: 87, cat: 'ger', color: '#D4C4A8' },
  { id: '4', name: 'Хустайн Рисорт', city: 'Хустай', price: 320000, rating: 4.7, reviews: 215, cat: 'resort', color: '#B8D4E3' },
  { id: '5', name: 'Номад Гэстхаус', city: 'Улаанбаатар', price: 55000, rating: 4.3, reviews: 64, cat: 'budget', color: '#E3D4B8' },
  { id: '6', name: 'Блү Скай Хотел', city: 'Улаанбаатар', price: 380000, rating: 4.7, reviews: 298, cat: 'city', color: '#B8C4E3' },
  { id: '7', name: 'Хөвсгөл Лодж', city: 'Хөвсгөл', price: 210000, rating: 4.9, reviews: 176, cat: 'nature', color: '#C3D9D5' },
  { id: '8', name: 'Алтай Гэр Кэмп', city: 'Баян-Өлгий', price: 85000, rating: 4.4, reviews: 53, cat: 'ger', color: '#D9D4C3' },
  { id: '9', name: 'Чингис Хаан Хотел', city: 'Улаанбаатар', price: 290000, rating: 4.6, reviews: 410, cat: 'city', color: '#E3C4B8' },
  { id: '10', name: 'Горхи Тэрэлж Рисорт', city: 'Тэрэлж', price: 350000, rating: 4.8, reviews: 192, cat: 'resort', color: '#C3E3D4' },
];

function TabBar({ active }: { active: string }) {
  const router = useRouter();
  const tabs = [
    { key: 'search', label: '🔍 Хайх', route: '/(guest)/search' as const },
    { key: 'ai', label: '✨ AI', route: '/(guest)/ai' as const },
    { key: 'trips', label: '🧳 Аялал', route: '/(guest)/trips' as const },
    { key: 'saved', label: '❤️ Хадгал', route: '/(guest)/saved' as const },
    { key: 'profile', label: '👤 Профайл', route: '/(guest)/profile' as const },
  ];
  return (
    <View style={tabStyles.bar}>
      {tabs.map((t) => (
        <Pressable
          key={t.key}
          style={tabStyles.tab}
          onPress={() => {
            if (t.key !== active) router.replace(t.route);
          }}
        >
          <Text style={[tabStyles.label, t.key === active && tabStyles.active]}>
            {t.label}
          </Text>
        </Pressable>
      ))}
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

  const renderHotel = useCallback(
    ({ item }: { item: (typeof HOTELS)[0] }) => (
      <Pressable
        style={s.card}
        onPress={() => router.push(`/hotel/${item.id}`)}
      >
        <View style={[s.cardImage, { backgroundColor: item.color }]}>
          <Text style={s.cardImageText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={s.cardBody}>
          <Text style={s.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={s.cardCity}>{item.city}</Text>
          <View style={s.cardRow}>
            <Text style={s.cardRating}>★ {item.rating}</Text>
            <Text style={s.cardReviews}>({item.reviews})</Text>
          </View>
          <Text style={s.cardPrice}>
            ₮{item.price.toLocaleString()}
            <Text style={s.cardNight}> /шөнө</Text>
          </Text>
        </View>
      </Pressable>
    ),
    [router],
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.greeting}>Сайн байна уу! 👋</Text>
        <Text style={s.title}>Хаашаа аялах вэ?</Text>
      </View>

      <View style={s.searchBox}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Хотел, газар хайх..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={s.catRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              style={[s.catPill, category === c.id && s.catPillActive]}
              onPress={() => setCategory(c.id)}
            >
              <Text
                style={[s.catText, category === c.id && s.catTextActive]}
              >
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
            <Text style={s.emptyText}>Илэрц олдсонгүй</Text>
          </View>
        }
      />

      <TabBar active="search" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  header: { paddingHorizontal: 20, paddingTop: 12 },
  greeting: { fontSize: 14, color: '#888', marginBottom: 2 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A' },
  catRow: { paddingLeft: 20, marginBottom: 8 },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  catPillActive: { backgroundColor: '#0F6E56', borderColor: '#0F6E56' },
  catText: { fontSize: 13, color: '#555' },
  catTextActive: { color: '#FFF', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardImage: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageText: { fontSize: 48, fontWeight: '700', color: 'rgba(0,0,0,0.15)' },
  cardBody: { padding: 14 },
  cardName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  cardCity: { fontSize: 13, color: '#888', marginBottom: 6 },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cardRating: { fontSize: 13, fontWeight: '600', color: '#F59E0B' },
  cardReviews: { fontSize: 12, color: '#999', marginLeft: 4 },
  cardPrice: { fontSize: 17, fontWeight: '700', color: '#0F6E56' },
  cardNight: { fontSize: 13, fontWeight: '400', color: '#888' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#999' },
});

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  label: { fontSize: 11, color: '#999' },
  active: { color: '#0F6E56', fontWeight: '600' },
});
