import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Phone, Calendar, Users, Wallet, Sparkles, Send, Star } from 'lucide-react-native';

const LEADS_DATA: Record<string, {
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  budget: string;
  guestCount: string;
  visits: number;
  rating: number;
  aiContext: string;
  chatMessages: { from: 'guest' | 'hotel'; text: string }[];
}> = {
  '1': {
    guestName: 'Батбаяр Д.',
    phone: '9911-2233',
    checkIn: '2024/04/18',
    checkOut: '2024/04/20',
    roomType: 'Deluxe',
    budget: '₮280,000',
    guestCount: '2 том, 1 хүүхэд',
    visits: 0,
    rating: 0,
    aiContext: 'Зочин гэр бүлийн аялал хийж байна. Хүүхэдтэй тул хүүхдийн ор, өглөөний цай чухал. Wi-Fi шаардлагатай.',
    chatMessages: [
      { from: 'guest', text: 'Сайн байна уу, Deluxe өрөө сул байна уу?' },
    ],
  },
  '2': {
    guestName: 'Сарантуяа М.',
    phone: '8800-1122',
    checkIn: '2024/04/19',
    checkOut: '2024/04/21',
    roomType: 'Standard',
    budget: '₮150,000',
    guestCount: '1 том',
    visits: 1,
    rating: 4.2,
    aiContext: 'Бизнес аялагч. Өмнө нь 1 удаа ирсэн, Standard өрөөнд байрласан. Wi-Fi хурд, ажлын ширээ чухал.',
    chatMessages: [
      { from: 'guest', text: 'Standard өрөөний үнэ хэд вэ?' },
      { from: 'hotel', text: 'Сайн байна уу! Standard өрөө ₮150,000/шөнө. Чөлөөт өрөө байна.' },
    ],
  },
  '3': {
    guestName: 'Энхбат Т.',
    phone: '9955-4466',
    checkIn: '2024/04/20',
    checkOut: '2024/04/23',
    roomType: 'Suite',
    budget: '₮450,000',
    guestCount: '2 том',
    visits: 3,
    rating: 4.8,
    aiContext: 'VIP зочин, 3 удаа ирсэн. Сүүлд Suite-д байрласан. Spa, ресторан захиалга хийдэг. Онцгой анхаарал хандуулах.',
    chatMessages: [
      { from: 'guest', text: 'Suite өрөөнд яг ижилхэн байрших боломжтой юу?' },
    ],
  },
};

