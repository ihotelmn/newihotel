import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings, Clock, Phone, ChevronRight, Sparkles, MessageCircle, BarChart3 } from 'lucide-react-native';

type LeadStatus = 'new' | 'replied' | 'closed';

type Lead = {
  id: string;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  budget: string;
  status: LeadStatus;
  timestamp: string;
  aiContext: string;
};

const LEADS: Lead[] = [
  { id: '1', guestName: 'Батбаяр Д.', phone: '9911-2233', checkIn: '04/18', checkOut: '04/20', roomType: 'Deluxe', budget: '₮280,000', status: 'new', timestamp: '2 мин', aiContext: 'Гэр бүлийн аялал, хүүхэдтэй' },
  { id: '2', guestName: 'Сарантуяа М.', phone: '8800-1122', checkIn: '04/19', checkOut: '04/21', roomType: 'Standard', budget: '₮150,000', status: 'new', timestamp: '15 мин', aiContext: 'Бизнес аялал, Wi-Fi чухал' },
  { id: '3', guestName: 'Энхбат Т.', phone: '9955-4466', checkIn: '04/20', checkOut: '04/23', roomType: 'Suite', budget: '₮450,000', status: 'replied', timestamp: '1 цаг', aiContext: 'VIP зочин, 3 удаа ирсэн' },
  { id: '4', guestName: 'Оюунчимэг Б.', phone: '8811-3344', checkIn: '04/21', checkOut: '04/22', roomType: 'Standard', budget: '₮120,000', status: 'new', timestamp: '2 цаг', aiContext: 'Нэг шөнийн байр, оройн flight' },
  { id: '5', guestName: 'Ганбаатар Ж.', phone: '9922-5577', checkIn: '04/22', checkOut: '04/25', roomType: 'Deluxe', budget: '₮350,000', status: 'replied', timestamp: '3 цаг', aiContext: 'Хос аялал, далайн харагдах өрөө' },
  { id: '6', guestName: 'Нарантуяа С.', phone: '8855-6688', checkIn: '04/19', checkOut: '04/20', roomType: 'Standard', budget: '₮100,000', status: 'closed', timestamp: '5 цаг', aiContext: 'Хямд сонголт хайж байна' },
  { id: '7', guestName: 'Мөнхбат Э.', phone: '9933-7799', checkIn: '04/23', checkOut: '04/26', roomType: 'Suite', budget: '₮500,000', status: 'new', timestamp: '6 цаг', aiContext: 'Корпоратив захиалга, 3 өрөө' },
  { id: '8', guestName: 'Цэцэгмаа Д.', phone: '8866-9900', checkIn: '04/20', checkOut: '04/21', roomType: 'Deluxe', budget: '₮250,000', status: 'closed', timestamp: '1 өдөр', aiContext: 'Төрсөн өдрийн тэмдэглэл' },
];

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string }> = {
  new: { label: 'Шинэ', bg: '#E8F5F1', text: '#0F6E56' },
  replied: { label: 'Хариулсан', bg: '#FFF8E1', text: '#F59E0B' },
  closed: { label: 'Хаагдсан', bg: '#F3F3F3', text: '#888' },
};

const FILTERS = [
  { key: 'all', label: 'Бүгд' },
  { key: 'new', label: 'Шинэ' },
  { key: 'replied', label: 'Хариулсан' },
  { key: 'closed', label: 'Хаагдсан' },
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

export default function LeadsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const newCount = LEADS.filter((l) => l.status === 'new').length;

  const filtered = filter === 'all' ? LEADS : LEADS.filter((l) => l.status === filter);

  const renderLead = useCallback(
    ({ item }: { item: Lead }) => {
      const sc = STATUS_CONFIG[item.status];
      return (
        <Pressable
          style={({ pressed }) => [s.card, pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/hotel-lead/${item.id}` as any);
          }}
        >
          <View style={s.cardHeader}>
            <View style={s.cardNameRow}>
              <Text style={s.cardName}>{item.guestName}</Text>
              <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[s.statusText, { color: sc.text }]}>{sc.label}</Text>
              </View>
            </View>
            <View style={s.cardTimeRow}>
              <Clock size={12} color="#999" strokeWidth={2} />
              <Text style={s.cardTime}>{item.timestamp}</Text>
            </View>
          </View>

          <View style={s.cardDetails}>
            <View style={s.detailRow}>
              <Phone size={13} color="#888" strokeWidth={2} />
              <Text style={s.detailText}>{item.phone}</Text>
            </View>
            <Text style={s.detailText}>{item.checkIn} - {item.checkOut}</Text>
            <Text style={s.detailText}>{item.roomType} | {item.budget}</Text>
          </View>

          <View style={s.aiRow}>
            <Sparkles size={13} color="#0F6E56" strokeWidth={2} />
            <Text style={s.aiText} numberOfLines={1}>{item.aiContext}</Text>
          </View>

          <View style={s.cardArrow}>
            <ChevronRight size={18} color="#CCC" strokeWidth={2} />
          </View>
        </Pressable>
      );
    },
    [router],
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View style={s.headerTitleRow}>
          <Text style={s.headerTitle}>Лийд</Text>
          {newCount > 0 && (
            <View style={s.pulseBadge}>
              <Text style={s.pulseBadgeText}>{newCount}</Text>
            </View>
          )}
        </View>
        <View style={s.headerRight}>
          <Pressable
            style={({ pressed }) => [s.headerIconBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(hotel)/host-inbox' as any);
            }}
          >
            <MessageCircle size={20} color="#555" strokeWidth={1.8} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.headerIconBtn, pressed && { opacity: 0.7 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(hotel)/analytics' as any);
            }}
          >
            <BarChart3 size={20} color="#555" strokeWidth={1.8} />
          </Pressable>
        </View>
      </View>

      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            style={[s.filterPill, filter === f.key && s.filterPillActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter(f.key);
            }}
          >
            <Text style={[s.filterText, filter === f.key && s.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderLead}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>Лийд байхгүй</Text>
          </View>
        }
      />

      <HotelTabBar active="leads" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#888' },
  headerTitle: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', letterSpacing: -0.3 },
  pulseBadge: {
    backgroundColor: '#E24B4A',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pulseBadgeText: { fontSize: 12, fontWeight: '500', color: '#FFF' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  filterPillActive: { backgroundColor: '#0F6E56', borderColor: '#0F6E56' },
  filterText: { fontSize: 13, fontWeight: '500', color: '#555' },
  filterTextActive: { color: '#FFF' },
  list: { paddingHorizontal: 20, paddingBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  cardName: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '500' },
  cardTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardTime: { fontSize: 12, color: '#999' },
  cardDetails: { gap: 4, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, color: '#888' },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5F1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  aiText: { fontSize: 12, color: '#0F6E56', flex: 1 },
  cardArrow: { position: 'absolute', right: 16, top: '50%' },
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
