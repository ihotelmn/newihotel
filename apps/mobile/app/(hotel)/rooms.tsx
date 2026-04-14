import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings } from 'lucide-react-native';

type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

type Room = {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  price: string;
};

const INITIAL_ROOMS: Room[] = [
  { id: '1', number: '101', type: 'Standard', status: 'available', price: '₮120,000' },
  { id: '2', number: '102', type: 'Standard', status: 'available', price: '₮120,000' },
  { id: '3', number: '103', type: 'Standard', status: 'occupied', price: '₮120,000' },
  { id: '4', number: '201', type: 'Deluxe', status: 'available', price: '₮220,000' },
  { id: '5', number: '202', type: 'Deluxe', status: 'occupied', price: '₮220,000' },
  { id: '6', number: '203', type: 'Deluxe', status: 'cleaning', price: '₮220,000' },
  { id: '7', number: '301', type: 'Suite', status: 'available', price: '₮380,000' },
  { id: '8', number: '302', type: 'Suite', status: 'available', price: '₮380,000' },
  { id: '9', number: '303', type: 'Suite', status: 'occupied', price: '₮380,000' },
  { id: '10', number: '401', type: 'Standard', status: 'available', price: '₮120,000' },
  { id: '11', number: '402', type: 'Standard', status: 'available', price: '₮120,000' },
  { id: '12', number: '403', type: 'Deluxe', status: 'available', price: '₮220,000' },
  { id: '13', number: '501', type: 'Suite', status: 'available', price: '₮380,000' },
  { id: '14', number: '502', type: 'Deluxe', status: 'maintenance', price: '₮220,000' },
];

const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string }> = {
  available: { label: 'Сул', color: '#22C55E' },
  occupied: { label: 'Захиалтай', color: '#E24B4A' },
  cleaning: { label: 'Цэвэрлэж байна', color: '#F59E0B' },
  maintenance: { label: 'Засвартай', color: '#888' },
};

const STATUS_CYCLE: RoomStatus[] = ['available', 'occupied', 'cleaning', 'maintenance'];

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

const screenW = Dimensions.get('window').width;
const cardW = (screenW - 20 * 2 - 12) / 2;

export default function RoomsScreen() {
  const [rooms, setRooms] = useState(INITIAL_ROOMS);

  const today = new Date();
  const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'occupied').length;
  const cleaningCount = rooms.filter((r) => r.status === 'cleaning').length;

  const handleRoomPress = (room: Room) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextIdx = (STATUS_CYCLE.indexOf(room.status) + 1) % STATUS_CYCLE.length;
    const nextStatus = STATUS_CYCLE[nextIdx];
    const nextLabel = STATUS_CONFIG[nextStatus].label;
    Alert.alert(
      `${room.number} ${room.type}`,
      `Статус "${nextLabel}" болгох уу?`,
      [
        { text: 'Үгүй', style: 'cancel' },
        {
          text: 'Тийм',
          onPress: () => {
            setRooms((prev) =>
              prev.map((r) => (r.id === room.id ? { ...r, status: nextStatus } : r)),
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.headerTitle}>Өрөө менежмент</Text>
        <Text style={s.dateText}>{dateStr}</Text>

        <View style={s.summaryRow}>
          <View style={s.summaryItem}>
            <Text style={s.summaryNum}>{rooms.length}</Text>
            <Text style={s.summaryLabel}>Нийт</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={[s.summaryNum, { color: '#22C55E' }]}>{availableCount}</Text>
            <Text style={s.summaryLabel}>Сул</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={[s.summaryNum, { color: '#E24B4A' }]}>{occupiedCount}</Text>
            <Text style={s.summaryLabel}>Захиалтай</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={[s.summaryNum, { color: '#F59E0B' }]}>{cleaningCount}</Text>
            <Text style={s.summaryLabel}>Цэвэрлэж</Text>
          </View>
        </View>

        <View style={s.grid}>
          {rooms.map((room) => {
            const sc = STATUS_CONFIG[room.status];
            return (
              <Pressable
                key={room.id}
                style={({ pressed }) => [s.roomCard, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
                onPress={() => handleRoomPress(room)}
              >
                <View style={s.roomHeader}>
                  <Text style={s.roomNumber}>{room.number}</Text>
                  <View style={[s.statusDot, { backgroundColor: sc.color }]} />
                </View>
                <Text style={s.roomType}>{room.type}</Text>
                <Text style={s.roomPrice}>{room.price}</Text>
                <Text style={[s.roomStatus, { color: sc.color }]}>{sc.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>

      <HotelTabBar active="rooms" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scroll: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', marginTop: 12, letterSpacing: -0.3 },
  dateText: { fontSize: 13, color: '#888', marginTop: 2, marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 22, fontWeight: '500', color: '#1A1A1A', marginBottom: 2 },
  summaryLabel: { fontSize: 11, color: '#888' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  roomCard: {
    width: cardW,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  roomHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  roomNumber: { fontSize: 18, fontWeight: '500', color: '#1A1A1A' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  roomType: { fontSize: 12, color: '#888', marginBottom: 4 },
  roomPrice: { fontSize: 14, fontWeight: '500', color: '#0F6E56', marginBottom: 4 },
  roomStatus: { fontSize: 11, fontWeight: '500' },
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
