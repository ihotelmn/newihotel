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
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  Search,
  Sparkles,
  Map,
  Heart,
  User,
  MessageCircle,
  Navigation,
  Star,
  Phone,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react-native';

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

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
  image: 'https://picsum.photos/seed/hotel1/400/300',
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
    image: 'https://picsum.photos/seed/hotel2/400/300',
  },
  {
    id: '3',
    hotel: 'Хөвсгөл Лодж',
    city: 'Хөвсгөл',
    dates: '2025.08.15 — 08.18',
    nights: 3,
    price: 630000,
    hasReview: true,
    image: 'https://picsum.photos/seed/hotel7/400/300',
  },
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

export default function TripsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Миний аялал</Text>

        {/* Upcoming Section */}
        <Text style={s.sectionTitle}>Удахгүй</Text>
        <Pressable
          style={({ pressed }) => [s.upcomingCard, pressed && { opacity: 0.97, transform: [{ scale: 0.99 }] }]}
          onPress={() => router.push(`/hotel/${UPCOMING.id}`)}
        >
          <View style={s.upcomingImageWrap}>
            <ExpoImage
              source={{ uri: UPCOMING.image }}
              placeholder={{ blurhash: BLURHASH }}
              style={s.upcomingImage}
              contentFit="cover"
              transition={200}
            />
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
                style={({ pressed }) => [s.actionBtn, pressed && { backgroundColor: '#E8E8E8' }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/chat/${UPCOMING.id}`);
                }}
              >
                <MessageCircle size={15} color="#1A1A1A" strokeWidth={2} />
                <Text style={s.actionBtnText}>Чат</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.actionBtn, pressed && { backgroundColor: '#E8E8E8' }]}
                onPress={() => router.push(`/hotel/${UPCOMING.id}`)}
              >
                <Navigation size={15} color="#1A1A1A" strokeWidth={2} />
                <Text style={s.actionBtnText}>Дэлгэрэнгүй</Text>
              </Pressable>
            </View>

            <View style={s.statusRow}>
              <View style={s.statusDot} />
              <Text style={s.statusText}>{UPCOMING.status}</Text>
              <Text style={s.upcomingPrice}>{'₮' + UPCOMING.price.toLocaleString()}</Text>
            </View>
          </View>
        </Pressable>

        {/* Past Section */}
        <Text style={s.sectionTitle}>Өмнөх аялалууд</Text>
        {PAST.map((trip) => (
          <Pressable
            key={trip.id}
            style={({ pressed }) => [s.pastCard, pressed && { opacity: 0.95 }]}
            onPress={() => router.push(`/hotel/${trip.id}`)}
          >
            <ExpoImage
              source={{ uri: trip.image }}
              placeholder={{ blurhash: BLURHASH }}
              style={s.pastImage}
              contentFit="cover"
              transition={200}
            />
            <View style={s.pastBody}>
              <Text style={s.pastName}>{trip.hotel}</Text>
              <Text style={s.pastDates}>{trip.dates} · {trip.nights} шөнө</Text>
              <Text style={s.pastPrice}>{'₮' + trip.price.toLocaleString()}</Text>
              {!trip.hasReview && (
                <Pressable
                  style={s.reviewBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/review/${trip.id}`);
                  }}
                >
                  <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                  <Text style={s.reviewBtnText}>Үнэлгээ өгөх</Text>
                </Pressable>
              )}
              {trip.hasReview && (
                <View style={s.reviewedRow}>
                  <CheckCircle size={14} color="#0F6E56" strokeWidth={2} />
                  <Text style={s.reviewed}>Үнэлгээ өгсөн</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        {/* Emergency */}
        <View style={s.emergencyBar}>
          <AlertTriangle size={16} color="#E24B4A" strokeWidth={2} />
          <View style={s.emergencyContent}>
            <Text style={s.emergencyTitle}>Яаралтай тусламж</Text>
            <Text style={s.emergencyText}>Аялалтай холбоотой яаралтай асуудал</Text>
          </View>
          <Phone size={18} color="#E24B4A" strokeWidth={2} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      <TabBar active="trips" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scroll: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#1A1A1A', marginTop: 12, marginBottom: 22, letterSpacing: -0.3 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  upcomingCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  upcomingImageWrap: { position: 'relative' },
  upcomingImage: { height: 160, width: '100%' },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0F6E56',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  upcomingBody: { padding: 18 },
  upcomingName: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 3 },
  upcomingCity: { fontSize: 13, color: '#888', marginBottom: 8 },
  upcomingDates: { fontSize: 13, color: '#555', marginBottom: 3 },
  upcomingGuests: { fontSize: 13, color: '#555', marginBottom: 14 },
  upcomingActions: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionBtnText: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0F6E56', marginRight: 6 },
  statusText: { fontSize: 13, color: '#0F6E56', fontWeight: '500', flex: 1 },
  upcomingPrice: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  pastCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pastImage: { width: 100, height: '100%', minHeight: 110 },
  pastBody: { flex: 1, padding: 14, justifyContent: 'center' },
  pastName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 3 },
  pastDates: { fontSize: 12, color: '#888', marginBottom: 4 },
  pastPrice: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  reviewBtnText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  reviewedRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reviewed: { fontSize: 12, color: '#0F6E56', fontWeight: '500' },
  emergencyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FDDEDE',
  },
  emergencyContent: { flex: 1 },
  emergencyTitle: { fontSize: 14, fontWeight: '600', color: '#E24B4A', marginBottom: 2 },
  emergencyText: { fontSize: 12, color: '#888' },
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
