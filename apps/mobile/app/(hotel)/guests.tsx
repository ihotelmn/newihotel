import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings, Search, X, Award } from 'lucide-react-native';

type Guest = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  visits: number;
  totalSpent: string;
  isVip: boolean;
};

const GUESTS: Guest[] = [
  { id: '1', name: 'Батбаяр Дорж', initials: 'БД', phone: '9911-2233', visits: 12, totalSpent: '₮3,400,000', isVip: true },
  { id: '2', name: 'Сарантуяа Мөнх', initials: 'СМ', phone: '8800-1122', visits: 1, totalSpent: '₮150,000', isVip: false },
  { id: '3', name: 'Энхбат Түмэн', initials: 'ЭТ', phone: '9955-4466', visits: 8, totalSpent: '₮2,100,000', isVip: true },
  { id: '4', name: 'Оюунчимэг Бат', initials: 'ОБ', phone: '8811-3344', visits: 3, totalSpent: '₮480,000', isVip: false },
  { id: '5', name: 'Ганбаатар Жамц', initials: 'ГЖ', phone: '9922-5577', visits: 5, totalSpent: '₮1,250,000', isVip: true },
  { id: '6', name: 'Нарантуяа Сүх', initials: 'НС', phone: '8855-6688', visits: 2, totalSpent: '₮200,000', isVip: false },
  { id: '7', name: 'Мөнхбат Эрдэнэ', initials: 'МЭ', phone: '9933-7799', visits: 15, totalSpent: '₮5,800,000', isVip: true },
  { id: '8', name: 'Цэцэгмаа Дагва', initials: 'ЦД', phone: '8866-9900', visits: 1, totalSpent: '₮250,000', isVip: false },
  { id: '9', name: 'Болд Очир', initials: 'БО', phone: '9944-1155', visits: 6, totalSpent: '₮1,680,000', isVip: true },
  { id: '10', name: 'Анхбаяр Ганзориг', initials: 'АГ', phone: '8877-2233', visits: 1, totalSpent: '₮120,000', isVip: false },
];

const HOTEL_TAB_ICONS: Record<string, typeof Inbox> = {
  leads: Inbox,
  rooms: BedDouble,
  guests: Users,
  marketing: Megaphone,
  settings: Settings,
};

const HOTEL_TABS = [
  { key: 'leads', label: 'Лийд', route: '/(hotel)/leads' },
  { key: 'rooms', label: 'Өрөө', route: '/(hotel)/rooms' },
  { key: 'guests', label: 'Зочин', route: '/(hotel)/guests' },
  { key: 'marketing', label: 'Маркетинг', route: '/(hotel)/marketing' },
  { key: 'settings', label: 'Тохиргоо', route: '/(hotel)/settings' },
];

function HotelTabBar({ active }: { active: string }) {
  const router = useRouter();
  return (
    <View style={tabS.bar}>
      {HOTEL_TABS.map((t) => {
        const Icon = HOTEL_TAB_ICONS[t.key] ?? Inbox;
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

export default function GuestsScreen() {
  const [search, setSearch] = useState('');

  const filtered = search
    ? GUESTS.filter(
        (g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.phone.includes(search),
      )
    : GUESTS;

  const vipCount = GUESTS.filter((g) => g.isVip).length;

  const handleGuestPress = (guest: Guest) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      guest.name,
      `Утас: ${guest.phone}\nИрсэн: ${guest.visits} удаа\nНийт: ${guest.totalSpent}\n${guest.isVip ? 'VIP зочин' : 'Энгийн зочин'}`,
    );
  };

  const renderGuest = useCallback(
    ({ item }: { item: Guest }) => (
      <Pressable
        style={({ pressed }) => [s.guestCard, pressed && { backgroundColor: '#F8F7F3' }]}
        onPress={() => handleGuestPress(item)}
      >
        <View style={[s.avatar, item.isVip && s.avatarVip]}>
          <Text style={s.avatarText}>{item.initials}</Text>
        </View>
        <View style={s.guestInfo}>
          <View style={s.nameRow}>
            <Text style={s.guestName}>{item.name}</Text>
            {item.isVip && (
              <View style={s.vipBadge}>
                <Award size={10} color="#F59E0B" strokeWidth={2} />
                <Text style={s.vipText}>VIP</Text>
              </View>
            )}
          </View>
          <Text style={s.guestPhone}>{item.phone}</Text>
          <Text style={s.guestMeta}>{item.visits} удаа | {item.totalSpent}</Text>
        </View>
      </Pressable>
    ),
    [],
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Зочдын бүртгэл</Text>
      </View>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statNum}>89</Text>
          <Text style={s.statLabel}>Нийт</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: '#F59E0B' }]}>{vipCount}</Text>
          <Text style={s.statLabel}>VIP</Text>
        </View>
        <View style={s.statCard}>
          <Text style={[s.statNum, { color: '#0F6E56' }]}>8</Text>
          <Text style={s.statLabel}>Шинэ (энэ сар)</Text>
        </View>
      </View>

      <View style={s.searchBox}>
        <Search size={18} color="#999" strokeWidth={2} />
        <TextInput
          style={s.searchInput}
          placeholder="Нэр, утас хайх..."
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderGuest}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>Зочин олдсонгүй</Text>
          </View>
        }
      />

      <HotelTabBar active="guests" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', letterSpacing: -0.3 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statNum: { fontSize: 22, fontWeight: '500', color: '#1A1A1A', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#888' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  list: { paddingBottom: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#888' },
  guestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarVip: { backgroundColor: '#F59E0B' },
  avatarText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
  guestInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guestName: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vipText: { fontSize: 10, fontWeight: '500', color: '#F59E0B' },
  guestPhone: { fontSize: 13, color: '#888', marginTop: 2 },
  guestMeta: { fontSize: 12, color: '#999', marginTop: 1 },
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
