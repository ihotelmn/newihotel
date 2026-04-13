import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Banknote,
  Smartphone,
  CreditCard,
  Wallet,
  Check,
  ShieldCheck,
} from 'lucide-react-native';

const OPTIONS = [
  { key: 'cash', icon: Banknote, label: 'Cash — буудалд очиж төлнө', sub: 'Санал · ихэнх зочин сонгодог', color: '#0F6E56' },
  { key: 'qpay', icon: Smartphone, label: 'QPay', sub: 'Банкнаас шилжүүлэх', color: '#4A90D9' },
  { key: 'card', icon: CreditCard, label: 'Картаар төлөх', sub: 'Golomt iCube', color: '#F59E0B' },
  { key: 'apple', icon: Wallet, label: 'Apple Pay / Google Pay', sub: 'Хурдан, аюулгүй', color: '#1A1A1A' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selected, setSelected] = useState('cash');

  const handleSelect = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(key);
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
        <Text style={s.headerTitle}>Төлбөрийн сонголт</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={s.summaryCard}>
          <Text style={s.summaryHotel}>Хангай Resort · Suite</Text>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>2 шөнө x ₮280,000</Text>
            <Text style={s.summaryValue}>₮560,000</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Үйлчилгээний шимтгэл</Text>
            <Text style={s.summaryValueFree}>ҮНЭГҮЙ</Text>
          </View>
          <View style={s.divider} />
          <View style={s.summaryRow}>
            <Text style={s.summaryTotal}>Нийт</Text>
            <Text style={s.summaryTotalValue}>₮560,000</Text>
          </View>
        </View>

        {/* Payment options */}
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.key;
          const Icon = opt.icon;
          return (
            <Pressable
              key={opt.key}
              style={[s.option, isSelected && s.optionSelected]}
              onPress={() => handleSelect(opt.key)}
            >
              <View style={[s.optionIconWrap, { backgroundColor: opt.color + '12' }]}>
                <Icon size={22} color={opt.color} strokeWidth={1.8} />
              </View>
              <View style={s.optionInfo}>
                <Text style={s.optionLabel}>{opt.label}</Text>
                <Text style={s.optionSub}>{opt.sub}</Text>
              </View>
              {isSelected && (
                <View style={s.checkCircle}>
                  <Check size={14} color="#FFF" strokeWidth={2.5} />
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Trust card */}
        <View style={s.trustCard}>
          <ShieldCheck size={20} color="#0F6E56" strokeWidth={2} />
          <View style={s.trustContent}>
            <Text style={s.trustTitle}>Хамгаалалт</Text>
            <Text style={s.trustText}>
              Асуудал гарвал iHotel зуучилна. Буудал цуцалбал бүрэн буцаалт.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottom}>
        <Pressable
          style={({ pressed }) => [s.continueBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push(`/booking/${id}`);
          }}
        >
          <Text style={s.continueBtnText}>Үргэлжлүүлэх</Text>
        </Pressable>
      </View>
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
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  scroll: { padding: 20, gap: 12 },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryHotel: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, color: '#1A1A1A' },
  summaryValueFree: { fontSize: 12, color: '#0F6E56', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F3F3F3', marginVertical: 10 },
  summaryTotal: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  summaryTotalValue: { fontSize: 18, fontWeight: '700', color: '#0F6E56' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  optionSelected: { borderColor: '#0F6E56', backgroundColor: '#F0FBF7' },
  optionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  optionSub: { fontSize: 12, color: '#888', marginTop: 2 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  trustCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
  },
  trustContent: { flex: 1 },
  trustTitle: { fontSize: 14, fontWeight: '600', color: '#04342C', marginBottom: 3 },
  trustText: { fontSize: 12, color: '#04342C', lineHeight: 18, opacity: 0.8 },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 34,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  continueBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
