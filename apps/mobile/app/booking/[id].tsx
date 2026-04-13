import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Check, Map, Search } from 'lucide-react-native';

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

  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(contentTranslateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#E8F5E9', '#F8F7F3']} style={s.container}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Checkmark */}
        <Animated.View
          style={[
            s.checkWrap,
            { opacity: checkOpacity, transform: [{ scale: checkScale }] },
          ]}
        >
          <View style={s.checkCircle}>
            <Check size={40} color="#FFF" strokeWidth={3} />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={s.title}>Захиалга амжилттай!</Text>
          <Text style={s.subtitle}>
            Хост Дэлгэрмаа захиалгыг баталгаажуулав.
          </Text>
          <View style={s.loyaltyBadge}>
            <Text style={s.loyaltyText}>+50 loyalty оноо авсан</Text>
          </View>

          {/* Booking Summary */}
          <View style={s.card}>
            {SUMMARY_ROWS.map((row, i) => (
              <View
                key={i}
                style={[
                  s.summaryRow,
                  i === SUMMARY_ROWS.length - 1 && s.summaryRowLast,
                ]}
              >
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
              {'💳 Буудалд очиж cash төлнө'}
            </Text>
          </View>

          {/* Buttons */}
          <Pressable
            style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace('/(guest)/trips');
            }}
          >
            <Map size={18} color="#FFF" strokeWidth={2} />
            <Text style={s.primaryBtnText}>Аялал үзэх</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.secondaryBtn, pressed && { backgroundColor: '#F5F5F5' }]}
            onPress={() => router.replace('/(guest)/search')}
          >
            <Search size={18} color="#1A1A1A" strokeWidth={2} />
            <Text style={s.secondaryBtnText}>Хайх</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 100,
    paddingBottom: 50,
    alignItems: 'center',
  },
  checkWrap: { marginBottom: 28 },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 21,
  },
  loyaltyBadge: {
    backgroundColor: '#0F6E56',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 28,
  },
  loyaltyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  summaryRowLast: { borderBottomWidth: 0, paddingTop: 14 },
  summaryLabel: { fontSize: 13, color: '#888' },
  summaryValue: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', flexShrink: 1, textAlign: 'right' },
  summaryValueBold: { fontSize: 18, fontWeight: '700', color: '#0F6E56' },
  paymentHint: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  paymentText: { fontSize: 13, color: '#555' },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  secondaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  secondaryBtnText: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
});
