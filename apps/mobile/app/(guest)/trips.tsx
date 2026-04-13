import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  MessageCircle,
  Navigation,
  AlertCircle,
  Star,
  Luggage,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, fontWeights, fontSize, spacing, radius } from '@ihotel/config';
import { TabBar, Button, useHaptic } from '@ihotel/ui';
import type { TabItem } from '@ihotel/ui';

/* ─── constants ─── */

const GUEST_TABS: TabItem[] = [
  { key: 'search', label: 'Хайх', icon: 'search' },
  { key: 'ai', label: 'AI', icon: 'sparkles' },
  { key: 'trips', label: 'Аялал', icon: 'map', badge: '1' },
  { key: 'saved', label: 'Хадгал.', icon: 'heart' },
  { key: 'profile', label: 'Профайл', icon: 'user' },
];

interface BookingMock {
  id: string;
  hotelName: string;
  city: string;
  dateRange: string;
  roomType: string;
  image: string;
  daysUntil?: number;
  reviewed?: boolean;
}

const UPCOMING: BookingMock[] = [
  {
    id: 'b1',
    hotelName: 'Хангай Resort',
    city: 'Хархорин',
    dateRange: '4-р сарын 20 — 22',
    roomType: 'Deluxe · 2 хүн',
    image: 'https://picsum.photos/seed/hangai1/200/200',
    daysUntil: 7,
  },
];

const PAST: BookingMock[] = [
  {
    id: 'b2',
    hotelName: 'Тэрэлж Lodge',
    city: 'Тэрэлж',
    dateRange: '3-р сарын 10 — 12',
    roomType: 'Standard · 2 хүн',
    image: 'https://picsum.photos/seed/terelj2/200/200',
    reviewed: false,
  },
  {
    id: 'b3',
    hotelName: 'Горхи Гэр буудал',
    city: 'Горхи-Тэрэлж',
    dateRange: '2-р сарын 5 — 7',
    roomType: 'Гэр · 4 хүн',
    image: 'https://picsum.photos/seed/gorkhi3/200/200',
    reviewed: true,
  },
];

/* ─── booking card ─── */

function BookingCard({
  booking,
  upcoming,
  onChat,
  onReview,
}: {
  booking: BookingMock;
  upcoming?: boolean;
  onChat?: () => void;
  onReview?: () => void;
}) {
  return (
    <View style={cardS.card}>
      <View style={cardS.row}>
        <Image
          source={{ uri: booking.image }}
          style={cardS.image}
          contentFit="cover"
          transition={200}
        />
        <View style={cardS.info}>
          <Text style={cardS.name} numberOfLines={1}>{booking.hotelName}</Text>
          <Text style={cardS.meta}>{booking.dateRange} · {booking.city}</Text>
          <Text style={cardS.meta}>{booking.roomType}</Text>
          {upcoming && booking.daysUntil != null && (
            <View style={cardS.pill}>
              <Text style={cardS.pillText}>{booking.daysUntil} хоногийн дараа</Text>
            </View>
          )}
        </View>
      </View>

      {upcoming && (
        <View style={cardS.actions}>
          <Pressable style={cardS.actionBtn} onPress={onChat}>
            <MessageCircle size={14} color={colors.primary} strokeWidth={2} />
            <Text style={cardS.actionText}>Хосттой чат</Text>
          </Pressable>
          <Pressable style={cardS.actionBtn}>
            <Navigation size={14} color={colors.primary} strokeWidth={2} />
            <Text style={cardS.actionText}>Зам заах</Text>
          </Pressable>
        </View>
      )}

      {!upcoming && !booking.reviewed && (
        <Pressable style={cardS.reviewCta} onPress={onReview}>
          <Star size={14} color="#D97706" strokeWidth={2} />
          <Text style={cardS.reviewText}>Үнэлгээ өгөх → +30 оноо</Text>
        </Pressable>
      )}
    </View>
  );
}

const cardS = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 0.5, borderColor: colors.border as string,
    overflow: 'hidden', marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', padding: spacing.lg - 2, gap: spacing.md },
  image: { width: 64, height: 64, borderRadius: radius.md },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  meta: { fontSize: fontSize.caption, color: colors.textSecondary },
  pill: {
    backgroundColor: '#E1F5EE', borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 2, alignSelf: 'flex-start', marginTop: spacing.xs,
  },
  pillText: { fontSize: 11, fontWeight: fontWeights.medium as '500', color: colors.primary },
  actions: {
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg - 2, paddingBottom: spacing.md,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: '#F1EFE8', borderRadius: radius.sm,
    paddingVertical: spacing.sm + 2, minHeight: 44,
  },
  actionText: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  reviewCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: '#FEF3C7', paddingVertical: spacing.sm + 2,
    minHeight: 44,
  },
  reviewText: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: '#D97706' },
});

/* ─── screen ─── */

export default function TripsScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const hasBookings = UPCOMING.length > 0 || PAST.length > 0;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Миний аялал</Text>

        {!hasBookings ? (
          <View style={s.empty}>
            <View style={s.emptyCircle}>
              <Luggage size={48} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={s.emptyTitle}>Аялал хараахан байхгүй</Text>
            <Button title="Хайлт эхлэх" onPress={() => router.replace('/(guest)/search')} />
          </View>
        ) : (
          <>
            {UPCOMING.length > 0 && (
              <>
                <Text style={s.sectionLabel}>Удахгүй</Text>
                {UPCOMING.map(b => (
                  <React.Fragment key={b.id}>
                    <BookingCard booking={b} upcoming
                      onChat={() => { haptic.light(); router.push(`/chat/${b.id}`); }} />
                    <View style={s.emergencyBar}>
                      <AlertCircle size={14} color="#FFFFFF" strokeWidth={2} />
                      <Text style={s.emergencyText}>Онцгой нөхцөл? iHotel 24/7: 7555-0000</Text>
                    </View>
                  </React.Fragment>
                ))}
              </>
            )}

            {PAST.length > 0 && (
              <>
                <Text style={[s.sectionLabel, { marginTop: spacing.xl }]}>Өмнөх</Text>
                {PAST.map(b => (
                  <BookingCard key={b.id} booking={b}
                    onReview={() => { haptic.light(); router.push(`/review/${b.id}`); }} />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <TabBar tabs={GUEST_TABS} activeKey="trips"
        onTabPress={key => {
          if (key === 'trips') return;
          if (key === 'search') router.replace('/(guest)/search');
          else if (key === 'profile') router.push('/(guest)/profile');
          else if (key === 'ai') router.push('/(guest)/ai');
          else if (key === 'saved') router.push('/(guest)/saved');
        }} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg + 4, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  title: { fontSize: fontSize.h1, fontWeight: fontWeights.medium as '500', color: colors.textPrimary, marginBottom: spacing.xl },
  sectionLabel: {
    fontSize: 11, fontWeight: fontWeights.medium as '500', color: '#888780',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.md,
  },
  emergencyBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: '#DC2626', borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, marginBottom: spacing.lg,
  },
  emergencyText: { fontSize: 12, color: '#FFFFFF', fontWeight: fontWeights.medium as '500' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: spacing.lg },
  emptyCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#E1F5EE',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: fontSize.h3, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
});
