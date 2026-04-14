import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings, ChevronRight, LogOut, UserPlus, DollarSign, FileText, ShieldCheck, MessageCircle, BarChart3, Sparkles, User } from 'lucide-react-native';

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

const MENU_ITEMS = [
  { icon: UserPlus, label: 'Ажилчид', sub: '3 хүн', key: 'staff' },
  { icon: DollarSign, label: 'Тариф тохиргоо', sub: '', key: 'tariff' },
  { icon: FileText, label: 'Төлбөрийн түүх', sub: '', key: 'billing' },
  { icon: ShieldCheck, label: 'Нууцлал', sub: '', key: 'privacy' },
];

export default function HotelSettingsScreen() {
  const router = useRouter();
  const [aiAutoReply, setAiAutoReply] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [bookingConfirm, setBookingConfirm] = useState(false);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.headerTitle}>Тохиргоо</Text>

        {/* Hotel Info */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Зочид буудлын мэдээлэл</Text>
          <View style={s.infoCard}>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Нэр</Text>
              <Text style={s.infoValue}>Шангри-Ла Улаанбаатар</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Хаяг</Text>
              <Text style={s.infoValue}>Olympic street 19, UB</Text>
            </View>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Утас</Text>
              <Text style={s.infoValue}>+976 7711-9900</Text>
            </View>
            <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={s.infoLabel}>И-мэйл</Text>
              <Text style={s.infoValue}>info@shangrila.mn</Text>
            </View>
          </View>
        </View>

        {/* Subscription */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Захиалга</Text>
          <View style={s.subCard}>
            <View style={s.subHeader}>
              <Text style={s.subPlan}>Pro план</Text>
              <View style={s.subPriceBadge}>
                <Text style={s.subPrice}>{'₮99,000/сар'}</Text>
              </View>
            </View>
            <Text style={s.subNext}>{'Дараа төлөх: 5/15'}</Text>
          </View>
        </View>

        {/* Toggles */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Тохиргоо</Text>
          <View style={s.toggleCard}>
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>AI автомат хариулт</Text>
              <Switch
                value={aiAutoReply}
                onValueChange={(v) => {
                  setAiAutoReply(v);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                trackColor={{ false: '#EDEDED', true: '#0F6E56' }}
                thumbColor="#FFF"
              />
            </View>
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>Push мэдэгдэл</Text>
              <Switch
                value={pushNotif}
                onValueChange={(v) => {
                  setPushNotif(v);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                trackColor={{ false: '#EDEDED', true: '#0F6E56' }}
                thumbColor="#FFF"
              />
            </View>
            <View style={[s.toggleRow, { borderBottomWidth: 0 }]}>
              <Text style={s.toggleLabel}>Захиалга баталгаажуулалт</Text>
              <Switch
                value={bookingConfirm}
                onValueChange={(v) => {
                  setBookingConfirm(v);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                trackColor={{ false: '#EDEDED', true: '#0F6E56' }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU_ITEMS.map((m) => {
            const Icon = m.icon;
            return (
              <Pressable
                key={m.key}
                style={({ pressed }) => [s.menuRow, pressed && { backgroundColor: '#F8F7F3' }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(m.label);
                }}
              >
                <View style={s.menuIconWrap}>
                  <Icon size={20} color="#555" strokeWidth={1.8} />
                </View>
                <View style={s.menuTextWrap}>
                  <Text style={s.menuLabel}>{m.label}</Text>
                  {m.sub ? <Text style={s.menuSub}>{m.sub}</Text> : null}
                </View>
                <ChevronRight size={18} color="#CCC" strokeWidth={2} />
              </Pressable>
            );
          })}
        </View>

        {/* Navigation Links */}
        <View style={s.menu}>
          <Pressable
            style={({ pressed }) => [s.menuRow, pressed && { backgroundColor: '#F8F7F3' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(hotel)/host-inbox' as any);
            }}
          >
            <View style={s.menuIconWrap}>
              <MessageCircle size={20} color="#555" strokeWidth={1.8} />
            </View>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Мессеж</Text>
            </View>
            <ChevronRight size={18} color="#CCC" strokeWidth={2} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.menuRow, pressed && { backgroundColor: '#F8F7F3' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(hotel)/analytics' as any);
            }}
          >
            <View style={s.menuIconWrap}>
              <BarChart3 size={20} color="#555" strokeWidth={1.8} />
            </View>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>Аналитик</Text>
            </View>
            <ChevronRight size={18} color="#CCC" strokeWidth={2} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.menuRow, pressed && { backgroundColor: '#F8F7F3' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(hotel)/ai-assistant' as any);
            }}
          >
            <View style={s.menuIconWrap}>
              <Sparkles size={20} color="#555" strokeWidth={1.8} />
            </View>
            <View style={s.menuTextWrap}>
              <Text style={s.menuLabel}>AI туслах</Text>
            </View>
            <ChevronRight size={18} color="#CCC" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Guest Mode Switch */}
        <Pressable
          style={({ pressed }) => [s.modeSwitchBtn, pressed && { opacity: 0.9 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace('/(guest)/search' as any);
          }}
        >
          <User size={18} color="#0F6E56" strokeWidth={2} />
          <Text style={s.modeSwitchText}>Зочны горим руу</Text>
        </Pressable>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [s.logoutBtn, pressed && { backgroundColor: '#FFF5F5' }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert('Гарах', 'Та гарахдаа итгэлтэй байна уу?', [
              { text: 'Үгүй' },
              { text: 'Тийм', onPress: () => router.replace('/'), style: 'destructive' },
            ]);
          }}
        >
          <LogOut size={18} color="#E24B4A" strokeWidth={2} />
          <Text style={s.logoutText}>Гарах</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>

      <HotelTabBar active="settings" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scroll: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', marginTop: 12, marginBottom: 20, letterSpacing: -0.3 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '500', color: '#888', marginBottom: 8, letterSpacing: -0.01 },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  subCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  subPlan: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  subPriceBadge: { backgroundColor: '#E8F5F1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  subPrice: { fontSize: 13, fontWeight: '500', color: '#0F6E56' },
  subNext: { fontSize: 13, color: '#888' },
  toggleCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  toggleLabel: { fontSize: 15, fontWeight: '400', color: '#1A1A1A', flex: 1, marginRight: 12 },
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8F7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  menuSub: { fontSize: 12, color: '#999', marginTop: 2 },
  modeSwitchBtn: {
    flexDirection: 'row',
    backgroundColor: '#E8F5F1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  modeSwitchText: { fontSize: 15, fontWeight: '500', color: '#0F6E56' },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F5E5E5',
  },
  logoutText: { fontSize: 15, fontWeight: '500', color: '#E24B4A' },
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
