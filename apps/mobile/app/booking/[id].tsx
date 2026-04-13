import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SUMMARY_ROWS = [
  { label: 'Буудал', value: 'Хангай Resort' },
  { label: 'Огноо', value: '4-р сарын 20 — 22 (2 шөнө)' },
  { label: 'Өрөө', value: 'Deluxe · 2 том хүн' },
  { label: 'Захиалгын №', value: 'IH-20260420-0381' },
  { label: 'Нийт', value: '₮560,000' },
];

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={s.container}>
      <SafeAreaView style={s.safe}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Checkmark */}
          <View style={s.checkWrap}>
            <View style={s.checkCircle}>
              <Text style={s.checkText}>✓</Text>
            </View>
          </View>

          <Text style={s.title}>Захиалга амжилттай</Text>
          <Text style={s.subtitle}>
            Хост Дэлгэрмаа захиалгыг баталгаажуулав.
          </Text>
          <Text style={s.loyalty}>+50 loyalty оноо авсан</Text>

          {/* Booking Summary */}
          <View style={s.card}>
            {SUMMARY_ROWS.map((row, i) => (
              <View key={i} style={s.summaryRow}>
                <Text style={s.summaryLabel}>{row.label}</Text>
                <Text
                  style={[
                    s.summaryValue,
                    i === SUMMARY_ROWS.length - 1 && s.summaryValueBold,
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Payment hint */}
          <View style={s.paymentHint}>
            <Text style={s.paymentText}>
              💳 Буудалд очиж cash төлнө
            </Text>
          </View>

          {/* Buttons */}
          <Pressable
            style={s.primaryBtn}
            onPress={() => router.replace('/(guest)/trips')}
          >
            <Text style={s.primaryBtnText}>Аялал үзэх</Text>
          </Pressable>
          <Pressable
            style={s.secondaryBtn}
            onPress={() => router.replace('/(guest)/search')}
          >
            <Text style={s.secondaryBtnText}>Хайх</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9' },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  checkWrap: { marginBottom: 24 },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 40, color: '#FFF', fontWeight: '700' },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },
  loyalty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F6E56',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', flexShrink: 1, textAlign: 'right' },
  summaryValueBold: { fontSize: 16, fontWeight: '700', color: '#0F6E56' },
  paymentHint: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  paymentText: { fontSize: 13, color: '#555' },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0F6E56',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  secondaryBtn: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
});
