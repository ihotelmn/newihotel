import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  colors,
  fontWeights,
  spacing,
  radius,
  animation,
  easing,
} from '@ihotel/config';
import { Button, useHaptic } from '@ihotel/ui';

/* ─── booking confirmation ─── */

export default function BookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const haptic = useHaptic();

  // entrance animations
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    haptic.success();

    // checkmark
    checkScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    checkOpacity.value = withTiming(1, { duration: animation.base });

    // content
    contentTranslateY.value = withDelay(400, withSpring(0, easing.out));
    contentOpacity.value = withDelay(
      400,
      withTiming(1, { duration: animation.base }),
    );
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E1F5EE', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Success checkmark */}
          <Animated.View style={[styles.checkWrap, checkStyle]}>
            <View style={styles.checkCircle}>
              <Check size={44} color="#FFFFFF" strokeWidth={3} />
            </View>
          </Animated.View>

          {/* Content */}
          <Animated.View style={[styles.content, contentStyle]}>
            <Text style={styles.title}>Захиалга амжилттай</Text>
            <Text style={styles.subtitle}>
              Хост Дэлгэрмаа захиалгыг баталгаажуулав.
            </Text>
            <Text style={styles.loyalty}>+50 loyalty оноо авсан</Text>

            {/* Booking summary */}
            <View style={styles.card}>
              <SummaryRow label="Буудал" value="Хангай Resort" />
              <SummaryRow label="Огноо" value="4-р сарын 20 — 22 (2 шөнө)" />
              <SummaryRow label="Өрөө" value="Deluxe · 2 том хүн" />
              <SummaryRow label="Захиалгын №" value="IH-20250420-0381" />
              <View style={styles.divider} />
              <SummaryRow label="Нийт" value="₮560,000" bold />
            </View>

            {/* Payment hint */}
            <View style={styles.paymentHint}>
              <Text style={styles.paymentText}>
                💳 Буудалд очиж cash төлнө
              </Text>
            </View>

            {/* CTAs */}
            <View style={styles.actions}>
              <Button
                title="Аялал үзэх"
                onPress={() => router.replace('/(guest)/search')}
              />
              <View style={styles.spacer} />
              <Button
                title="Үргэлжлүүлэн хайх"
                variant="secondary"
                onPress={() => router.replace('/(guest)/search')}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={summaryStyles.row}>
      <Text style={summaryStyles.label}>{label}</Text>
      <Text
        style={[summaryStyles.value, bold && summaryStyles.valueBold]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
  valueBold: {
    fontSize: 16,
    color: colors.primary,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing.xl + 4,
    paddingTop: spacing['3xl'] + 20,
    paddingBottom: spacing['3xl'],
  },

  /* checkmark */
  checkWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 8 },
    }),
  },

  /* content */
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  loyalty: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.primary,
    marginBottom: spacing.xl,
  },

  /* card */
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg + 4,
    marginBottom: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border as string,
    marginVertical: spacing.xs,
  },

  /* payment */
  paymentHint: {
    backgroundColor: '#F1EFE8',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing['2xl'],
    width: '100%',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  /* actions */
  actions: {
    width: '100%',
  },
  spacer: {
    height: spacing.md,
  },
});
