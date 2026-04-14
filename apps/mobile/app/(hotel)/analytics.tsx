import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings, TrendingUp, ShoppingCart, DollarSign, Percent, ArrowLeft } from 'lucide-react-native';

const PERIODS = [
  { key: 'today', label: 'Өнөөдөр' },
  { key: '7d', label: '7 хоног' },
  { key: '30d', label: '30 хоног' },
  { key: 'all', label: 'Бүгд' },
];

const OCCUPANCY_DATA = [
  { day: 'Дав', value: 65 },
  { day: 'Мяг', value: 72 },
  { day: 'Лха', value: 80 },
  { day: 'Пүр', value: 55 },
  { day: 'Баа', value: 90 },
  { day: 'Бям', value: 95 },
  { day: 'Ням', value: 85 },
];

const CHANNELS = [
  { name: 'iHotel', pct: 45, color: '#0F6E56' },
  { name: 'Утас', pct: 30, color: '#4A90D9' },
  { name: 'Walk-in', pct: 15, color: '#F59E0B' },
  { name: 'Бусад', pct: 10, color: '#888' },
];

const RECENT_BOOKINGS = [
  { id: '1', guest: 'Батбаяр Д.', room: 'Deluxe 201', amount: '₮280,000', date: 'Өнөөдөр' },
  { id: '2', guest: 'Сарантуяа М.', room: 'Standard 102', amount: '₮150,000', date: 'Өчигдөр' },
  { id: '3', guest: 'Энхбат Т.', room: 'Suite 301', amount: '₮450,000', date: '04/11' },
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

const maxOccupancy = Math.max(...OCCUPANCY_DATA.map((d) => d.value));

export default function AnalyticsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState('7d');

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerBar}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#1A1A1A" strokeWidth={2.2} />
        </Pressable>
        <Text style={s.headerBarTitle}>Аналитик</Text>
        <View style={{ width: 38 }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Period Selector */}
        <View style={s.periodRow}>
          {PERIODS.map((p) => (
            <Pressable
              key={p.key}
              style={[s.periodPill, period === p.key && s.periodPillActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPeriod(p.key);
              }}
            >
              <Text style={[s.periodText, period === p.key && s.periodTextActive]}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={s.kpiGrid}>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconWrap, { backgroundColor: '#E8F5F1' }]}>
              <DollarSign size={18} color="#0F6E56" strokeWidth={2} />
            </View>
            <Text style={s.kpiValue}>{'₮4.2M'}</Text>
            <Text style={s.kpiLabel}>Орлого</Text>
          </View>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconWrap, { backgroundColor: '#E3F0FF' }]}>
              <ShoppingCart size={18} color="#4A90D9" strokeWidth={2} />
            </View>
            <Text style={s.kpiValue}>23</Text>
            <Text style={s.kpiLabel}>Захиалга</Text>
          </View>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconWrap, { backgroundColor: '#FFF8E1' }]}>
              <TrendingUp size={18} color="#F59E0B" strokeWidth={2} />
            </View>
            <Text style={s.kpiValue}>{'₮182K'}</Text>
            <Text style={s.kpiLabel}>Дундаж</Text>
          </View>
          <View style={s.kpiCard}>
            <View style={[s.kpiIconWrap, { backgroundColor: '#F3E8FF' }]}>
              <Percent size={18} color="#8B5CF6" strokeWidth={2} />
            </View>
            <Text style={s.kpiValue}>72%</Text>
            <Text style={s.kpiLabel}>Fill rate</Text>
          </View>
        </View>

        {/* Occupancy Chart */}
        <View style={s.chartCard}>
          <Text style={s.chartTitle}>Өрөөний ачааллын хувь</Text>
          <View style={s.chartRow}>
            {OCCUPANCY_DATA.map((d) => (
              <View key={d.day} style={s.barWrap}>
                <Text style={s.barValue}>{d.value}%</Text>
                <View style={s.barTrack}>
                  <View
                    style={[
                      s.barFill,
                      {
                        height: `${(d.value / maxOccupancy) * 100}%` as any,
                        backgroundColor: d.value >= 80 ? '#0F6E56' : d.value >= 60 ? '#F59E0B' : '#E24B4A',
                      },
                    ]}
                  />
                </View>
                <Text style={s.barLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Channel Breakdown */}
        <View style={s.channelCard}>
          <Text style={s.chartTitle}>Захиалгын суваг</Text>
          {CHANNELS.map((ch) => (
            <View key={ch.name} style={s.channelRow}>
              <View style={[s.channelDot, { backgroundColor: ch.color }]} />
              <Text style={s.channelName}>{ch.name}</Text>
              <View style={s.channelBarBg}>
                <View style={[s.channelBarFill, { width: `${ch.pct}%` as any, backgroundColor: ch.color }]} />
              </View>
              <Text style={s.channelPct}>{ch.pct}%</Text>
            </View>
          ))}
        </View>

        {/* Recent Bookings */}
        <View style={s.recentCard}>
          <Text style={s.chartTitle}>Сүүлийн захиалга</Text>
          {RECENT_BOOKINGS.map((b) => (
            <View key={b.id} style={s.bookingRow}>
              <View style={s.bookingInfo}>
                <Text style={s.bookingGuest}>{b.guest}</Text>
                <Text style={s.bookingRoom}>{b.room}</Text>
              </View>
              <View style={s.bookingRight}>
                <Text style={s.bookingAmount}>{b.amount}</Text>
                <Text style={s.bookingDate}>{b.date}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>

      <HotelTabBar active="" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBarTitle: { fontSize: 17, fontWeight: '500', color: '#1A1A1A' },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  periodPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  periodPillActive: { backgroundColor: '#0F6E56', borderColor: '#0F6E56' },
  periodText: { fontSize: 13, fontWeight: '500', color: '#555' },
  periodTextActive: { color: '#FFF' },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  kpiCard: {
    width: '47%' as any,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  kpiIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiValue: { fontSize: 22, fontWeight: '500', color: '#1A1A1A', marginBottom: 2 },
  kpiLabel: { fontSize: 12, color: '#888' },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  chartTitle: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', marginBottom: 16 },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, gap: 4 },
  barWrap: { flex: 1, alignItems: 'center' },
  barValue: { fontSize: 10, color: '#888', marginBottom: 4 },
  barTrack: {
    width: '80%',
    height: 100,
    backgroundColor: '#F3F3F3',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 11, color: '#888', marginTop: 6 },
  channelCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  channelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  channelDot: { width: 8, height: 8, borderRadius: 4 },
  channelName: { fontSize: 13, color: '#1A1A1A', width: 50 },
  channelBarBg: { flex: 1, height: 8, backgroundColor: '#F3F3F3', borderRadius: 4, overflow: 'hidden' },
  channelBarFill: { height: 8, borderRadius: 4 },
  channelPct: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', width: 36, textAlign: 'right' },
  recentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  bookingInfo: {},
  bookingGuest: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  bookingRoom: { fontSize: 12, color: '#888', marginTop: 2 },
  bookingRight: { alignItems: 'flex-end' },
  bookingAmount: { fontSize: 14, fontWeight: '500', color: '#0F6E56' },
  bookingDate: { fontSize: 12, color: '#999', marginTop: 2 },
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
