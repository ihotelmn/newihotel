import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import {
  ArrowLeft,
  Phone,
  Mic,
  Send,
  MoreHorizontal,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fontWeights, spacing, radius, animation, easing } from '@ihotel/config';
import { useHaptic } from '@ihotel/ui';

/* ─── types ─── */

interface ChatMessage {
  id: string;
  text: string;
  sender: 'host' | 'user';
  time: string;
}

/* ─── mock data ─── */

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    text: 'Сайн байна уу! Хангай Resort-д тавтай морилно уу. Би Дэлгэрмаа, танд юугаар туслах вэ?',
    sender: 'host',
    time: '14:20',
  },
  {
    id: '2',
    text: '4-р сарын 20-22 хоёр шөнө, 2 хүний өрөө бий юу?',
    sender: 'user',
    time: '14:22',
  },
  {
    id: '3',
    text: 'Тийм бий шүү! Deluxe өрөө ₮280,000/шөнө байна. Өглөөний цай орсон үнэ.',
    sender: 'host',
    time: '14:23',
  },
];

const QUICK_REPLIES = [
  'Үнэ бууруулж болох уу?',
  'Зогсоол бий юу?',
  'Check-in хэдэн цагт вэ?',
];

const HOST_REPLIES = [
  'Мэдээж! Тэр өрөө маш тав тухтай, цонхоор нь уулын харагдац гоё.',
  'Нэмэлт мэдээлэл хэрэгтэй бол чөлөөтэй асууна уу!',
  'Бид таныг хүлээж байна 😊',
];

/* ─── typing indicator ─── */

function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 400 }),
      ),
      -1,
    );
    dot2.value = withDelay(
      150,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      ),
    );
    dot3.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
      ),
    );
  }, []);

  const s1 = useAnimatedStyle(() => ({ opacity: 0.3 + dot1.value * 0.7 }));
  const s2 = useAnimatedStyle(() => ({ opacity: 0.3 + dot2.value * 0.7 }));
  const s3 = useAnimatedStyle(() => ({ opacity: 0.3 + dot3.value * 0.7 }));

  return (
    <View style={typingStyles.wrap}>
      <View style={typingStyles.bubble}>
        <View style={typingStyles.dots}>
          <Animated.View style={[typingStyles.dot, s1]} />
          <Animated.View style={[typingStyles.dot, s2]} />
          <Animated.View style={[typingStyles.dot, s3]} />
        </View>
      </View>
      <Text style={typingStyles.label}>Дэлгэрмаа бичиж байна...</Text>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  bubble: {
    backgroundColor: '#E6F1FB',
    borderRadius: radius.lg,
    borderTopLeftRadius: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignSelf: 'flex-start',
  },
  dots: { flexDirection: 'row', gap: 4 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#7AAFDB',
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

/* ─── message bubble ─── */

function MessageBubble({ message }: { message: ChatMessage }) {
  const isHost = message.sender === 'host';
  return (
    <View
      style={[
        bubbleStyles.wrap,
        isHost ? bubbleStyles.hostWrap : bubbleStyles.userWrap,
      ]}
    >
      <View
        style={[
          bubbleStyles.bubble,
          isHost ? bubbleStyles.hostBubble : bubbleStyles.userBubble,
        ]}
      >
        <Text
          style={[
            bubbleStyles.text,
            isHost ? bubbleStyles.hostText : bubbleStyles.userText,
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text
        style={[
          bubbleStyles.time,
          isHost ? bubbleStyles.hostTime : bubbleStyles.userTime,
        ]}
      >
        {message.time}
      </Text>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  hostWrap: { alignItems: 'flex-start' },
  userWrap: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.md - 2,
  },
  hostBubble: {
    backgroundColor: '#E6F1FB',
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: '#04342C',
    borderTopRightRadius: 6,
  },
  text: { fontSize: 15, lineHeight: 22 },
  hostText: { color: colors.textPrimary },
  userText: { color: '#FFFFFF' },
  time: { fontSize: 10, marginTop: 3 },
  hostTime: { color: colors.textSecondary },
  userTime: { color: colors.textSecondary },
});

/* ─── chat screen ─── */

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const haptic = useHaptic();
  const listRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const replyIndex = useRef(0);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      haptic.light();

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        time: new Date().toLocaleTimeString('mn-MN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      // simulate host typing then reply
      setTimeout(() => setIsTyping(true), 800);
      setTimeout(() => {
        setIsTyping(false);
        const reply =
          HOST_REPLIES[replyIndex.current % HOST_REPLIES.length] ?? '';
        replyIndex.current += 1;
        const hostMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: reply,
          sender: 'host',
          time: new Date().toLocaleTimeString('mn-MN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages((prev) => [...prev, hostMsg]);
      }, 2300);
    },
    [haptic],
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>

        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>ДМ</Text>
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Дэлгэрмаа · Хост</Text>
          <Text style={styles.headerStatus}>Online · 10 мин хариулна</Text>
        </View>

        <Pressable
          onPress={() => router.push(`/call/${id}`)}
          hitSlop={12}
        >
          <Phone size={20} color={colors.primary} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Date separator */}
      <View style={styles.dateSep}>
        <Text style={styles.dateSepText}>Өнөөдөр</Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Quick replies */}
        {messages.length <= 4 && (
          <View style={styles.quickRow}>
            {QUICK_REPLIES.map((q) => (
              <Pressable
                key={q}
                style={styles.quickChip}
                onPress={() => sendMessage(q)}
              >
                <Text style={styles.quickText}>{q}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <Pressable style={styles.inputIcon}>
            <Mic size={20} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>
          <TextInput
            style={styles.textInput}
            placeholder="Мессеж бичих..."
            placeholderTextColor="#888780"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Send size={18} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border as string,
    gap: spacing.md,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerAvatarText: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: colors.card,
  },
  headerInfo: { flex: 1 },
  headerName: {
    fontSize: 15,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  headerStatus: {
    fontSize: 11,
    color: '#22C55E',
  },

  /* date */
  dateSep: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  dateSepText: {
    fontSize: 11,
    color: colors.textSecondary,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  /* messages */
  messageList: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },

  /* quick replies */
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  quickChip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  quickText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: fontWeights.medium as '500',
  },

  /* input */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 0.5,
    borderTopColor: colors.border as string,
    gap: spacing.sm,
  },
  inputIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingVertical: spacing.sm,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
