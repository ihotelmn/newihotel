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
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Star, Gift } from 'lucide-react-native';

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

const RATING_LABELS = ['', 'Муу', 'Тааруухан', 'Дунд зэрэг', 'Маш сайн', 'Гайхалтай!'];

export default function ReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && !submitting;

  const handleStarPress = (n: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(n);
  };

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        <Pressable
          style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#1A1A1A" strokeWidth={2.2} />
        </Pressable>
        <Text style={s.headerTitle}>Үнэлгээ өгөх</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hotel preview */}
        <View style={s.hotelPreview}>
          <ExpoImage
            source={{ uri: 'https://picsum.photos/seed/hotel2/400/300' }}
            placeholder={{ blurhash: BLURHASH }}
            style={s.hotelImage}
            contentFit="cover"
            transition={200}
          />
          <View style={s.hotelInfo}>
            <Text style={s.hotelName}>Тэрэлж Лодж</Text>
            <Text style={s.hotelMeta}>3/10 — 3/12 · Тэрэлж</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Ерөнхийд нь</Text>
          <View style={s.starsContainer}>
            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => handleStarPress(n)}
                  style={({ pressed }) => [s.starBtn, pressed && { transform: [{ scale: 1.15 }] }]}
                  hitSlop={4}
                >
                  <Star
                    size={38}
                    color={n <= rating ? '#F59E0B' : '#D3D1C7'}
                    fill={n <= rating ? '#F59E0B' : 'transparent'}
                    strokeWidth={n <= rating ? 0 : 1.5}
                  />
                </Pressable>
              ))}
            </View>
            {rating > 0 && (
              <Text style={s.ratingLabel}>{RATING_LABELS[rating]}</Text>
            )}
          </View>
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
            <Gift size={20} color="#FFF" strokeWidth={2} />
          </View>
          <View style={s.rewardContent}>
            <Text style={s.rewardTitle}>+30 Loyalty оноо</Text>
            <Text style={s.rewardText}>Үнэлгээ өгөхөд 30 loyalty оноо нэмэгдэнэ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={s.bottom}>
        <Pressable
          style={({ pressed }) => [
            s.submitBtn,
            !canSubmit && s.submitBtnDisabled,
            pressed && canSubmit && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
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
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#1A1A1A' },
  scroll: { padding: 20, gap: 24 },
  hotelPreview: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  hotelImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
  },
  hotelInfo: { flex: 1, justifyContent: 'center', gap: 3 },
  hotelName: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  hotelMeta: { fontSize: 13, color: '#888' },
  section: {},
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 },
  starsContainer: { alignItems: 'center', paddingVertical: 8 },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  starBtn: {},
  ratingLabel: { fontSize: 15, color: '#555', marginTop: 10, fontWeight: '500' },
  textAreaWrap: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  textArea: { fontSize: 15, color: '#1A1A1A', minHeight: 110, paddingTop: 0, lineHeight: 22 },
  charCount: { fontSize: 11, color: '#999', textAlign: 'right', marginTop: 8 },
  rewardCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  rewardBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#0F6E56',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  rewardContent: { flex: 1 },
  rewardTitle: { fontSize: 15, fontWeight: '600', color: '#04342C' },
  rewardText: { fontSize: 12, color: '#04342C', marginTop: 2, opacity: 0.8 },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 34,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
  },
  submitBtn: {
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.35 },
  submitBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
});
