import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Sparkles,
  Mic,
  Send,
  Settings,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontWeights, fontSize, spacing, radius, easing } from '@ihotel/config';
import { HotelCard, useHaptic } from '@ihotel/ui';
import type { Hotel } from '@ihotel/types';

/* ─── types ─── */

interface AIMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  hotels?: Hotel[];
  quickReplies?: string[];
}

/* ─── mock hotels for AI recommendation ─── */

const MOCK_HOTELS: Hotel[] = [
  {
    id: 'ai-h1', name: 'Хатгалын Гэр буудал', description: '', address: '', city: 'Хатгал',
    latitude: 0, longitude: 0, star_rating: 4, avg_rating: 4.7, review_count: 89,
    price_min: 170000, price_max: 220000, amenities: ['wifi', 'restaurant'],
    image_url: 'https://picsum.photos/seed/khatgal1/400/300', images: ['https://picsum.photos/seed/khatgal1/400/300'],
    is_featured: true, created_at: '', updated_at: '',
  },
  {
    id: 'ai-h2', name: 'Далайн Эрэг Resort', description: '', address: '', city: 'Хөвсгөл',
    latitude: 0, longitude: 0, star_rating: 4, avg_rating: 4.5, review_count: 56,
    price_min: 210000, price_max: 280000, amenities: ['wifi', 'spa'],
    image_url: 'https://picsum.photos/seed/khuvsgul2/400/300', images: ['https://picsum.photos/seed/khuvsgul2/400/300'],
    is_featured: false, created_at: '', updated_at: '',
  },
  {
    id: 'ai-h3', name: 'Цаатан Camp', description: '', address: '', city: 'Хатгал',
    latitude: 0, longitude: 0, star_rating: 3, avg_rating: 4.3, review_count: 34,
    price_min: 120000, price_max: 160000, amenities: ['restaurant'],
    image_url: 'https://picsum.photos/seed/tsaatan3/400/300', images: ['https://picsum.photos/seed/tsaatan3/400/300'],
    is_featured: false, created_at: '', updated_at: '',
  },
];

const AI_FLOW: { trigger: string; response: AIMessage }[] = [
  {
    trigger: 'default_budget',
    response: {
      id: 'ai-2',
      text: 'Гайхалтай газар! Хөвсгөл далайн эргээр олон сайхан буудал бий. Төсөв ямар вэ?',
      sender: 'ai',
      quickReplies: ['₮150K хүртэл', '₮200K орчим', 'Хамаагүй'],
    },
  },
  {
    trigger: 'default_results',
    response: {
      id: 'ai-4',
      text: '6 буудал олсон. Хамгийн таалагдах нь Хатгалын Гэр буудал — ★ 4.7, ₮170K/шөнө. Бусад сонголтуудыг доор үзнэ үү:',
      sender: 'ai',
      hotels: MOCK_HOTELS,
    },
  },
];

const SUGGESTIONS = [
  { label: '🏔 Хөвсгөл далай', query: 'Хөвсгөл 4 хүн 3 шөнө' },
  { label: '🐪 Говь-Алтай', query: 'Говь-Алтай 2 хүн 2 шөнө' },
  { label: '⛰ Хархорин', query: 'Хархорин 2 хүн 2 шөнө' },
  { label: '🌆 Улаанбаатар', query: 'Улаанбаатар 2 хүн 1 шөнө' },
];

/* ─── typing indicator ─── */

function TypingDots() {
  const d1 = useSharedValue(0);
  const d2 = useSharedValue(0);
  const d3 = useSharedValue(0);

  useEffect(() => {
    const anim = (v: typeof d1, delay: number) => {
      v.value = withDelay(delay, withRepeat(withSequence(
        withTiming(1, { duration: 400 }), withTiming(0, { duration: 400 }),
      ), -1));
    };
    anim(d1, 0); anim(d2, 150); anim(d3, 300);
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: 0.3 + d1.value * 0.7 }));
  const s2 = useAnimatedStyle(() => ({ opacity: 0.3 + d2.value * 0.7 }));
  const s3 = useAnimatedStyle(() => ({ opacity: 0.3 + d3.value * 0.7 }));

  return (
    <View style={typingS.wrap}>
      <View style={typingS.bubble}>
        <View style={typingS.dots}>
          <Animated.View style={[typingS.dot, s1]} />
          <Animated.View style={[typingS.dot, s2]} />
          <Animated.View style={[typingS.dot, s3]} />
        </View>
      </View>
    </View>
  );
}

const typingS = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  bubble: {
    backgroundColor: colors.card, borderRadius: radius.lg, borderTopLeftRadius: 6,
    borderWidth: 0.5, borderColor: colors.border as string,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, alignSelf: 'flex-start',
  },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.primary },
});

/* ─── screen ─── */

