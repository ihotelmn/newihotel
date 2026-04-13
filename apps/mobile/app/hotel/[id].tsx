import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Badge } from '@ihotel/ui';
import { fetchHotelById, fetchReviewsByHotel } from '@ihotel/api';
import { colors, radius, fontWeights } from '@ihotel/config';
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

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

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
            style={styles.galleryImage}
          />
          {/* Overlay buttons */}
          <SafeAreaView style={styles.galleryOverlay}>
            <TouchableOpacity
              style={styles.overlayBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.overlayBtnText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.overlayBtn}
              onPress={() => setLiked(!liked)}
            >
              <Text style={styles.overlayBtnText}>
                {liked ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
          {/* Image counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              1/{hotel.images.length}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title + Verified */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{hotel.name}</Text>
            <Badge label="✓ Баталгаат" variant="teal" />
          </View>
          <Text style={styles.subtitle}>
            📍 {hotel.city} · ★{' '}
            {hotel.avg_rating > 0
              ? `${hotel.avg_rating} (${hotel.review_count})`
              : 'Шинэ'}
          </Text>

          {/* Trust card */}
          <View style={styles.trustCard}>
            <Text style={styles.trustLabel}>🛡 Баталгаажсан буудал</Text>
            <Text style={styles.trustText}>
              Бичиг баримт шалгагдсан, бодит үйл ажиллагаа баталгаажсан
            </Text>
          </View>

          {/* Price lock card */}
          <View style={styles.priceLockCard}>
            <Text style={styles.priceLockLabel}>
              🔒 Үнэ lock — ₮{hotel.price_min.toLocaleString()} хадгалагдана
            </Text>
            <Text style={styles.priceLockText}>
              Энэ үнэ 24 цагийн дотор хүчинтэй
            </Text>
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
            <Text style={styles.aiLabel}>✨ AI хураангуй</Text>
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
            <TouchableOpacity
              style={styles.hostChatBtn}
              onPress={() => router.push(`/chat/${id}`)}
            >
              <Text style={styles.hostChatBtnText}>💬 Чатлах</Text>
            </TouchableOpacity>
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
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionPrimary}
          onPress={() => router.push(`/call/${id}`)}
        >
          <Text style={styles.actionPrimaryText}>Залгах · cash</Text>
          <Text style={styles.actionPrimaryPrice}>
            ₮{hotel.price_min.toLocaleString()}-
            {(hotel.price_max / 1000).toFixed(0)}K
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionSecondary}>
          <Text style={styles.actionSecondaryText}>Онлайн · QPay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionChat}
          onPress={() => router.push(`/chat/${id}`)}
        >
          <Text style={styles.actionChatText}>💬</Text>
        </TouchableOpacity>
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
    height: 280,
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  overlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
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
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
  },

  // Trust card
  trustCard: {
    backgroundColor: '#E1F5EE',
    borderWidth: 0.5,
    borderColor: '#5DCAA5',
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },
  trustLabel: {
    fontSize: 13,
    fontWeight: fontWeights.medium as '500',
    color: '#04342C',
    marginBottom: 4,
  },
  trustText: {
    fontSize: 12,
    color: '#04342C',
    lineHeight: 18,
  },

  // Price lock card
  priceLockCard: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: 13,
    marginBottom: 14,
  },
  priceLockLabel: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: 4,
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
    marginBottom: 14,
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
    borderRadius: 12,
    padding: 13,
    marginBottom: 14,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: fontWeights.medium as '500',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
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
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
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
    backgroundColor: '#F1EFE8',
    borderRadius: radius.sm,
    paddingVertical: 10,
    alignItems: 'center',
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
    marginBottom: 8,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 13,
    marginBottom: 8,
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
    padding: 14,
    paddingBottom: 30,
    backgroundColor: colors.card,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.08)',
    gap: 8,
  },
  actionPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
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
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionSecondaryText: {
    fontSize: 15,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  actionChat: {
    width: 54,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionChatText: {
    fontSize: 20,
  },
});
