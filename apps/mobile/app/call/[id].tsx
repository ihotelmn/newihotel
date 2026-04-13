import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [muted, setMuted] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleEndCall = () => {
    router.replace(`/booking/${id}`);
  };

  return (
    <View style={s.container}>
      <SafeAreaView style={s.safe}>
        {/* Top */}
        <View style={s.top}>
          <Text style={s.callingTo}>Хангай Resort руу</Text>
          <Text style={s.callingStatus}>Залгаж байна{dots}</Text>

          {/* Avatar */}
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>ХР</Text>
            </View>
          </View>
        </View>

        {/* Pre-call info */}
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>Буудалд илгээгдсэн</Text>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>📅</Text>
            <Text style={s.infoText}>4-р сарын 20 — 22 (2 шөнө)</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>👥</Text>
            <Text style={s.infoText}>2 том хүн</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>🛏️</Text>
            <Text style={s.infoText}>Deluxe өрөө</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoIcon}>💰</Text>
            <Text style={s.infoText}>₮250,000 — ₮300,000</Text>
          </View>
        </View>

        {/* Price lock */}
        <View style={s.priceLock}>
          <Text style={s.priceLockText}>
            🔒 Үнэ lock — ₮280K/шөнө · 10% хүртэл өөрчилж болно
          </Text>
        </View>

        {/* Controls */}
        <View style={s.controls}>
          <Pressable
            style={[s.muteBtn, muted && s.muteBtnActive]}
            onPress={() => setMuted(!muted)}
          >
            <Text style={s.controlIcon}>{muted ? '🔇' : '🔊'}</Text>
            <Text style={s.controlLabel}>{muted ? 'Дуугүй' : 'Дуу'}</Text>
          </Pressable>
          <Pressable style={s.endCallBtn} onPress={handleEndCall}>
            <Text style={s.endCallIcon}>📞</Text>
            <Text style={s.endCallLabel}>Дуусгах</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  top: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  callingTo: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  callingStatus: { fontSize: 20, fontWeight: '600', color: '#FFF' },
  avatarWrap: { marginTop: 32 },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 36, fontWeight: '600', color: '#FFF' },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: { fontSize: 16 },
  infoText: { fontSize: 14, color: '#FFF' },
  priceLock: {
    backgroundColor: 'rgba(15,110,86,0.25)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  priceLockText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 32,
  },
  muteBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteBtnActive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  controlIcon: { fontSize: 24 },
  controlLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  endCallBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E24B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallIcon: { fontSize: 24 },
  endCallLabel: { fontSize: 10, color: '#FFF', marginTop: 2 },
});
