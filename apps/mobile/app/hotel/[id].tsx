import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Star,
  ShieldCheck,
  Lock,
  Sparkles,
  MessageCircle,
  Phone,
  CreditCard,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge, useHaptic } from '@ihotel/ui';
import { fetchHotelById, fetchReviewsByHotel } from '@ihotel/api';
import { colors, radius, fontWeights, spacing, easing, animation } from '@ihotel/config';
import type { Hotel, Review } from '@ihotel/types';

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'Wi-Fi',
  parking: 'Зогсоол',
  restaurant: 'Ресторан',
  spa: 'Спа',
  pool: 'Усан сан',
  gym: 'Фитнесс',
  bar: 'Бар',
  room_service: 'Өрөөнд үйлчилгээ',
  laundry: 'Угаалга',
  airport_shuttle: 'Нисэх буудал',
  business_center: 'Бизнес төв',
  pet_friendly: 'Тэжээвэр амьтан',
  ev_charging: 'EV цэнэглэгч',
  sauna: 'Саун',
  breakfast: 'Өглөөний цай',
};

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const haptic = useHaptic();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // entrance animations
  const contentTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchHotelById(id), fetchReviewsByHotel(id)])
      .then(([h, r]) => {
        setHotel(h);
        setReviews(r);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && hotel) {
      contentTranslateY.value = withDelay(100, withSpring(0, easing.out));
      contentOpacity.value = withDelay(100, withTiming(1, { duration: animation.base }));
    }
  }, [loading, hotel]);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const toggleLike = () => {
    haptic.light();
    if (!liked) {
      heartScale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, easing.out),
      );
    }
    setLiked(!liked);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.centerLoader}
        />
      </SafeAreaView>
    );
  }

  if (!hotel) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerLoader}>
          <Text style={styles.emptyText}>Буудал олдсонгүй</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Gallery image */}
        <View style={styles.gallery}>
          <Image
            source={{ uri: hotel.image_url }}
            placeholder={{ blurhash: BLURHASH }}
            style={styles.galleryImage}
            contentFit="cover"
            transition={300}
          />
          {/* Overlay buttons */}
          <SafeAreaView style={styles.galleryOverlay}>
            <Pressable
              style={styles.overlayBtn}
              onPress={() => router.back()}
              hitSlop={8}
            >
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2} />
            </Pressable>
            <Pressable
              style={styles.overlayBtn}
              onPress={toggleLike}
              hitSlop={8}
            >
              <Animated.View style={heartAnimStyle}>
                <Heart
                  size={20}
                  color={liked ? '#E24B4A' : '#FFFFFF'}
                  fill={liked ? '#E24B4A' : 'transparent'}
                  strokeWidth={2}
                />
              </Animated.View>
            </Pressable>
          </SafeAreaView>
          {/* Image counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              1/{hotel.images.length}
            </Text>
          </View>
        </View>

        <Animated.View style={[styles.content, contentStyle]}>
          {/* Title + Verified */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{hotel.name}</Text>
            <Badge label="Баталгаат" variant="teal" />
          </View>
          <View style={styles.subtitleRow}>
            <MapPin size={12} color={colors.textSecondary} strokeWidth={2} />
            <Text style={styles.subtitle}>
              {hotel.city}
            </Text>
            <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.subtitle}>
              {hotel.avg_rating > 0
                ? `${hotel.avg_rating} (${hotel.review_count})`
                : 'Шинэ'}
            </Text>
          </View>

          {/* Trust card */}
          <View style={styles.trustCard}>
            <View style={styles.trustIconWrap}>
              <ShieldCheck size={18} color="#04342C" strokeWidth={2} />
            </View>
            <View style={styles.trustContent}>
              <Text style={styles.trustLabel}>Баталгаажсан буудал</Text>
              <Text style={styles.trustText}>
                Бичиг баримт шалгагдсан, бодит үйл ажиллагаа баталгаажсан
              </Text>
            </View>
          </View>

          {/* Price lock card */}
          <View style={styles.priceLockCard}>
            <Lock size={16} color={colors.primary} strokeWidth={2} />
            <View style={styles.priceLockContent}>
              <Text style={styles.priceLockLabel}>
                Үнэ lock — ₮{hotel.price_min.toLocaleString()} хадгалагдана
              </Text>
              <Text style={styles.priceLockText}>
                Энэ үнэ 24 цагийн дотор хүчинтэй
              </Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenities}>
            {hotel.amenities.map((a) => (
              <View key={a} style={styles.amenityPill}>
                <Text style={styles.amenityText}>
                  {AMENITY_LABELS[a] ?? a}
                </Text>
              </View>
            ))}
          </View>

          {/* AI summary */}
          <View style={styles.aiCard}>
            <View style={styles.aiLabelRow}>
              <Sparkles size={12} color={colors.primary} strokeWidth={2} />
              <Text style={styles.aiLabel}>AI хураангуй</Text>
            </View>
            <Text style={styles.aiText}>
              Зочид цэвэр байдал, ажилчдын найрсаг хандлагыг өндрөөр
              үнэлдэг. Wi-Fi заримдаа сул.
            </Text>
          </View>

          {/* Host chat preview */}
          <View style={styles.hostCard}>
            <View style={styles.hostRow}>
              <View style={styles.hostAvatar}>
                <Text style={styles.hostAvatarText}>ДМ</Text>
              </View>
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>Хост Дэлгэрмаа</Text>
                <Text style={styles.hostStatus}>Ихэвчлэн 5 мин-д хариулна</Text>
              </View>
            </View>
            <Pressable
              style={styles.hostChatBtn}
              onPress={() => {
                haptic.light();
                router.push(`/chat/${id}`);
              }}
            >
              <MessageCircle size={16} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.hostChatBtnText}>Чатлах</Text>
            </Pressable>
          </View>

          {/* Reviews */}
          <Text style={styles.sectionLabel}>Сүүлийн үнэлгээ</Text>
          {reviews.slice(0, 2).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewAuthor}>{review.title}</Text>
              <Text style={styles.reviewBody}>{review.body}</Text>
            </View>
          ))}

          {/* Bottom spacer for action bar */}
          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.actionBar}>
        <Pressable
          style={styles.actionPrimary}
          onPress={() => {
            haptic.medium();
            router.push(`/call/${id}`);
          }}
        >
          <View style={styles.actionRow}>
            <Phone size={16} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.actionPrimaryText}>Залгах · cash</Text>
          </View>
          <Text style={styles.actionPrimaryPrice}>
            ₮{hotel.price_min.toLocaleString()}-
            {(hotel.price_max / 1000).toFixed(0)}K
          </Text>
        </Pressable>
        <Pressable style={styles.actionSecondary}>
          <CreditCard size={16} color={colors.textPrimary} strokeWidth={2} />
          <Text style={styles.actionSecondaryText}>QPay</Text>
        </Pressable>
        <Pressable
          style={styles.actionChat}
          onPress={() => {
            haptic.light();
            router.push(`/chat/${id}`);
          }}
        >
          <MessageCircle size={20} color={colors.primary} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F1EFE8',
  },
  scrollView: {
    flex: 1,
  },
  centerLoader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Gallery
  gallery: {
    height: 300,
    position: 'relative',
    backgroundColor: '#E1F5EE',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  overlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  imageCounterText: {
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Content
  content: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    flex: 1,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg - 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },

  // Trust card
  trustCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: '#E1F5EE',
    borderWidth: 0.5,
    borderColor: '#5DCAA5',
    borderRadius: radius.md,
    padding: spacing.md + 1,
    marginBottom: spacing.md - 2,
  },
  trustIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(4,52,44,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustContent: {
    flex: 1,
  },
  trustLabel: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: '#04342C',
    marginBottom: spacing.xs,
  },
  trustText: {
    fontSize: 12,
    color: '#04342C',
    lineHeight: 18,
  },

  // Price lock card
  priceLockCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: radius.md,
    padding: spacing.md + 1,
    marginBottom: spacing.lg - 2,
  },
  priceLockContent: {
    flex: 1,
  },
  priceLockLabel: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  priceLockText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Amenities
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.lg - 2,
  },
  amenityPill: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  amenityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // AI card
  aiCard: {
    backgroundColor: '#E1F5EE',
    borderWidth: 0.5,
    borderColor: '#5DCAA5',
    borderRadius: radius.md,
    padding: spacing.md + 1,
    marginBottom: spacing.lg - 2,
  },
  aiLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm - 2,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: fontWeights.medium as '500',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiText: {
    fontSize: 14,
    color: '#04342C',
    lineHeight: 21,
  },

  // Host card
  hostCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: radius.md,
    padding: spacing.lg - 2,
    marginBottom: spacing.lg + 2,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md - 2,
    marginBottom: spacing.md - 2,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: '#04342C',
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  hostStatus: {
    fontSize: 12,
    color: colors.primary,
  },
  hostChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#F1EFE8',
    borderRadius: radius.sm,
    paddingVertical: 10,
    minHeight: 44,
  },
  hostChatBtnText: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },

  // Reviews
  sectionLabel: {
    fontSize: 11,
    fontWeight: fontWeights.medium as '500',
    color: '#888780',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: spacing.md + 1,
    marginBottom: spacing.sm,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  reviewBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  bottomSpacer: {
    height: 80,
  },

  // Action bar
  actionBar: {
    flexDirection: 'row',
    padding: spacing.lg - 2,
    paddingBottom: 30,
    backgroundColor: colors.card,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
    gap: spacing.sm,
  },
  actionPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionPrimaryText: {
    fontSize: 15,
    fontWeight: fontWeights.medium as '500',
    color: '#FFFFFF',
  },
  actionPrimaryPrice: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  actionSecondary: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: radius.md,
    paddingVertical: spacing.lg - 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionSecondaryText: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  actionChat: {
    width: 54,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
