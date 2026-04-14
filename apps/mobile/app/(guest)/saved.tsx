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
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Search, Sparkles, Map, Heart, User, Trash2, Star } from 'lucide-react-native';

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

const INITIAL_SAVED = [
  { id: '1', name: 'Шангри-Ла Улаанбаатар', city: 'Улаанбаатар', price: 450000, rating: 4.8, image: 'https://picsum.photos/seed/hotel1/400/300' },
  { id: '4', name: 'Хустайн Рисорт', city: 'Хустай', price: 320000, rating: 4.7, image: 'https://picsum.photos/seed/hotel4/400/300' },
  { id: '7', name: 'Хөвсгөл Лодж', city: 'Хөвсгөл', price: 210000, rating: 4.9, image: 'https://picsum.photos/seed/hotel7/400/300' },
  { id: '10', name: 'Горхи Тэрэлж Рисорт', city: 'Тэрэлж', price: 350000, rating: 4.8, image: 'https://picsum.photos/seed/hotel10/400/300' },
];

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

export default function SavedScreen() {
  const router = useRouter();
  const [saved, setSaved] = useState(INITIAL_SAVED);

  const removeItem = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Устгах', 'Хадгалсан жагсаалтаас хасах уу?', [
      { text: 'Үгүй' },
      {
        text: 'Тийм',
        style: 'destructive',
        onPress: () => setSaved((prev) => prev.filter((h) => h.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }: { item: (typeof INITIAL_SAVED)[0] }) => (
    <Pressable
      style={({ pressed }) => [s.card, pressed && { opacity: 0.95, transform: [{ scale: 0.97 }] }]}
      onPress={() => router.push(`/hotel/${item.id}`)}
    >
      <View style={s.cardImageWrap}>
        <ExpoImage
          source={{ uri: item.image }}
          placeholder={{ blurhash: BLURHASH }}
          style={s.cardImage}
          contentFit="cover"
          transition={200}
        />
        <Pressable
          style={({ pressed }) => [s.removeBtn, pressed && { opacity: 0.8 }]}
          onPress={() => removeItem(item.id)}
          hitSlop={6}
        >
          <Trash2 size={14} color="#FFF" strokeWidth={2.2} />
        </Pressable>
      </View>
      <View style={s.cardBody}>
        <Text style={s.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.cardCity}>{item.city}</Text>
        <View style={s.cardRow}>
          <View style={s.ratingRow}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={s.cardRating}>{item.rating}</Text>
          </View>
          <Text style={s.cardPrice}>{'₮' + item.price.toLocaleString()}</Text>
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
          <View style={s.emptyIconWrap}>
            <Heart size={40} color="#E5E5E5" strokeWidth={1.5} />
          </View>
          <Text style={s.emptyTitle}>Хадгалсан зүйл байхгүй</Text>
          <Text style={s.emptySub}>Таалагдсан хотелуудаа хадгалаарай</Text>
          <Pressable
            style={s.emptyBtn}
            onPress={() => router.replace('/(guest)/search' as any)}
          >
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
  title: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', letterSpacing: -0.3 },
  count: { fontSize: 13, color: '#888' },
  list: { paddingHorizontal: 14, paddingBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 14 },
  card: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImageWrap: { position: 'relative' },
  cardImage: { height: 130, width: '100%' },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 12 },
  cardName: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', marginBottom: 3 },
  cardCity: { fontSize: 11, color: '#888', marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardRating: { fontSize: 12, fontWeight: '500', color: '#F59E0B' },
  cardPrice: { fontSize: 12, fontWeight: '500', color: '#0F6E56' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 18, fontWeight: '500', color: '#1A1A1A', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24 },
  emptyBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyBtnText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
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
  active: { color: '#0F6E56', fontWeight: '500' },
});
