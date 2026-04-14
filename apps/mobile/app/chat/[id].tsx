import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Phone, Send } from 'lucide-react-native';

type ChatMessage = {
  id: string;
  text: string;
  sender: 'host' | 'user';
  time: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', text: 'Сайн байна уу! Тавтай морилно уу. Би Дэлгэрмаа, танд юугаар туслах вэ?', sender: 'host', time: '14:20' },
  { id: '2', text: '4-р сарын 20-22 хоёр шөнө, 2 хүний өрөө бий юу?', sender: 'user', time: '14:22' },
  { id: '3', text: 'Тийм бий шүү! Deluxe өрөө ₮280,000/шөнө байна. Өглөөний цай орсон үнэ.', sender: 'host', time: '14:23' },
];

const QUICK_REPLIES = [
  'Үнэ бууруулж болох уу?',
  'Зогсоол бий юу?',
  'Check-in хэдэн цагт вэ?',
];

const HOST_REPLIES = [
  'Мэдээж! Тэр өрөө маш тав тухтай, цонхоор нь уулын харагдац гоё.',
  'Нэмэлт мэдээлэл хэрэгтэй бол чөлөөтэй асууна уу!',
  'Бид таныг хүлээж байна! Check-in 14:00-оос, check-out 12:00 хүртэл.',
  'Тийм, зогсоол үнэгүй. Машины дугаараа ирэхээсээ өмнө илгээнэ үү.',
];

function TypingDots() {
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
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  return (
    <View style={ms.typingRow}>
      {[dot1, dot2, dot3].map((d, i) => (
        <Animated.View key={i} style={[ms.typingDot, { opacity: d }]} />
      ))}
    </View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const replyIndex = useRef(0);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        time: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      setTimeout(() => setIsTyping(true), 600);
      setTimeout(() => {
        setIsTyping(false);
        const reply = HOST_REPLIES[replyIndex.current % HOST_REPLIES.length] ?? '';
        replyIndex.current += 1;
        const hostMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: reply,
          sender: 'host',
          time: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, hostMsg]);
      }, 1500);
    },
    [],
  );

  useEffect(() => {
    if (listRef.current) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isHost = item.sender === 'host';
    return (
      <View style={[ms.wrap, isHost ? ms.hostWrap : ms.userWrap]}>
        {isHost && (
          <View style={ms.hostMiniAvatar}>
            <Text style={ms.hostMiniAvatarText}>ДМ</Text>
          </View>
        )}
        <View style={[ms.bubble, isHost ? ms.hostBubble : ms.userBubble]}>
          <Text style={[ms.text, isHost ? ms.hostText : ms.userText]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#1A1A1A" strokeWidth={2.2} />
        </Pressable>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>ДМ</Text>
          <View style={s.onlineDot} />
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>Дэлгэрмаа</Text>
          <Text style={s.headerStatus}>Online</Text>
        </View>
        <Pressable
          style={({ pressed }) => [s.phoneBtn, pressed && { opacity: 0.7 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/call/${id}`);
          }}
        >
          <Phone size={20} color="#0F6E56" strokeWidth={2} />
        </Pressable>
      </View>

      {/* Date separator */}
      <View style={s.dateSep}>
        <View style={s.dateSepLine} />
        <Text style={s.dateSepText}>Өнөөдөр</Text>
        <View style={s.dateSepLine} />
      </View>

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={s.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={[ms.wrap, ms.hostWrap]}>
                <View style={ms.hostMiniAvatar}>
                  <Text style={ms.hostMiniAvatarText}>ДМ</Text>
                </View>
                <View style={[ms.bubble, ms.hostBubble]}>
                  <TypingDots />
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick replies */}
        {messages.length <= 4 && (
          <View style={s.quickRow}>
            {QUICK_REPLIES.map((q) => (
              <Pressable
                key={q}
                style={({ pressed }) => [s.quickChip, pressed && { backgroundColor: '#E8F5E9' }]}
                onPress={() => sendMessage(q)}
              >
                <Text style={s.quickText}>{q}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input bar */}
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

const ms = StyleSheet.create({
  wrap: { paddingHorizontal: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  hostWrap: { justifyContent: 'flex-start' },
  userWrap: { justifyContent: 'flex-end' },
  hostMiniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  hostMiniAvatarText: { fontSize: 10, fontWeight: '500', color: '#FFF' },
  bubble: { maxWidth: '78%', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 11 },
  hostBubble: { backgroundColor: '#E3F0FF', borderBottomLeftRadius: 6 },
  userBubble: { backgroundColor: '#1A1A1A', borderBottomRightRadius: 6 },
  text: { fontSize: 15, lineHeight: 22 },
  hostText: { color: '#1A1A1A' },
  userText: { color: '#FFF' },
  typingRow: { flexDirection: 'row', gap: 4, paddingVertical: 4, paddingHorizontal: 2 },
  typingDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#4A90D9' },
});

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
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 14, fontWeight: '500', color: '#FFF' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  headerStatus: { fontSize: 11, color: '#22C55E', fontWeight: '500', marginTop: 1 },
  phoneBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSep: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  dateSepLine: { flex: 1, height: 1, backgroundColor: '#EDEDED' },
  dateSepText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  messageList: { paddingTop: 8, paddingBottom: 8 },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  quickChip: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#0F6E56',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  quickText: { fontSize: 13, color: '#0F6E56', fontWeight: '500' },
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
