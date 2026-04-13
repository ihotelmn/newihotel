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
} from 'react-native';
import { useRouter } from 'expo-router';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'ai';
};

const SUGGESTIONS = [
  { icon: '🏨', text: 'Тэрэлж орчмын хотелууд' },
  { icon: '💰', text: 'Хямд зочид буудал хайх' },
  { icon: '👨‍👩‍👧‍👦', text: 'Гэр бүлд тохиромжтой газар' },
  { icon: '🌄', text: 'Байгалийн үзэсгэлэнт газрууд' },
];

const AI_REPLIES: Record<string, string> = {
  default:
    'Би танд туслахад бэлэн! Та аялалын газар, хотел, үнэ гэх мэт асуулт асуугаарай.',
  hotel:
    'Тэрэлж орчимд хэд хэдэн гайхалтай хотел байна. "Тэрэлж Лодж" нь 180,000₮-оос эхэлдэг бөгөөд байгалийн үзэсгэлэнт газар байрладаг. Дэлгэрэнгүй үзэх үү?',
  cheap:
    'Хямд сонголтуудаас "Номад Гэстхаус" 55,000₮/шөнө, "Алтай Гэр Кэмп" 85,000₮/шөнө зэрэг байна. Аль нь таалагдаж байна?',
  family:
    'Гэр бүлд "Хустайн Рисорт" маш тохиромжтой — өргөн өрөөтэй, хүүхдийн тоглоомын талбайтай, морь унах боломжтой. 320,000₮/шөнө.',
  nature:
    'Хөвсгөл нуур, Тэрэлж, Горхи-Тэрэлж зэрэг газрууд байгалийн үзэсгэлэнтэй. Хөвсгөл Лодж ★4.9 үнэлгээтэй, 210,000₮/шөнө.',
};

function getAIReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('тэрэлж') || lower.includes('хотел')) return AI_REPLIES.hotel;
  if (lower.includes('хямд') || lower.includes('cheap')) return AI_REPLIES.cheap;
  if (lower.includes('гэр бүл') || lower.includes('family') || lower.includes('тохиромжтой')) return AI_REPLIES.family;
  if (lower.includes('байгал') || lower.includes('үзэсгэлэнт')) return AI_REPLIES.nature;
  return AI_REPLIES.default;
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
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backText}>←</Text>
          </Pressable>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>AI Зөвлөх</Text>
            <Text style={s.headerSub}>Онлайн</Text>
          </View>
          <View style={s.headerRight} />
        </View>

        <ScrollView
          ref={scrollRef}
          style={s.flex}
          contentContainerStyle={s.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {showWelcome && (
            <View style={s.welcome}>
              <View style={s.aiAvatar}>
                <Text style={s.aiAvatarText}>✨</Text>
              </View>
              <Text style={s.welcomeTitle}>Сайн байна уу!</Text>
              <Text style={s.welcomeSub}>
                Би таны аялалын AI зөвлөх. Юу асуухыг хүсч байна?
              </Text>
              <View style={s.sugGrid}>
                {SUGGESTIONS.map((sug, i) => (
                  <Pressable
                    key={i}
                    style={s.sugCard}
                    onPress={() => sendMessage(sug.text)}
                  >
                    <Text style={s.sugIcon}>{sug.icon}</Text>
                    <Text style={s.sugText}>{sug.text}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                s.bubble,
                msg.from === 'user' ? s.bubbleUser : s.bubbleAI,
              ]}
            >
              <Text
                style={[
                  s.bubbleText,
                  msg.from === 'user' ? s.bubbleTextUser : s.bubbleTextAI,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          ))}

          {typing && (
            <View style={[s.bubble, s.bubbleAI]}>
              <Text style={s.typingDots}>...</Text>
            </View>
          )}
        </ScrollView>

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
            <Text style={s.sendText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F3F3', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: '#1A1A1A' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  headerSub: { fontSize: 11, color: '#0F6E56', marginTop: 1 },
  headerRight: { width: 36 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  welcome: { alignItems: 'center', paddingTop: 30 },
  aiAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  aiAvatarText: { fontSize: 28 },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  welcomeSub: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 24, paddingHorizontal: 20 },
  sugGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 4 },
  sugCard: {
    width: '47%' as any,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  sugIcon: { fontSize: 24, marginBottom: 8 },
  sugText: { fontSize: 13, fontWeight: '500', color: '#1A1A1A' },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
  },
  bubbleUser: {
    backgroundColor: '#1A1A1A',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#E3F0FF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTextUser: { color: '#FFF' },
  bubbleTextAI: { color: '#1A1A1A' },
  typingDots: { fontSize: 22, color: '#666', letterSpacing: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#1A1A1A',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendText: { fontSize: 18, color: '#FFF' },
});
