import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Sparkles, Send, BedDouble, DollarSign, Megaphone, Inbox, Users, Settings, ArrowLeft } from 'lucide-react-native';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'ai';
};

const SUGGESTIONS = [
  { icon: BedDouble, text: 'Маргааш ямар өрөө сул?', color: '#0F6E56' },
  { icon: DollarSign, text: 'Энэ сарын орлого?', color: '#F59E0B' },
  { icon: Megaphone, text: 'Шинэ campaign бич', color: '#4A90D9' },
  { icon: Users, text: 'VIP зочдын жагсаалт', color: '#8B5CF6' },
];

const AI_REPLIES: Record<string, string> = {
  default: 'Би танд зочид буудлын менежментийн асуудлаар тусалж чадна. Өрөөний мэдээлэл, орлого, захиалга, маркетинг зэргийн талаар асуугаарай.',
  room: 'Маргааш (04/14) нийт 14 өрөөнөөс:\n\n- 8 Standard сул (₮120,000)\n- 2 Deluxe сул (₮220,000)\n- 1 Suite сул (₮380,000)\n\nНийт 11 өрөө захиалгад бэлэн.',
  revenue: 'Энэ сарын орлого:\n\n- Нийт: ₮4,200,000\n- Өрөө: ₮3,600,000\n- Нэмэлт: ₮600,000\n- Өнгөрсөн сартай харьцуулахад +12%\n\nFill rate: 72%',
  campaign: 'Шинэ campaign санаа:\n\n"Зуны эрт захиалга -20%"\n- Суваг: SMS + Push\n- Зорилтот: Өмнө ирж байсан зочид\n- Хугацаа: 7 хоног\n\nЭнэ campaign-ыг үүсгэх үү?',
  vip: 'VIP зочид (5+):\n\n1. Мөнхбат Э. — 15 удаа, ₮5.8M\n2. Батбаяр Д. — 12 удаа, ₮3.4M\n3. Энхбат Т. — 8 удаа, ₮2.1M\n4. Болд О. — 6 удаа, ₮1.68M\n5. Ганбаатар Ж. — 5 удаа, ₮1.25M',
};

function getAIReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('өрөө') || lower.includes('сул') || lower.includes('маргааш')) return AI_REPLIES.room;
  if (lower.includes('орлого') || lower.includes('сар')) return AI_REPLIES.revenue;
  if (lower.includes('campaign') || lower.includes('маркетинг') || lower.includes('бич')) return AI_REPLIES.campaign;
  if (lower.includes('vip') || lower.includes('жагсаалт')) return AI_REPLIES.vip;
  return AI_REPLIES.default;
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [dot1, dot2, dot3]);

  return (
    <View style={bs.typingRow}>
      {[dot1, dot2, dot3].map((d, i) => (
        <Animated.View key={i} style={[bs.typingDot, { opacity: d }]} />
      ))}
    </View>
  );
}

const HOTEL_TAB_ICONS: Record<string, typeof Inbox> = {
  leads: Inbox,
  rooms: BedDouble,
  guests: Users,
  marketing: Megaphone,
  settings: Settings,
};

const HOTEL_TABS_DATA = [
  { key: 'leads', label: 'Лийд', route: '/(hotel)/leads' },
  { key: 'rooms', label: 'Өрөө', route: '/(hotel)/rooms' },
  { key: 'guests', label: 'Зочин', route: '/(hotel)/guests' },
  { key: 'marketing', label: 'Маркетинг', route: '/(hotel)/marketing' },
  { key: 'settings', label: 'Тохиргоо', route: '/(hotel)/settings' },
];

