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

const QUICK_ACTIONS = [
  { icon: '🏨', label: 'Захиалга' },
  { icon: '💳', label: 'Төлбөр' },
  { icon: '🎁', label: 'Урамшуулал' },
  { icon: '⚙️', label: 'Тохиргоо' },
];

const MENU_ITEMS = [
  { icon: '📋', label: 'Миний мэдээлэл', sub: 'Нэр, утас, и-мэйл' },
  { icon: '🔔', label: 'Мэдэгдэл', sub: 'Push notification тохиргоо' },
  { icon: '🌐', label: 'Хэл', sub: 'Монгол' },
  { icon: '🛡️', label: 'Нууцлал', sub: 'Нууц үг, баталгаажуулалт' },
  { icon: '📞', label: 'Тусламж', sub: 'Холбоо барих, FAQ' },
  { icon: '📄', label: 'Үйлчилгээний нөхцөл', sub: '' },
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

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.headerTitle}>Профайл</Text>

        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>БЭ</Text>
          </View>
          <Text style={s.name}>Бат-Эрдэнэ</Text>
          <Text style={s.email}>bat.erdene@email.mn</Text>
        </View>

        <View style={s.loyaltyCard}>
          <View style={s.loyaltyHeader}>
            <Text style={s.loyaltyTitle}>iHotel Loyalty</Text>
            <Text style={s.loyaltyLevel}>🥈 Мөнгө</Text>
          </View>
          <Text style={s.loyaltyPoints}>240 оноо</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: '60%' }]} />
          </View>
          <Text style={s.progressLabel}>Алтан зэрэгт 160 оноо дутуу</Text>
        </View>

        <View style={s.quickGrid}>
          {QUICK_ACTIONS.map((a, i) => (
            <Pressable
              key={i}
              style={s.quickItem}
              onPress={() => Alert.alert(a.label)}
            >
              <Text style={s.quickIcon}>{a.icon}</Text>
              <Text style={s.quickLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.menu}>
          {MENU_ITEMS.map((m, i) => (
            <Pressable
              key={i}
              style={s.menuRow}
              onPress={() => Alert.alert(m.label)}
            >
              <Text style={s.menuIcon}>{m.icon}</Text>
              <View style={s.menuTextWrap}>
                <Text style={s.menuLabel}>{m.label}</Text>
                {m.sub ? <Text style={s.menuSub}>{m.sub}</Text> : null}
              </View>
              <Text style={s.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={s.logoutBtn}
          onPress={() => {
            Alert.alert('Гарах', 'Та гарахдаа итгэлтэй байна уу?', [
              { text: 'Үгүй' },
              { text: 'Тийм', onPress: () => router.replace('/') },
            ]);
          }}
        >
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
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginTop: 12, marginBottom: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  name: { fontSize: 20, fontWeight: '600', color: '#1A1A1A' },
  email: { fontSize: 13, color: '#888', marginTop: 2 },
  loyaltyCard: {
    backgroundColor: '#0F6E56',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  loyaltyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  loyaltyTitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  loyaltyLevel: { fontSize: 13, color: '#FFF', fontWeight: '600' },
  loyaltyPoints: { fontSize: 32, fontWeight: '700', color: '#FFF', marginBottom: 12 },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: { height: 6, backgroundColor: '#FFF', borderRadius: 3 },
  progressLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  quickItem: {
    width: '47%' as any,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  quickIcon: { fontSize: 24, marginBottom: 6 },
  quickLabel: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  menuIcon: { fontSize: 20, marginRight: 12 },
  menuTextWrap: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  menuSub: { fontSize: 12, color: '#999', marginTop: 1 },
  menuArrow: { fontSize: 20, color: '#CCC' },
  logoutBtn: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  logoutText: { fontSize: 15, fontWeight: '500', color: '#E53935' },
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