export default function AIScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flowStep = useRef(0);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    haptic.light();
    const userMsg: AIMessage = { id: Date.now().toString(), text: text.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // AI response
    setIsTyping(true);
    const step = flowStep.current;
    const resp = AI_FLOW[step]?.response ?? AI_FLOW[1]!.response;
    flowStep.current = Math.min(step + 1, AI_FLOW.length - 1);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { ...resp, id: Date.now().toString() }]);
    }, 1200);
  }, [haptic]);

  const renderMessage = useCallback(({ item }: { item: AIMessage }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[msgS.wrap, isUser ? msgS.userWrap : msgS.aiWrap]}>
        <View style={[msgS.bubble, isUser ? msgS.userBubble : msgS.aiBubble]}>
          <Text style={[msgS.text, isUser ? msgS.userText : msgS.aiText]}>
            {item.text}
          </Text>
        </View>
        {item.hotels && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={msgS.hotelRow}>
            {item.hotels.map(h => (
              <Pressable key={h.id} style={msgS.miniCard}
                onPress={() => { haptic.light(); router.push(`/hotel/${h.id}`); }}>
                <Text style={msgS.miniName} numberOfLines={1}>{h.name}</Text>
                <Text style={msgS.miniMeta}>★ {h.avg_rating} · ₮{(h.price_min / 1000).toFixed(0)}K</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        {item.quickReplies && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={msgS.qrRow}>
            {item.quickReplies.map(q => (
              <Pressable key={q} style={msgS.qrPill} onPress={() => sendMessage(q)}>
                <Text style={msgS.qrText}>{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }, [haptic, sendMessage, router]);

  const isEmpty = messages.length === 0 && !isTyping;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <LinearGradient colors={['#5DCAA5', '#0F6E56']} style={s.headerAvatar}>
          <Sparkles size={18} color="#FFFFFF" strokeWidth={2} />
        </LinearGradient>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>iHotel AI</Text>
          <Text style={s.headerSub}>● Монгол орон даяар</Text>
        </View>
        <Pressable hitSlop={12}>
          <Settings size={20} color={colors.textSecondary} strokeWidth={2} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {isEmpty ? (
          /* Welcome state */
          <View style={s.welcome}>
            <Sparkles size={48} color={colors.primary} strokeWidth={1.5} />
            <Text style={s.welcomeTitle}>Сайн байна уу!</Text>
            <Text style={s.welcomeTitle}>Хаашаа явахаар байна?</Text>
            <View style={s.sugGrid}>
              {SUGGESTIONS.map(sug => (
                <Pressable key={sug.label} style={s.sugCard}
                  onPress={() => sendMessage(sug.query)}>
                  <Text style={s.sugText}>{sug.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={m => m.id}
            renderItem={renderMessage}
            contentContainerStyle={s.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={isTyping ? <TypingDots /> : null}
          />
        )}

        {/* Input */}
        <View style={s.inputBar}>
          <Pressable style={s.inputIcon}><Mic size={20} color={colors.textSecondary} strokeWidth={2} /></Pressable>
          <TextInput style={s.textInput} placeholder="AI-д асуух..." placeholderTextColor="#888780"
            value={input} onChangeText={setInput} multiline maxLength={500} />
          <Pressable style={[s.sendBtn, !input.trim() && s.sendBtnOff]}
            onPress={() => sendMessage(input)} disabled={!input.trim()}>
            <Send size={18} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const msgS = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  userWrap: { alignItems: 'flex-end' },
  aiWrap: { alignItems: 'flex-start' },
  bubble: { maxWidth: '85%', borderRadius: radius.lg, paddingHorizontal: spacing.lg - 2, paddingVertical: spacing.md - 2 },
  userBubble: { backgroundColor: '#04342C', borderTopRightRadius: 6 },
  aiBubble: { backgroundColor: colors.card, borderTopLeftRadius: 6, borderWidth: 0.5, borderColor: colors.border as string },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFFFFF' },
  aiText: { color: colors.textPrimary },
  hotelRow: { gap: spacing.sm, paddingTop: spacing.sm },
  miniCard: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 0.5,
    borderColor: colors.border as string, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, width: 150,
  },
  miniName: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  miniMeta: { fontSize: 11, color: colors.primary, marginTop: 2 },
  qrRow: { gap: spacing.sm, paddingTop: spacing.sm },
  qrPill: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary,
    borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  qrText: { fontSize: 13, color: colors.primary, fontWeight: fontWeights.medium as '500' },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, backgroundColor: colors.card,
    borderBottomWidth: 0.5, borderBottomColor: colors.border as string, gap: spacing.md,
  },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  headerSub: { fontSize: 11, color: colors.primary },
  welcome: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing['2xl'], gap: spacing.sm },
  welcomeTitle: { fontSize: fontSize.h2, fontWeight: fontWeights.medium as '500', color: colors.textPrimary, textAlign: 'center' },
  sugGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl, justifyContent: 'center' },
  sugCard: {
    width: '46%', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 0.5,
    borderColor: colors.border as string, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, alignItems: 'center',
  },
  sugText: { fontSize: fontSize.body, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  messageList: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, backgroundColor: colors.card,
    borderTopWidth: 0.5, borderTopColor: colors.border as string, gap: spacing.sm,
  },
  inputIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  textInput: { flex: 1, fontSize: 15, color: colors.textPrimary, maxHeight: 100, paddingVertical: spacing.sm },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { opacity: 0.4 },
});
