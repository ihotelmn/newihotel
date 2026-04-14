import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { PhoneOff, MicOff, Mic, Calendar, Users, BedDouble, Banknote } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [muted, setMuted] = useState(false);
  const [dots, setDots] = useState('');

  // Pulse animation
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse1Opacity = useRef(new Animated.Value(0.4)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse2Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const createPulse = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1.8, duration: 1500, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
          ]),
        ]),
      );

    const a1 = createPulse(pulse1, pulse1Opacity, 0);
    const a2 = createPulse(pulse2, pulse2Opacity, 600);
    a1.start();
    a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, []);

  const handleEndCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/booking/${id}`);
  };

  const handleMute = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMuted(!muted);
  };

  const INFO_ROWS = [
    { icon: Calendar, text: '4-р сарын 20 — 22 (2 шөнө)' },
    { icon: Users, text: '2 том хүн' },
    { icon: BedDouble, text: 'Deluxe өрөө' },
    { icon: Banknote, text: '₮250,000 — ₮300,000' },
  ];

  return (
    <LinearGradient colors={['#04342C', '#0A0A0A']} style={s.container}>
      <StatusBar style="light" />
      <View style={s.safe}>
        {/* Top */}
        <View style={s.top}>
          <Text style={s.callingTo}>Хангай Resort руу</Text>
          <Text style={s.callingStatus}>{'Залгаж байна' + dots}</Text>

          {/* Pulsing Avatar */}
          <View style={s.avatarContainer}>
            <Animated.View
              style={[
                s.pulseRing,
                { transform: [{ scale: pulse1 }], opacity: pulse1Opacity },
              ]}
            />
            <Animated.View
              style={[
                s.pulseRing,
                { transform: [{ scale: pulse2 }], opacity: pulse2Opacity },
              ]}
            />
            <View style={s.avatar}>
              <Text style={s.avatarText}>ХР</Text>
            </View>
          </View>
        </View>

        {/* Pre-call info */}
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>Буудалд илгээгдсэн</Text>
          {INFO_ROWS.map((row, i) => {
            const Icon = row.icon;
            return (
              <View key={i} style={s.infoRow}>
                <Icon size={16} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                <Text style={s.infoText}>{row.text}</Text>
              </View>
            );
          })}
        </View>

        {/* Price lock */}
        <View style={s.priceLock}>
          <Text style={s.priceLockText}>
            {'🔒 Үнэ lock — ₮280K/шөнө · 10% хүртэл өөрчилж болно'}
          </Text>
        </View>

        {/* Controls */}
        <View style={s.controls}>
          <Pressable
            style={({ pressed }) => [s.muteBtn, muted && s.muteBtnActive, pressed && { opacity: 0.8 }]}
            onPress={handleMute}
          >
            {muted ? (
              <MicOff size={26} color="#FFF" strokeWidth={2} />
            ) : (
              <Mic size={26} color="rgba(255,255,255,0.8)" strokeWidth={2} />
            )}
            <Text style={s.controlLabel}>{muted ? 'Дуугүй' : 'Дуу'}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.endCallBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] }]}
            onPress={handleEndCall}
          >
            <PhoneOff size={28} color="#FFF" strokeWidth={2} />
            <Text style={s.endCallLabel}>Дуусгах</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 50,
  },
  top: {
    alignItems: 'center',
    gap: 8,
  },
  callingTo: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  callingStatus: { fontSize: 22, fontWeight: '500', color: '#FFF' },
  avatarContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  pulseRing: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: 'rgba(15,110,86,0.5)',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 36, fontWeight: '500', color: '#FFF' },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 18,
    padding: 22,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { fontSize: 14, color: '#FFF', fontWeight: '400' },
  priceLock: {
    backgroundColor: 'rgba(15,110,86,0.2)',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(15,110,86,0.3)',
  },
  priceLockText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 19,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 44,
  },
  muteBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  muteBtnActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  controlLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  endCallBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E24B4A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#E24B4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  endCallLabel: { fontSize: 10, color: '#FFF', fontWeight: '500' },
});
