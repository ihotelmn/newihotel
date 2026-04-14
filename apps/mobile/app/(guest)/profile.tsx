import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  Search,
  Sparkles,
  Map,
  Heart,
  User,
  CalendarCheck,
  CreditCard,
  Gift,
  Settings,
  UserCircle,
  Bell,
  Globe,
  ShieldCheck,
  HelpCircle,
  FileText,
  ChevronRight,
  LogOut,
  Building2,
} from 'lucide-react-native';

const QUICK_ACTIONS = [
  { icon: CalendarCheck, label: 'Захиалга', color: '#0F6E56' },
  { icon: CreditCard, label: 'Төлбөр', color: '#4A90D9' },
  { icon: Gift, label: 'Урамшуулал', color: '#F59E0B' },
  { icon: Settings, label: 'Тохиргоо', color: '#888' },
];

const MENU_ITEMS = [
  { icon: UserCircle, label: 'Миний мэдээлэл', sub: 'Нэр, утас, и-мэйл' },
  { icon: Bell, label: 'Мэдэгдэл', sub: 'Push notification тохиргоо' },
  { icon: Globe, label: 'Хэл', sub: 'Монгол' },
  { icon: ShieldCheck, label: 'Нууцлал', sub: 'Нууц үг, баталгаажуулалт' },
  { icon: HelpCircle, label: 'Тусламж', sub: 'Холбоо барих, FAQ' },
  { icon: FileText, label: 'Үйлчилгээний нөхцөл', sub: '' },
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

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.headerTitle}>Профайл</Text>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>БЭ</Text>
          </View>
          <Text style={s.name}>Бат-Эрдэнэ</Text>
          <Text style={s.email}>bat.erdene@email.mn</Text>
        </View>

        {/* Loyalty Card */}
        <LinearGradient
          colors={['#04342C', '#0F6E56']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.loyaltyCard}
        >
          <View style={s.loyaltyHeader}>
            <Text style={s.loyaltyTitle}>iHotel Loyalty</Text>
            <View style={s.loyaltyLevelBadge}>
              <Text style={s.loyaltyLevel}>{'🥈 Мөнгө'}</Text>
            </View>
          </View>
          <Text style={s.loyaltyPoints}>240 оноо</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: '60%' }]} />
          </View>
          <Text style={s.progressLabel}>Алтан зэрэгт 160 оноо дутуу</Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={s.quickGrid}>
          {QUICK_ACTIONS.map((a, i) => {
            const Icon = a.icon;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [s.quickItem, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert(a.label);
                }}
              >
                <View style={[s.quickIconWrap, { backgroundColor: a.color + '12' }]}>
                  <Icon size={22} color={a.color} strokeWidth={1.8} />
                </View>
                <Text style={s.quickLabel}>{a.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU_ITEMS.map((m, i) => {
            const Icon = m.icon;
            return (
              <Pressable
                key={i}
                style={({ pressed }) => [s.menuRow, pressed && { backgroundColor: '#F8F7F3' }]}
                onPress={() => Alert.alert(m.label)}
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

        {/* Hotel Owner Mode */}
        <Pressable
          style={({ pressed }) => [s.hotelModeBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.replace('/(hotel)/leads' as any);
          }}
        >
          <Building2 size={20} color="#FFF" strokeWidth={2} />
          <Text style={s.hotelModeText}>Буудлын эзэн горим</Text>
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
      <TabBar active="profile" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scroll: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', marginTop: 12, marginBottom: 20, letterSpacing: -0.3 },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarText: { fontSize: 28, fontWeight: '500', color: '#FFF' },
  name: { fontSize: 20, fontWeight: '500', color: '#1A1A1A' },
  email: { fontSize: 13, color: '#888', marginTop: 3 },
  loyaltyCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 22,
    shadowColor: '#04342C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  loyaltyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  loyaltyTitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  loyaltyLevelBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  loyaltyLevel: { fontSize: 12, color: '#FFF', fontWeight: '500' },
  loyaltyPoints: { fontSize: 34, fontWeight: '500', color: '#FFF', marginBottom: 14 },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 10,
  },
  progressFill: { height: 6, backgroundColor: '#FFF', borderRadius: 3 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 22,
    gap: 12,
  },
  quickItem: {
    width: '47%' as any,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
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
  hotelModeBtn: {
    flexDirection: 'row',
    backgroundColor: '#0F6E56',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  hotelModeText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
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
