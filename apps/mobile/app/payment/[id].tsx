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

const OPTIONS = [
  { key: 'cash', icon: '💵', label: 'Cash — буудалд очиж төлнө', sub: 'Санал · ихэнх зочин сонгодог' },
  { key: 'qpay', icon: '📱', label: 'QPay', sub: 'Банкнаас шилжүүлэх' },
  { key: 'card', icon: '💳', label: 'Картаар төлөх', sub: 'Golomt iCube' },
  { key: 'apple', icon: '📲', label: 'Apple Pay / Google Pay', sub: 'Хурдан, аюулгүй' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selected, setSelected] = useState('cash');

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <Text style={s.headerTitle}>Төлбөрийн сонголт</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={s.summaryCard}>
          <Text style={s.summaryHotel}>Хангай Resort · Suite</Text>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>2 шөнө × ₮280,000</Text>
            <Text style={s.summaryValue}>₮560,000</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Үйлчилгээний шимтгэл</Text>
            <Text style={s.summaryValue}>₮0</Text>
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
          return (
            <Pressable
              key={opt.key}
              style={[s.option, isSelected && s.optionSelected]}
              onPress={() => setSelected(opt.key)}
            >
              <View style={s.optionIcon}>
                <Text style={s.optionIconText}>{opt.icon}</Text>
              </View>
              <View style={s.optionInfo}>
                <Text style={s.optionLabel}>{opt.label}</Text>
                <Text style={s.optionSub}>{opt.sub}</Text>
              </View>
              {isSelected && (
                <View style={s.checkCircle}>
                  <Text style={s.checkText}>✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Trust card */}
        <View style={s.trustCard}>
          <Text style={s.trustIcon}>🛡️</Text>
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
          style={s.continueBtn}
          onPress={() => router.push(`/booking/${id}`)}
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
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F3F3', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: '#1A1A1A' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  scroll: { padding: 20, gap: 12 },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  summaryHotel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 14, color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F3F3F3', marginVertical: 8 },
  summaryTotal: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  summaryTotalValue: { fontSize: 16, fontWeight: '700', color: '#0F6E56' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: { borderColor: '#0F6E56', backgroundColor: '#F0FBF7' },
  optionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F3F3', alignItems: 'center', justifyContent: 'center' },
  optionIconText: { fontSize: 20 },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  optionSub: { fontSize: 12, color: '#888', marginTop: 1 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 14, color: '#FFF', fontWeight: '700' },
  trustCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  trustIcon: { fontSize: 20 },
  trustContent: { flex: 1 },
  trustTitle: { fontSize: 13, fontWeight: '600', color: '#04342C', marginBottom: 2 },
  trustText: { fontSize: 12, color: '#04342C', lineHeight: 18 },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  continueBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  continueBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