function HotelTabBar({ active }: { active: string }) {
  const router = useRouter();
  return (
    <View style={tabStyles.bar}>
      {HOTEL_TABS_DATA.map((t) => {
        const Icon = HOTEL_TAB_ICONS[t.key] ?? Inbox;
        const isActive = t.key === active;
        return (
          <Pressable
            key={t.key}
            style={tabStyles.tab}
            onPress={() => {
              if (!isActive) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.replace(t.route as any);
              }
            }}
          >
            <Icon size={22} color={isActive ? '#0F6E56' : '#999'} strokeWidth={isActive ? 2.2 : 1.8} />
            <Text style={[tabStyles.label, isActive && tabStyles.active]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HotelAIAssistantScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const showWelcome = messages.length === 0;

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const userMsg: Message = { id: Date.now().toString(), text: text.trim(), from: 'user' };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setTyping(true);

      setTimeout(() => {
        const aiMsg: Message = { id: (Date.now() + 1).toString(), text: getAIReply(text), from: 'ai' };
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);
      }, 1200);
    },
    [],
  );

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, typing]);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={s.header}>
          <Pressable
            style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#1A1A1A" strokeWidth={2.2} />
          </Pressable>
          <View style={s.headerLeft}>
            <View style={s.aiHeaderIcon}>
              <Sparkles size={18} color="#0F6E56" strokeWidth={2} />
            </View>
            <View>
              <Text style={s.headerTitle}>Hotel AI</Text>
              <View style={s.onlineRow}>
                <View style={s.onlineDot} />
                <Text style={s.headerSub}>Онлайн</Text>
              </View>
            </View>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={s.flex}
          contentContainerStyle={s.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showWelcome && (
            <View style={s.welcome}>
              <View style={s.aiAvatar}>
                <Sparkles size={28} color="#0F6E56" strokeWidth={2} />
              </View>
              <Text style={s.welcomeTitle}>Hotel AI Туслах</Text>
              <Text style={s.welcomeSub}>Зочид буудлын менежментийн бүх асуулт асуугаарай</Text>
              <View style={s.sugGrid}>
                {SUGGESTIONS.map((sug, i) => {
                  const Icon = sug.icon;
                  return (
                    <Pressable
                      key={i}
                      style={({ pressed }) => [s.sugCard, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
                      onPress={() => sendMessage(sug.text)}
                    >
                      <View style={[s.sugIconWrap, { backgroundColor: sug.color + '14' }]}>
                        <Icon size={20} color={sug.color} strokeWidth={1.8} />
                      </View>
                      <Text style={s.sugText}>{sug.text}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {messages.map((msg) => (
            <View key={msg.id} style={[bs.wrap, msg.from === 'user' ? bs.userWrap : bs.aiWrap]}>
              {msg.from === 'ai' && (
                <View style={bs.aiMiniAvatar}>
                  <Sparkles size={12} color="#0F6E56" strokeWidth={2} />
                </View>
              )}
              <View style={[bs.bubble, msg.from === 'user' ? bs.bubbleUser : bs.bubbleAI]}>
                <Text style={[bs.bubbleText, msg.from === 'user' ? bs.textUser : bs.textAI]}>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {typing && (
            <View style={[bs.wrap, bs.aiWrap]}>
              <View style={bs.aiMiniAvatar}>
                <Sparkles size={12} color="#0F6E56" strokeWidth={2} />
              </View>
              <View style={[bs.bubble, bs.bubbleAI]}>
                <TypingIndicator />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={s.inputBar}>
          <TextInput
            style={s.textInput}
            placeholder="Асуулт бичих..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <Pressable
            style={[s.sendBtn, !input.trim() && s.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Send size={18} color="#FFF" strokeWidth={2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <HotelTabBar active="" />
    </SafeAreaView>
  );
}

const bs = StyleSheet.create({
  wrap: { paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  aiWrap: { justifyContent: 'flex-start' },
  userWrap: { justifyContent: 'flex-end' },
  aiMiniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: { maxWidth: '78%', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12 },
  bubbleUser: { backgroundColor: '#1A1A1A', borderBottomRightRadius: 6 },
  bubbleAI: { backgroundColor: '#E3F0FF', borderBottomLeftRadius: 6 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  textUser: { color: '#FFF' },
  textAI: { color: '#1A1A1A' },
  typingRow: { flexDirection: 'row', gap: 4, paddingVertical: 4, paddingHorizontal: 2 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#666' },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  headerSub: { fontSize: 11, color: '#22C55E', fontWeight: '500' },
  messagesContent: { padding: 16, paddingBottom: 8 },
  welcome: { alignItems: 'center', paddingTop: 40 },
  aiAvatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#E8F5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeTitle: { fontSize: 22, fontWeight: '500', color: '#1A1A1A', marginBottom: 6 },
  welcomeSub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28, paddingHorizontal: 20, lineHeight: 21 },
  sugGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 4, width: '100%' },
  sugCard: {
    width: '47%' as any,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  sugIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sugText: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', lineHeight: 18 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    maxHeight: 100,
    color: '#1A1A1A',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.35 },
});

const tabStyles = StyleSheet.create({
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
