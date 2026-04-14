import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Inbox, BedDouble, Users, Megaphone, Settings, Sparkles, ArrowLeft } from 'lucide-react-native';

type Conversation = {
  id: string;
  guestName: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
};

const CONVERSATIONS: Conversation[] = [
  { id: '1', guestName: 'Батбаяр Д.', initials: 'БД', lastMessage: 'Deluxe өрөө сул байна уу?', timestamp: '2 мин', unread: 2 },
  { id: '2', guestName: 'Сарантуяа М.', initials: 'СМ', lastMessage: 'Баярлалаа, маргааш очно', timestamp: '15 мин', unread: 0 },
  { id: '3', guestName: 'Энхбат Т.', initials: 'ЭТ', lastMessage: 'Suite өрөөнд Wi-Fi байна уу?', timestamp: '1 цаг', unread: 1 },
  { id: '4', guestName: 'Оюунчимэг Б.', initials: 'ОБ', lastMessage: 'Орой 8 цагт ирнэ', timestamp: '3 цаг', unread: 0 },
  { id: '5', guestName: 'Ганбаатар Ж.', initials: 'ГЖ', lastMessage: 'Өглөөний цай хэдэн цагт вэ?', timestamp: '5 цаг', unread: 3 },
  { id: '6', guestName: 'Мөнхбат Э.', initials: 'МЭ', lastMessage: 'Ресторан захиалга хийж болох уу?', timestamp: '1 өдөр', unread: 0 },
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

export default function HostInboxScreen() {
  const router = useRouter();
  const [autoReply, setAutoReply] = useState(true);

  const renderConversation = useCallback(
    ({ item }: { item: Conversation }) => (
      <Pressable
        style={({ pressed }) => [s.convCard, pressed && { backgroundColor: '#F8F7F3' }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(`/chat/${item.id}` as any);
        }}
      >
        <View style={[s.avatar, item.unread > 0 && s.avatarUnread]}>
          <Text style={s.avatarText}>{item.initials}</Text>
        </View>
        <View style={s.convInfo}>
          <View style={s.convTopRow}>
            <Text style={[s.convName, item.unread > 0 && s.convNameUnread]}>{item.guestName}</Text>
            <Text style={s.convTime}>{item.timestamp}</Text>
          </View>
          <Text style={[s.convMessage, item.unread > 0 && s.convMessageUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unread > 0 && (
          <View style={s.unreadBadge}>
            <Text style={s.unreadText}>{item.unread}</Text>
          </View>
        )}
      </Pressable>
    ),
    [router],
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#1A1A1A" strokeWidth={2.2} />
        </Pressable>
        <Text style={s.headerTitle}>Мессеж</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={s.autoReplyRow}>
        <View style={s.autoReplyLeft}>
          <Sparkles size={16} color="#0F6E56" strokeWidth={2} />
          <Text style={s.autoReplyText}>AI автомат хариулт идэвхтэй</Text>
        </View>
        <Switch
          value={autoReply}
          onValueChange={(v) => {
            setAutoReply(v);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          trackColor={{ false: '#EDEDED', true: '#0F6E56' }}
          thumbColor="#FFF"
        />
      </View>

      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>Мессеж байхгүй</Text>
          </View>
        }
      />

      <HotelTabBar active="" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  header: {
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
  headerTitle: { fontSize: 17, fontWeight: '500', color: '#1A1A1A' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: '#888' },
  autoReplyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5F1',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  autoReplyLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  autoReplyText: { fontSize: 13, fontWeight: '500', color: '#0F6E56' },
  list: { paddingBottom: 16 },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarUnread: { backgroundColor: '#0F6E56' },
  avatarText: { fontSize: 16, fontWeight: '500', color: '#FFF' },
  convInfo: { flex: 1 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  convName: { fontSize: 15, fontWeight: '400', color: '#1A1A1A' },
  convNameUnread: { fontWeight: '500' },
  convTime: { fontSize: 12, color: '#999' },
  convMessage: { fontSize: 13, color: '#888' },
  convMessageUnread: { color: '#1A1A1A', fontWeight: '400' },
  unreadBadge: {
    backgroundColor: '#0F6E56',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 11, fontWeight: '500', color: '#FFF' },
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
