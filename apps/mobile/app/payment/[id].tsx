import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Check,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, fontWeights, fontSize, spacing, radius } from '@ihotel/config';
import { Button, useHaptic } from '@ihotel/ui';

/* ─── payment options ─── */

interface PayOption {
  key: string;
  label: string;
  subtitle: string;
  Icon: typeof Banknote;
  iconBg: string;
  iconColor: string;
}

const OPTIONS: PayOption[] = [
  {
    key: 'cash', label: 'Cash — буудалд очиж төлнө',
    subtitle: 'Санал · ихэнх зочин сонгодог',
    Icon: Banknote, iconBg: '#E1F5EE', iconColor: colors.primary,
  },
  {
    key: 'qpay', label: 'QPay',
    subtitle: 'Банкнаас шилжүүлэх',
    Icon: Smartphone, iconBg: '#DBEAFE', iconColor: '#3B82F6',
  },
  {
    key: 'card', label: 'Картаар төлөх',
    subtitle: 'Golomt iCube',
    Icon: CreditCard, iconBg: '#F3E8FF', iconColor: '#8B5CF6',
  },
  {
    key: 'apple', label: 'Хурдан, аюулгүй',
    subtitle: 'Apple Pay / Google Pay',
    Icon: Smartphone, iconBg: colors.textPrimary, iconColor: '#FFFFFF',
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const haptic = useHaptic();
  const [selected, setSelected] = useState('cash');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text style={s.headerTitle}>Төлбөрийн сонголт</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
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

        {/* Options */}
        {OPTIONS.map(opt => {
          const isSelected = selected === opt.key;
          return (
            <Pressable key={opt.key}
              style={[s.option, isSelected && s.optionSelected]}
              onPress={() => { haptic.light(); setSelected(opt.key); }}>
              <View style={[s.optionIcon, { backgroundColor: opt.iconBg }]}>
                <opt.Icon size={20} color={opt.iconColor} strokeWidth={2} />
              </View>
              <View style={s.optionInfo}>
                <Text style={s.optionLabel}>{opt.label}</Text>
                <Text style={s.optionSub}>{opt.subtitle}</Text>
              </View>
              {isSelected && (
                <View style={s.checkCircle}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Trust */}
        <View style={s.trustCard}>
          <ShieldCheck size={20} color="#04342C" strokeWidth={2} />
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
        <Button title="Үргэлжлүүлэх"
          onPress={() => { haptic.medium(); router.push(`/booking/${id}`); }} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border as string,
  },
  headerTitle: { fontSize: fontSize.h3, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  scroll: { padding: spacing.lg + 4, gap: spacing.md },

  /* summary */
  summaryCard: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg,
    borderWidth: 0.5, borderColor: colors.border as string,
  },
  summaryHotel: { fontSize: 15, fontWeight: fontWeights.medium as '500', color: colors.textPrimary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  summaryLabel: { fontSize: fontSize.body, color: colors.textSecondary },
  summaryValue: { fontSize: fontSize.body, color: colors.textPrimary },
  divider: { height: 0.5, backgroundColor: colors.border as string, marginVertical: spacing.sm },
  summaryTotal: { fontSize: 15, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  summaryTotalValue: { fontSize: 16, fontWeight: fontWeights.medium as '500', color: colors.primary },

  /* options */
  option: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg - 2,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#F0FBF7' },
  optionIcon: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: fontSize.body, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  optionSub: { fontSize: fontSize.caption, color: colors.textSecondary, marginTop: 1 },
  checkCircle: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  /* trust */
  trustCard: {
    flexDirection: 'row', gap: spacing.md, backgroundColor: '#E1F5EE',
    borderRadius: radius.md, padding: spacing.lg - 2, marginTop: spacing.sm,
  },
  trustContent: { flex: 1 },
  trustTitle: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: '#04342C', marginBottom: spacing.xs },
  trustText: { fontSize: fontSize.caption, color: '#04342C', lineHeight: 18 },

  /* bottom */
  bottom: {
    paddingHorizontal: spacing.lg + 4, paddingVertical: spacing.md,
    backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.border as string,
  },
});
