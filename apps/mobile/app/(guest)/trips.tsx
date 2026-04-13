import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const UPCOMING = {
  id: '1',
  hotel: 'Шангри-Ла Улаанбаатар',
  city: 'Улаанбаатар',
  dates: '2026.04.20 — 04.22',
  nights: 2,
  guests: '2 том, 1 хүүхэд',
  price: 900000,
  status: 'Баталгаажсан',
  daysLeft: 7,
  color: '#E8D5B7',
};

const PAST = [
  {
    id: '2',
    hotel: 'Тэрэлж Лодж',
    city: 'Тэрэлж',
    dates: '2026.03.10 — 03.12',
    nights: 2,
    price: 360000,
    hasReview: false,
    color: '#C5D9C3',
  },
  {
    id: '3',
    hotel: 'Хөвсгөл Лодж',
    city: 'Хөвсгөл',
    dates: '2025.08.15 — 08.18',
    nights: 3,
    price: 630000,
    hasReview: true,
    color: '#C3D9D5',
  },
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

export default function TripsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Миний аялал</Text>

        <Text style={s.sectionTitle}>Удахгүй</Text>
        <Pressable
          style={s.upcomingCard}
          onPress={() => router.push(`/hotel/${UPCOMING.id}`)}
        >
          <View style={[s.upcomingImage, { backgroundColor: UPCOMING.color }]}>
            <View style={s.badge}>
              <Text style={s.badgeText}>{UPCOMING.daysLeft} хоногийн дараа</Text>
            </View>
          </View>
          <View style={s.upcomingBody}>
            <Text style={s.upcomingName}>{UPCOMING.hotel}</Text>
            <Text style={s.upcomingCity}>{UPCOMING.city}</Text>
            <Text style={s.upcomingDates}>{UPCOMING.dates} · {UPCOMING.nights} шөнө</Text>
            <Text style={s.upcomingGuests}>{UPCOMING.guests}</Text>
            <View style={s.upcomingActions}>
              <Pressable
                style={s.actionBtn}
                onPress={() => router.push(`/chat/${UPCOMING.id}`)}
              >
                <Text style={s.actionBtnText}>💬 Чат</Text>
              </Pressable>
              <Pressable
                style={s.actionBtn}
                onPress={() => router.push(`/hotel/${UPCOMING.id}`)}
              >
                <Text style={s.actionBtnText}>📍 Дэлгэрэнгүй</Text>
              </Pressable>
            </View>
            <View style={s.statusRow}>
              <View style={s.statusDot} />
              <Text style={s.statusText}>{UPCOMING.status}</Text>
              <Text style={s.upcomingPrice}>₮{UPCOMING.price.toLocaleString()}</Text>
            </View>
          </View>
        </Pressable>

        <Text style={s.sectionTitle}>Өмнөх аялалууд</Text>
        {PAST.map((trip) => (
          <View key={trip.id} style={s.pastCard}>
            <View style={[s.pastImage, { backgroundColor: trip.color }]}>
              <Text style={s.pastInitial}>{trip.hotel.charAt(0)}</Text>
            </View>
            <View style={s.pastBody}>
              <Text style={s.pastName}>{trip.hotel}</Text>
              <Text style={s.pastDates}>{trip.dates} · {trip.nights} шөнө</Text>
              <Text style={s.pastPrice}>₮{trip.price.toLocaleString()}</Text>
              {!trip.hasReview && (
                <Pressable
                  style={s.reviewBtn}
                  onPress={() => router.push(`/review/${trip.id}`)}
                >
                  <Text style={s.reviewBtnText}>Үнэлгээ өгөх ★</Text>
                </Pressable>
              )}
              {trip.hasReview && (
                <Text style={s.reviewed}>✓ Үнэлгээ өгсөн</Text>
              )}
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
      <TabBar active="trips" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scroll: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginTop: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  upcomingCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  upcomingImage: { height: 140, justifyContent: 'flex-start', alignItems: 'flex-start', padding: 12 },
  badge: {
    backgroundColor: '#0F6E56',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  upcomingBody: { padding: 16 },
  upcomingName: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  upcomingCity: { fontSize: 13, color: '#888', marginBottom: 6 },
  upcomingDates: { fontSize: 13, color: '#555', marginBottom: 2 },
  upcomingGuests: { fontSize: 13, color: '#555', marginBottom: 12 },
  upcomingActions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtn: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionBtnText: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0F6E56', marginRight: 6 },
  statusText: { fontSize: 13, color: '#0F6E56', fontWeight: '500', flex: 1 },
  upcomingPrice: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  pastCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  pastImage: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastInitial: { fontSize: 28, fontWeight: '700', color: 'rgba(0,0,0,0.15)' },
  pastBody: { flex: 1, padding: 14 },
  pastName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  pastDates: { fontSize: 12, color: '#888', marginBottom: 4 },
  pastPrice: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  reviewBtn: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  reviewBtnText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  reviewed: { fontSize: 12, color: '#0F6E56', fontWeight: '500' },
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