export default function LeadDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reply, setReply] = useState('');

  const lead = LEADS_DATA[id ?? '1'] ?? LEADS_DATA['1'];

  const handleApprove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Захиалга зөвшөөрөгдлөө', `${lead.guestName}-н захиалга амжилттай.`);
  };

  const handleSuggest = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Өрөө санал болгох', 'Зочинд тохирох өрөөний сонголт илгээх үү?');
  };

  const handleDecline = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Татгалзах', 'Та энэ захиалгыг татгалзах уу?', [
      { text: 'Үгүй' },
      { text: 'Тийм', style: 'destructive' },
    ]);
  };

  const handleSend = () => {
    if (!reply.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Илгээгдлээ', reply.trim());
    setReply('');
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
      {/* Header */}
      <View style={s.header}>
        <Pressable
          style={s.backBtn}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <ArrowLeft size={22} color="#1A1A1A" strokeWidth={2} />
        </Pressable>
        <Text style={s.headerTitle}>Лийд дэлгэрэнгүй</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Guest Reputation */}
        <View style={s.guestSection}>
          <View style={s.guestAvatar}>
            <Text style={s.guestInitials}>{lead.guestName.slice(0, 1)}</Text>
          </View>
          <Text style={s.guestName}>{lead.guestName}</Text>
          <View style={s.phoneRow}>
            <Phone size={14} color="#888" strokeWidth={2} />
            <Text style={s.guestPhone}>{lead.phone}</Text>
          </View>
          {lead.visits > 0 ? (
            <View style={s.repRow}>
              <Text style={s.repText}>{lead.visits} удаа ирсэн</Text>
              <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
              <Text style={s.repRating}>{lead.rating}</Text>
            </View>
          ) : (
            <Text style={s.newGuest}>Шинэ зочин</Text>
          )}
        </View>

        {/* AI Context */}
        <View style={s.aiCard}>
          <View style={s.aiHeader}>
            <Sparkles size={16} color="#0F6E56" strokeWidth={2} />
            <Text style={s.aiTitle}>AI Context</Text>
          </View>
          <Text style={s.aiText}>{lead.aiContext}</Text>
        </View>

        {/* Booking Details */}
        <View style={s.detailCard}>
          <Text style={s.detailTitle}>Захиалгын мэдээлэл</Text>
          <View style={s.detailRow}>
            <Calendar size={14} color="#888" strokeWidth={2} />
            <Text style={s.detailLabel}>Огноо:</Text>
            <Text style={s.detailValue}>{lead.checkIn} - {lead.checkOut}</Text>
          </View>
          <View style={s.detailRow}>
            <Users size={14} color="#888" strokeWidth={2} />
            <Text style={s.detailLabel}>Зочид:</Text>
            <Text style={s.detailValue}>{lead.guestCount}</Text>
          </View>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Өрөө:</Text>
            <Text style={s.detailValue}>{lead.roomType}</Text>
          </View>
          <View style={s.detailRow}>
            <Wallet size={14} color="#888" strokeWidth={2} />
            <Text style={s.detailLabel}>Төсөв:</Text>
            <Text style={[s.detailValue, { color: '#0F6E56', fontWeight: '500' }]}>{lead.budget}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.actionRow}>
          <Pressable
            style={({ pressed }) => [s.actionBtn, s.approveBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
            onPress={handleApprove}
          >
            <Text style={s.approveBtnText}>Зөвшөөрөх</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.actionBtn, s.suggestBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
            onPress={handleSuggest}
          >
            <Text style={s.suggestBtnText}>Өрөө санал болгох</Text>
          </Pressable>
        </View>
        <Pressable
          style={({ pressed }) => [s.declineBtn, pressed && { backgroundColor: '#FFF5F5' }]}
          onPress={handleDecline}
        >
          <Text style={s.declineBtnText}>Татгалзах</Text>
        </Pressable>

        {/* Chat Preview */}
        <View style={s.chatSection}>
          <Text style={s.chatTitle}>Чат</Text>
          {lead.chatMessages.map((msg, i) => (
            <View
              key={i}
              style={[s.chatBubble, msg.from === 'hotel' ? s.chatHotel : s.chatGuest]}
            >
              <Text style={[s.chatText, msg.from === 'hotel' ? s.chatTextHotel : s.chatTextGuest]}>
                {msg.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Reply */}
        <View style={s.replyBar}>
          <TextInput
            style={s.replyInput}
            placeholder="Хариу бичих..."
            placeholderTextColor="#999"
            value={reply}
            onChangeText={setReply}
          />
          <Pressable
            style={[s.sendBtn, !reply.trim() && { opacity: 0.35 }]}
            onPress={handleSend}
            disabled={!reply.trim()}
          >
            <Send size={18} color="#FFF" strokeWidth={2} />
          </Pressable>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
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
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  scroll: { paddingHorizontal: 20 },
  guestSection: { alignItems: 'center', paddingTop: 24, paddingBottom: 20 },
  guestAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  guestInitials: { fontSize: 24, fontWeight: '500', color: '#FFF' },
  guestName: { fontSize: 20, fontWeight: '500', color: '#1A1A1A', marginBottom: 4 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  guestPhone: { fontSize: 14, color: '#888' },
  repRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  repText: { fontSize: 13, color: '#888' },
  repRating: { fontSize: 13, fontWeight: '500', color: '#F59E0B' },
  newGuest: { fontSize: 13, color: '#0F6E56', marginTop: 6, fontWeight: '500' },
  aiCard: {
    backgroundColor: '#E8F5F1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  aiTitle: { fontSize: 14, fontWeight: '500', color: '#0F6E56' },
  aiText: { fontSize: 14, color: '#1A1A1A', lineHeight: 21 },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  detailTitle: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  detailLabel: { fontSize: 13, color: '#888', width: 60 },
  detailValue: { fontSize: 14, color: '#1A1A1A', flex: 1 },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  actionBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  approveBtn: {
    backgroundColor: '#0F6E56',
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  approveBtnText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
  suggestBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#0F6E56' },
  suggestBtnText: { fontSize: 15, fontWeight: '500', color: '#0F6E56' },
  declineBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F5E5E5',
    backgroundColor: '#FFF',
    marginBottom: 24,
  },
  declineBtnText: { fontSize: 15, fontWeight: '500', color: '#E24B4A' },
  chatSection: { marginBottom: 16 },
  chatTitle: { fontSize: 15, fontWeight: '500', color: '#1A1A1A', marginBottom: 10 },
  chatBubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8 },
  chatGuest: { backgroundColor: '#F3F3F3', alignSelf: 'flex-start', borderBottomLeftRadius: 6 },
  chatHotel: { backgroundColor: '#E3F0FF', alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  chatText: { fontSize: 14, lineHeight: 20 },
  chatTextGuest: { color: '#1A1A1A' },
  chatTextHotel: { color: '#1A1A1A' },
  replyBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  replyInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
