import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { PhoneOff, MicOff } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { fontWeights, spacing, radius, animation } from '@ihotel/config';
import { useHaptic } from '@ihotel/ui';

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const haptic = useHaptic();

  // avatar pulse
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleEndCall = () => {
    haptic.medium();
    router.replace(`/booking/${id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#04342C', '#0A0A0A']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Top info */}
        <View style={styles.top}>
          <Text style={styles.callingLabel}>Хангай Resort руу</Text>
          <Text style={styles.callingStatus}>Залгаж байна...</Text>

          {/* Avatar with pulse */}
          <Animated.View style={[styles.avatarWrap, pulseStyle]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>ХР</Text>
            </View>
          </Animated.View>
        </View>

        {/* Pre-call info card */}
        <View style={styles.infoCardWrap}>
          <BlurView intensity={30} tint="dark" style={styles.infoCard}>
            <Text style={styles.infoTitle}>Буудалд илгээгдсэн</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>📅</Text>
              <Text style={styles.infoText}>4-р сарын 20 — 22 (2 шөнө)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>👥</Text>
              <Text style={styles.infoText}>2 том хүн</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>🛏</Text>
              <Text style={styles.infoText}>Deluxe өрөө</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>💰</Text>
              <Text style={styles.infoText}>₮250,000 — ₮300,000</Text>
            </View>
          </BlurView>
        </View>

        {/* Price lock */}
        <View style={styles.priceLock}>
          <Text style={styles.priceLockText}>
            🔒 Үнэ lock — ₮280K/шөнө · 10% хүртэл өөрчилж болно
          </Text>
        </View>

        {/* Call controls */}
        <View style={styles.controls}>
          <Pressable style={styles.muteBtn}>
            <MicOff size={28} color="#FFFFFF" strokeWidth={1.8} />
          </Pressable>
          <Pressable style={styles.endCallBtn} onPress={handleEndCall}>
            <PhoneOff size={28} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2xl'],
  },

  /* top */
  top: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
    gap: spacing.sm,
  },
  callingLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  callingStatus: {
    fontSize: 20,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
  avatarWrap: {
    marginTop: spacing['2xl'],
  },
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
  avatarText: {
    fontSize: 36,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },

  /* info card */
  infoCardWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  infoCard: {
    padding: spacing.lg + 4,
    gap: spacing.md,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoEmoji: { fontSize: 16 },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  /* price lock */
  priceLock: {
    backgroundColor: 'rgba(15,110,86,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  priceLockText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  /* controls */
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  muteBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E24B4A',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E24B4A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
});
