import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

const INITIAL_SAVED = [
  { id: '1', name: 'Шангри-Ла Улаанбаатар', city: 'Улаанбаатар', price: 450000, rating: 4.8, color: '#E8D5B7' },
  { id: '4', name: 'Хустайн Рисорт', city: 'Хустай', price: 320000, rating: 4.7, color: '#B8D4E3' },
  { id: '7', name: 'Хөвсгөл Лодж', city: 'Хөвсгөл', price: 210000, rating: 4.9, color: '#C3D9D5' },
  { id: '10', name: 'Горхи Тэрэлж Рисорт', city: 'Тэрэлж', price: 350000, rating: 4.8, color: '#C3E3D4' },
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

export default function SavedScreen() {
  const router = useRouter();
  const [saved, setSaved] = useState(INITIAL_SAVED);

  const removeItem = (id: string) => {
    Alert.alert('Устгах', 'Хадгалсан жагсаалтаас хасах уу?', [
      { text: 'Үгүй' },
      { text: 'Тийм', onPress: () => setSaved((prev) => prev.filter((h) => h.id !== id)) },
    ]);
  };

  const renderItem = ({ item }: { item: (typeof INITIAL_SAVED)[0] }) => (
    <Pressable
      style={s.card}
      onPress={() => router.push(`/hotel/${item.id}`)}
    >
      <View style={[s.cardImage, { backgroundColor: item.color }]}>
        <Text style={s.cardInitial}>{item.name.charAt(0)}</Text>
        <Pressable
          style={s.removeBtn}
          onPress={() => removeItem(item.id)}
        >
          <Text style={s.removeText}>✕</Text>
        </Pressable>
      </View>
      <View style={s.cardBody}>
        <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.cardCity}>{item.city}</Text>
        <View style={s.cardRow}>
          <Text style={s.cardRating}>★ {item.rating}</Text>
          <Text style={s.cardPrice}>₮{item.price.toLocaleString()}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.title}>Хадгалсан</Text>
        <Text style={s.count}>{saved.length} хотел</Text>
      </View>

      {saved.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>❤️</Text>
          <Text style={s.emptyTitle}>Хадгалсан зүйл байхгүй</Text>
          <Text style={s.emptySub}>Таалагдсан хотелуудаа хадгалаарай</Text>
          <Pressable style={s.emptyBtn} onPress={() => router.replace('/(guest)/search')}>
            <Text style={s.emptyBtnText}>Хайх</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={s.row}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TabBar active="saved" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  count: { fontSize: 13, color: '#888' },
  list: { paddingHorizontal: 14, paddingBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInitial: { fontSize: 36, fontWeight: '700', color: 'rgba(0,0,0,0.12)' },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { fontSize: 13, color: '#FFF', fontWeight: '600' },
  cardBody: { padding: 10 },
  cardName: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  cardCity: { fontSize: 11, color: '#888', marginBottom: 6 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardRating: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  cardPrice: { fontSize: 12, fontWeight: '600', color: '#0F6E56' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
  emptyBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
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
