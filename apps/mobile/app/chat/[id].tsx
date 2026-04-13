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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  'Бид таныг хүлээж байна!',
];

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
      <View style={[bs.wrap, isHost ? bs.hostWrap : bs.userWrap]}>
        <View style={[bs.bubble, isHost ? bs.hostBubble : bs.userBubble]}>
          <Text style={[bs.text, isHost ? bs.hostText : bs.userText]}>{item.text}</Text>
        </View>
        <Text style={bs.time}>{item.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>ДМ</Text>
          <View style={s.onlineDot} />
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>Дэлгэрмаа · Хост</Text>
          <Text style={s.headerStatus}>Online · 10 мин хариулна</Text>
        </View>
        <Pressable onPress={() => router.push(`/call/${id}`)}>
          <Text style={s.phoneIcon}>📞</Text>
        </Pressable>
      </View>

      {/* Date separator */}
      <View style={s.dateSep}>
        <Text style={s.dateSepText}>Өнөөдөр</Text>
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
          ListFooterComponent={
            isTyping ? (
              <View style={[bs.wrap, bs.hostWrap]}>
                <View style={[bs.bubble, bs.hostBubble]}>
                  <Text style={bs.typingDots}>...</Text>
                </View>
                <Text style={bs.typingLabel}>Дэлгэрмаа бичиж байна...</Text>
              </View>
            ) : null
          }
        />

        {/* Quick replies */}
        {messages.length <= 4 && (
          <View style={s.quickRow}>
            {QUICK_REPLIES.map((q) => (
              <Pressable key={q} style={s.quickChip} onPress={() => sendMessage(q)}>
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
            <Text style={s.sendText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const bs = StyleSheet.create({
  wrap: { paddingHorizontal: 16, marginBottom: 8 },
  hostWrap: { alignItems: 'flex-start' },
  userWrap: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  hostBubble: { backgroundColor: '#E3F0FF', borderBottomLeftRadius: 4 },
  userBubble: { backgroundColor: '#1A1A1A', borderBottomRightRadius: 4 },
  text: { fontSize: 15, lineHeight: 22 },
  hostText: { color: '#1A1A1A' },
  userText: { color: '#FFF' },
  time: { fontSize: 10, color: '#999', marginTop: 3 },
  typingDots: { fontSize: 22, color: '#666', letterSpacing: 4 },
  typingLabel: { fontSize: 11, color: '#999', marginTop: 2 },
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
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F3F3', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: '#1A1A1A' },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  headerStatus: { fontSize: 11, color: '#22C55E' },
  phoneIcon: { fontSize: 20 },
  dateSep: { alignItems: 'center', paddingVertical: 10 },
  dateSepText: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  messageList: { paddingTop: 8, paddingBottom: 8 },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickChip: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#0F6E56',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickText: { fontSize: 13, color: '#0F6E56', fontWeight: '500' },
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
