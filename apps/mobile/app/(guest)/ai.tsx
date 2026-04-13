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
import { Sparkles, Send, Hotel, Wallet, Users, Mountain } from 'lucide-react-native';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'ai';
};

const SUGGESTIONS = [
  { icon: Hotel, text: 'Тэрэлж орчмын хотелууд', color: '#0F6E56' },
  { icon: Wallet, text: 'Хямд зочид буудал хайх', color: '#F59E0B' },
  { icon: Users, text: 'Гэр бүлд тохиромжтой газар', color: '#4A90D9' },
  { icon: Mountain, text: 'Байгалийн үзэсгэлэнт газрууд', color: '#8B5CF6' },
];

const AI_REPLIES: Record<string, string> = {
  default:
    'Би танд туслахад бэлэн! Та аялалын газар, хотел, үнэ гэх мэт асуулт асуугаарай. Жишээ нь: "Тэрэлж орчимд хотел байна уу?" гэж асууж болно.',
  hotel:
    'Тэрэлж орчимд хэд хэдэн гайхалтай хотел байна:\n\n1. Тэрэлж Лодж — 180,000₮/шөнө, ★4.6\n2. Горхи Тэрэлж Рисорт — 350,000₮/шөнө, ★4.8\n\nДэлгэрэнгүй үзэх үү?',
  cheap:
    'Хямд сонголтуудаас:\n\n• Номад Гэстхаус — 55,000₮/шөнө\n• Алтай Гэр Кэмп — 85,000₮/шөнө\n• Говийн Гэр Кэмп — 95,000₮/шөнө\n\nАль нь таалагдаж байна?',
  family:
    'Гэр бүлд "Хустайн Рисорт" маш тохиромжтой — өргөн өрөөтэй, хүүхдийн тоглоомын талбайтай, морь унах боломжтой. ★4.7 үнэлгээтэй, 320,000₮/шөнө.',
  nature:
    'Байгалийн үзэсгэлэнт газрууд:\n\n🏔 Хөвсгөл Лодж — ★4.9, 210,000₮\n🌿 Тэрэлж Лодж — ★4.6, 180,000₮\n🐪 Говийн Гэр Кэмп — ★4.5, 95,000₮\n\nЯмар төрлийн байгаль таалагдах вэ?',
};

function getAIReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('тэрэлж') || lower.includes('хотел')) return AI_REPLIES.hotel;
  if (lower.includes('хямд') || lower.includes('cheap')) return AI_REPLIES.cheap;
  if (lower.includes('гэр бүл') || lower.includes('family') || lower.includes('тохиромжтой'))
    return AI_REPLIES.family;
  if (lower.includes('байгал') || lower.includes('үзэсгэлэнт')) return AI_REPLIES.nature;
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
  }, []);

  return (
    <View style={bs.typingRow}>
      {[dot1, dot2, dot3].map((d, i) => (
        <Animated.View key={i} style={[bs.typingDot, { opacity: d }]} />
      ))}
    </View>
  );
}

export default function AIScreen() {
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
      const userMsg: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        from: 'user',
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setTyping(true);

      setTimeout(() => {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIReply(text),
          from: 'ai',
        };
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);
      }, 1500);
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
          <View style={s.headerLeft}>
            <View style={s.aiHeaderIcon}>
              <Sparkles size={18} color="#0F6E56" strokeWidth={2} />
            </View>
            <View>
              <Text style={s.headerTitle}>AI Зөвлөх</Text>
              <View style={s.onlineRow}>
                <View style={s.onlineDot} />
                <Text style={s.headerSub}>Онлайн</Text>
              </View>
            </View>
          </View>
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
              <Text style={s.welcomeTitle}>{'Сайн байна уу! ✨'}</Text>
              <Text style={s.welcomeSub}>
                Би таны аялалын AI зөвлөх. Юу асуухыг хүсч байна?
              </Text>
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
            <View
              key={msg.id}
              style={[bs.wrap, msg.from === 'user' ? bs.userWrap : bs.aiWrap]}
            >
              {msg.from === 'ai' && (
                <View style={bs.aiMiniAvatar}>
                  <Sparkles size={12} color="#0F6E56" strokeWidth={2} />
                </View>
              )}
              <View
                style={[
                  bs.bubble,
                  msg.from === 'user' ? bs.bubbleUser : bs.bubbleAI,
                ]}
              >
                <Text
                  style={[
                    bs.bubbleText,
                    msg.from === 'user' ? bs.textUser : bs.textAI,
                  ]}
                >
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
            placeholder="Мессеж бичих..."
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
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: '#1A1A1A',
    borderBottomRightRadius: 6,
  },
  bubbleAI: {
    backgroundColor: '#E3F0FF',
    borderBottomLeftRadius: 6,
  },
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
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  headerSub: { fontSize: 11, color: '#22C55E', fontWeight: '500' },
  messagesContent: { padding: 16, paddingBottom: 8 },
  welcome: { alignItems: 'center', paddingTop: 40 },
  aiAvatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  welcomeSub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 28, paddingHorizontal: 20, lineHeight: 21 },
  sugGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 4, width: '100%' },
  sugCard: {
    width: '47%' as any,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
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
    paddingBottom: 28,
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
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  sendBtnDisabled: { opacity: 0.35 },
});
