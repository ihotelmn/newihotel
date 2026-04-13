import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { ArrowLeft, Star as StarIcon, Gift } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { toast } from 'sonner-native';
import { colors, fontWeights, fontSize, spacing, radius, easing } from '@ihotel/config';
import { Button, useHaptic } from '@ihotel/ui';

const MAX_CHARS = 500;

/* ─── star rating ─── */

function StarRating({ rating, onRate }: { rating: number; onRate: (n: number) => void }) {
  const haptic = useHaptic();
  return (
    <View style={starS.wrap}>
      {[1, 2, 3, 4, 5].map(n => (
        <Pressable key={n} onPress={() => { haptic.medium(); onRate(n); }} hitSlop={4}>
          <StarIcon
            size={32}
            color={n <= rating ? '#EF9F27' : '#D3D1C7'}
            fill={n <= rating ? '#EF9F27' : 'transparent'}
            strokeWidth={n <= rating ? 0 : 1.5}
          />
        </Pressable>
      ))}
    </View>
  );
}

const starS = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', paddingVertical: spacing.lg },
});

/* ─── screen ─── */

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const haptic = useHaptic();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    haptic.success();
    setSubmitting(true);
    setTimeout(() => {
      toast('+30 оноо авлаа · Баярлалаа', { duration: 3000 });
      setTimeout(() => router.replace('/(guest)/trips'), 800);
    }, 600);
  }, [canSubmit, haptic, router]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text style={s.headerTitle}>Үнэлгээ өгөх</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hotel preview */}
        <View style={s.hotelPreview}>
          <Image source={{ uri: 'https://picsum.photos/seed/review1/200/200' }}
            style={s.hotelImage} contentFit="cover" transition={200} />
          <View style={s.hotelInfo}>
            <Text style={s.hotelName}>Тэрэлж Lodge</Text>
            <Text style={s.hotelMeta}>3/10 — 3/12 · Тэрэлж</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Ерөнхийд нь</Text>
          <StarRating rating={rating} onRate={setRating} />
        </View>

        {/* Review text */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Дэлгэрэнгүй (заавал биш)</Text>
          <View style={s.textAreaWrap}>
            <TextInput
              style={s.textArea}
              placeholder="Хостод болон бусад зочдод хэрэгтэй мэдээлэл..."
              placeholderTextColor="#888780"
              value={body}
              onChangeText={t => setBody(t.slice(0, MAX_CHARS))}
              multiline
              textAlignVertical="top"
            />
            <Text style={s.charCount}>{body.length}/{MAX_CHARS}</Text>
          </View>
        </View>

        {/* Reward card */}
        <View style={s.rewardCard}>
          <View style={s.rewardBadge}>
            <Text style={s.rewardBadgeText}>+30</Text>
          </View>
          <View style={s.rewardContent}>
            <Text style={s.rewardTitle}>Loyalty оноо</Text>
            <Text style={s.rewardText}>Үнэлгээ өгөхөд 30 loyalty оноо нэмэгдэнэ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottom}>
        <Button
          title="Нийтлэх"
          loading={submitting}
          disabled={!canSubmit}
          onPress={handleSubmit}
        />
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
  scroll: { padding: spacing.lg + 4, gap: spacing.xl },

  /* hotel preview */
  hotelPreview: {
    flexDirection: 'row', gap: spacing.md, backgroundColor: colors.card,
    borderRadius: radius.md, padding: spacing.md, borderWidth: 0.5, borderColor: colors.border as string,
  },
  hotelImage: { width: 60, height: 60, borderRadius: radius.sm },
  hotelInfo: { flex: 1, justifyContent: 'center', gap: 2 },
  hotelName: { fontSize: 15, fontWeight: fontWeights.medium as '500', color: colors.textPrimary },
  hotelMeta: { fontSize: fontSize.caption, color: colors.textSecondary },

  /* section */
  section: {},
  sectionTitle: { fontSize: fontSize.body, fontWeight: fontWeights.medium as '500', color: colors.textPrimary, marginBottom: spacing.xs },

  /* text area */
  textAreaWrap: {
    backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 0.5,
    borderColor: colors.border as string, padding: spacing.md,
  },
  textArea: { fontSize: 15, color: colors.textPrimary, minHeight: 100, paddingTop: 0 },
  charCount: { fontSize: fontSize.tiny, color: colors.textSecondary, textAlign: 'right', marginTop: spacing.xs },

  /* reward */
  rewardCard: {
    flexDirection: 'row', gap: spacing.md, backgroundColor: '#E1F5EE',
    borderRadius: radius.md, padding: spacing.lg - 2, alignItems: 'center',
  },
  rewardBadge: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  rewardBadgeText: { fontSize: 14, fontWeight: fontWeights.semibold as '600', color: '#FFFFFF' },
  rewardContent: { flex: 1 },
  rewardTitle: { fontSize: 13, fontWeight: fontWeights.medium as '500', color: '#04342C' },
  rewardText: { fontSize: fontSize.caption, color: '#04342C', marginTop: 1 },

  /* bottom */
  bottom: {
    paddingHorizontal: spacing.lg + 4, paddingVertical: spacing.md,
    backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.border as string,
  },
});
