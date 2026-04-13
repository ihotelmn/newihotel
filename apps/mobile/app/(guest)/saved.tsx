import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Heart, Star, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, fontWeights, fontSize, spacing, radius } from '@ihotel/config';
import { TabBar, Button, useHaptic } from '@ihotel/ui';
import type { TabItem } from '@ihotel/ui';
import type { Hotel } from '@ihotel/types';

/* ─── constants ─── */

const GUEST_TABS: TabItem[] = [
  { key: 'search', label: 'Хайх', icon: 'search' },
  { key: 'ai', label: 'AI', icon: 'sparkles' },
  { key: 'trips', label: 'Аялал', icon: 'map', badge: '1' },
  { key: 'saved', label: 'Хадгал.', icon: 'heart' },
  { key: 'profile', label: 'Профайл', icon: 'user' },
];

const MOCK_SAVED: Hotel[] = [
  {
    id: 'sv1', name: 'Хангай Resort', description: '', address: '', city: 'Хархорин',
    latitude: 0, longitude: 0, star_rating: 4, avg_rating: 4.8, review_count: 124,
    price_min: 280000, price_max: 350000, amenities: [],
    image_url: 'https://picsum.photos/seed/saved1/400/300', images: [],
    is_featured: true, created_at: '', updated_at: '',
  },
  {
    id: 'sv2', name: 'Хатгалын Гэр буудал', description: '', address: '', city: 'Хатгал',
    latitude: 0, longitude: 0, star_rating: 3, avg_rating: 4.7, review_count: 89,
    price_min: 170000, price_max: 220000, amenities: [],
    image_url: 'https://picsum.photos/seed/saved2/400/300', images: [],
    is_featured: false, created_at: '', updated_at: '',
  },
  {
    id: 'sv3', name: 'Тэрэлж Lodge', description: '', address: '', city: 'Тэрэлж',
    latitude: 0, longitude: 0, star_rating: 4, avg_rating: 4.5, review_count: 56,
    price_min: 180000, price_max: 240000, amenities: [],
    image_url: 'https://picsum.photos/seed/saved3/400/300', images: [],
    is_featured: false, created_at: '', updated_at: '',
  },
  {
    id: 'sv4', name: 'Горхи Camp', description: '', address: '', city: 'Горхи-Тэрэлж',
    latitude: 0, longitude: 0, star_rating: 3, avg_rating: 4.3, review_count: 34,
    price_min: 120000, price_max: 160000, amenities: [],
    image_url: 'https://picsum.photos/seed/saved4/400/300', images: [],
    is_featured: false, created_at: '', updated_at: '',
  },
];

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

/* ─── grid card ─── */

function SavedCard({ hotel, onPress, onRemove }: {
  hotel: Hotel; onPress: () => void; onRemove: () => void;
}) {
  return (
    <Pressable style={gridS.card} onPress={onPress}>
      <View style={gridS.imageWrap}>
        <Image source={{ uri: hotel.image_url }} placeholder={{ blurhash: BLURHASH }}
          style={gridS.image} contentFit="cover" transition={200} />
        <Pressable style={gridS.removeBtn} onPress={(e) => { e.stopPropagation(); onRemove(); }} hitSlop={8}>
          <Trash2 size={12} color="#E24B4A" strokeWidth={2} />
        </Pressable>
      </View>
      <View style={gridS.info}>
        <Text style={gridS.name} numberOfLines={1}>{hotel.name}</Text>
        <Text style={gridS.meta}>{hotel.city}</Text>
        <View style={gridS.ratingRow}>
          <Star size={10} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
          <Text style={gridS.rating}>{hotel.avg_rating}</Text>
        </View>
        <Text style={gridS.price}>₮{(hotel.price_min / 1000).toFixed(0)}K/шөнө</Text>
      </View>
    </Pressable>
  );
}

const gridS = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 0.5, borderColor: colors.border as string, overflow: 'hidden', margin: spacing.xs,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 110 },
  removeBtn: {
    position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center',
  },
  info: { padding: spacing.sm, gap: 1 },
  name: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  meta: { fontSize: 11, color: colors.textSecondary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: 11, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  price: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: colors.primary, marginTop: 2 },
});

/* ─── screen ─── */

export default function SavedScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const [saved, setSaved] = useState<Hotel[]>(MOCK_SAVED);

  const handleRemove = useCallback((id: string) => {
    haptic.light();
    setSaved(prev => prev.filter(h => h.id !== id));
  }, [haptic]);

  const isEmpty = saved.length === 0;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Хадгалсан</Text>
        <Text style={s.subtitle}>{saved.length} буудал</Text>
      </View>

      {isEmpty ? (
        <View style={s.empty}>
          <View style={s.emptyCircle}>
            <Heart size={48} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={s.emptyTitle}>Хоосон байна</Text>
          <Text style={s.emptyText}>Таалагдсан буудлыг хадгалж дараа амархан олоорой</Text>
          <Button title="Буудал хайх →" onPress={() => router.replace('/(guest)/search')} />
        </View>
      ) : (
        <FlashList<Hotel>
          data={saved}
          numColumns={2}
          renderItem={({ item }) => (
            <SavedCard hotel={item}
              onPress={() => { haptic.light(); router.push(`/hotel/${item.id}`); }}
              onRemove={() => handleRemove(item.id)} />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
        />
      )}

      <TabBar tabs={GUEST_TABS} activeKey="saved"
        onTabPress={key => {
          if (key === 'saved') return;
          if (key === 'search') router.replace('/(guest)/search');
          else if (key === 'profile') router.push('/(guest)/profile');
          else if (key === 'ai') router.push('/(guest)/ai');
          else if (key === 'trips') router.push('/(guest)/trips');
        }} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg + 4, paddingTop: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: fontSize.h1, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  subtitle: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing['2xl'], gap: spacing.md },
  emptyCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#E1F5EE',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  emptyTitle: { fontSize: fontSize.h3, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  emptyText: { fontSize: fontSize.body, color: colors.textSecondary, textAlign: 'center' },
});
