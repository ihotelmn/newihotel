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
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings, Sparkles, Mail, Bell, Share2, Eye, MousePointer } from 'lucide-react-native';

type CampaignStatus = 'active' | 'draft' | 'completed';
type Channel = 'SMS' | 'Push' | 'Social';

type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  status: CampaignStatus;
  sent: number;
  opened: number;
  clicked: number;
};

const CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Зуны урамшуулал -30%', channel: 'SMS', status: 'active', sent: 520, opened: 340, clicked: 89 },
  { id: '2', name: 'VIP зочдын тусгай санал', channel: 'Push', status: 'active', sent: 120, opened: 95, clicked: 42 },
  { id: '3', name: 'Шинэ жилийн package', channel: 'Social', status: 'completed', sent: 800, opened: 450, clicked: 120 },
  { id: '4', name: 'Weekend getaway', channel: 'SMS', status: 'draft', sent: 0, opened: 0, clicked: 0 },
  { id: '5', name: 'Loyalty шагнал мэдэгдэл', channel: 'Push', status: 'completed', sent: 340, opened: 280, clicked: 95 },
];

const STATUS_COLORS: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
  active: { bg: '#E8F5F1', text: '#0F6E56', label: 'Идэвхтэй' },
  draft: { bg: '#F3F3F3', text: '#888', label: 'Ноорог' },
  completed: { bg: '#E3F0FF', text: '#4A90D9', label: 'Дууссан' },
};

const CHANNEL_ICONS: Record<Channel, typeof Mail> = {
  SMS: Mail,
  Push: Bell,
  Social: Share2,
};

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

export default function MarketingScreen() {
  const activeCount = CAMPAIGNS.filter((c) => c.status === 'active').length;
  const totalSent = CAMPAIGNS.reduce((sum, c) => sum + c.sent, 0);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.headerTitle}>Маркетинг</Text>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statNum}>{CAMPAIGNS.length}</Text>
            <Text style={s.statLabel}>Нийт campaign</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: '#0F6E56' }]}>{activeCount}</Text>
            <Text style={s.statLabel}>Идэвхтэй</Text>
          </View>
          <View style={s.statCard}>
            <Text style={[s.statNum, { color: '#4A90D9' }]}>{totalSent.toLocaleString()}</Text>
            <Text style={s.statLabel}>Хүргэсэн</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [s.aiButton, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Alert.alert('AI Campaign', 'AI шинэ campaign үүсгэх боломж удахгүй нээгдэнэ');
          }}
        >
          <Sparkles size={20} color="#FFF" strokeWidth={2} />
          <Text style={s.aiButtonText}>AI шинэ campaign үүсгэх</Text>
        </Pressable>

        <Text style={s.sectionTitle}>Campaigns</Text>

        {CAMPAIGNS.map((c) => {
          const sc = STATUS_COLORS[c.status];
          const ChannelIcon = CHANNEL_ICONS[c.channel];
          return (
            <Pressable
              key={c.id}
              style={({ pressed }) => [s.campaignCard, pressed && { opacity: 0.95 }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(c.name, `Суваг: ${c.channel}\nИлгээсэн: ${c.sent}\nНээсэн: ${c.opened}\nДарсан: ${c.clicked}`);
              }}
            >
              <View style={s.campaignHeader}>
                <View style={s.channelBadge}>
                  <ChannelIcon size={14} color="#555" strokeWidth={2} />
                  <Text style={s.channelText}>{c.channel}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[s.statusText, { color: sc.text }]}>{sc.label}</Text>
                </View>
              </View>
              <Text style={s.campaignName}>{c.name}</Text>
              {c.sent > 0 && (
                <View style={s.metricsRow}>
                  <View style={s.metric}>
                    <Mail size={12} color="#888" strokeWidth={2} />
                    <Text style={s.metricText}>{c.sent}</Text>
                  </View>
                  <View style={s.metric}>
                    <Eye size={12} color="#888" strokeWidth={2} />
                    <Text style={s.metricText}>{c.opened}</Text>
                  </View>
                  <View style={s.metric}>
                    <MousePointer size={12} color="#888" strokeWidth={2} />
                    <Text style={s.metricText}>{c.clicked}</Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
        <View style={{ height: 16 }} />
      </ScrollView>

      <HotelTabBar active="marketing" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scroll: { paddingHorizontal: 20 },
  headerTitle: { fontSize: 26, fontWeight: '500', color: '#1A1A1A', marginTop: 12, marginBottom: 16, letterSpacing: -0.3 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
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
  aiButton: {
    flexDirection: 'row',
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  aiButtonText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
  sectionTitle: { fontSize: 17, fontWeight: '500', color: '#1A1A1A', marginBottom: 12, letterSpacing: -0.02 },
  campaignCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  campaignHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F7F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  channelText: { fontSize: 11, fontWeight: '500', color: '#555' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '500' },
  campaignName: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', marginBottom: 8 },
  metricsRow: { flexDirection: 'row', gap: 16 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { fontSize: 12, color: '#888' },
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
