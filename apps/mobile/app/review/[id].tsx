import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && !submitting;

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      Alert.alert(
        'Баярлалаа!',
        '+30 оноо авлаа. Таны үнэлгээ бусад зочдод тусална.',
        [{ text: 'OK', onPress: () => router.replace('/(guest)/trips') }],
      );
    }, 600);
  }, [canSubmit, router]);

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>←</Text>
        </Pressable>
        <Text style={s.headerTitle}>Үнэлгээ өгөх</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hotel preview */}
        <View style={s.hotelPreview}>
          <View style={s.hotelImage}>
            <Text style={s.hotelInitial}>Т</Text>
          </View>
          <View style={s.hotelInfo}>
            <Text style={s.hotelName}>Тэрэлж Лодж</Text>
            <Text style={s.hotelMeta}>3/10 — 3/12 · Тэрэлж</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Ерөнхийд нь</Text>
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setRating(n)}>
                <Text style={[s.star, n <= rating && s.starActive]}>★</Text>
              </Pressable>
            ))}
          </View>
          {rating > 0 && (
            <Text style={s.ratingLabel}>
              {rating === 5
                ? 'Гайхалтай!'
                : rating === 4
                  ? 'Маш сайн'
                  : rating === 3
                    ? 'Дунд зэрэг'
                    : rating === 2
                      ? 'Тааруухан'
                      : 'Муу'}
            </Text>
          )}
        </View>

        {/* Review Text */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Дэлгэрэнгүй (заавал биш)</Text>
          <View style={s.textAreaWrap}>
            <TextInput
              style={s.textArea}
              placeholder="Хостод болон бусад зочдод хэрэгтэй мэдээлэл..."
              placeholderTextColor="#999"
              value={body}
              onChangeText={(t) => setBody(t.slice(0, 500))}
              multiline
              textAlignVertical="top"
            />
            <Text style={s.charCount}>{body.length}/500</Text>
          </View>
        </View>

        {/* Reward Card */}
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
        <Pressable
          style={[s.submitBtn, !canSubmit && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          <Text style={s.submitBtnText}>
            {submitting ? 'Илгээж байна...' : 'Нийтлэх'}
          </Text>
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
  scroll: { padding: 20, gap: 24 },
  hotelPreview: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  hotelImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#C5D9C3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelInitial: { fontSize: 24, fontWeight: '700', color: 'rgba(0,0,0,0.15)' },
  hotelInfo: { flex: 1, justifyContent: 'center', gap: 2 },
  hotelName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  hotelMeta: { fontSize: 12, color: '#888' },
  section: {},
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  star: { fontSize: 36, color: '#D3D1C7' },
  starActive: { color: '#F59E0B' },
  ratingLabel: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 4 },
  textAreaWrap: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDEDED',
    padding: 14,
  },
  textArea: { fontSize: 15, color: '#1A1A1A', minHeight: 100, paddingTop: 0 },
  charCount: { fontSize: 11, color: '#999', textAlign: 'right', marginTop: 6 },
  rewardCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  rewardBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardBadgeText: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  rewardContent: { flex: 1 },
  rewardTitle: { fontSize: 13, fontWeight: '600', color: '#04342C' },
  rewardText: { fontSize: 12, color: '#04342C', marginTop: 1 },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  submitBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
