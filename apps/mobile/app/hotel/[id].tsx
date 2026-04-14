import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
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
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  Car,
  Waves,
  Mountain,
} from 'lucide-react-native';

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  'Wi-Fi': Wifi,
  'Ресторан': UtensilsCrossed,
  'Фитнесс': Dumbbell,
  'Зогсоол': Car,
  'Усан сан': Waves,
  'Морь унах': Mountain,
};

const HOTELS: Record<string, {
  name: string; city: string; rating: number; reviews: number;
  price: number; image: string; amenities: string[];
  aiSummary: string; hostName: string; hostInitials: string;
}> = {
  '1': { name: 'Шангри-Ла Улаанбаатар', city: 'Улаанбаатар', rating: 4.8, reviews: 342, price: 450000, image: 'https://picsum.photos/seed/hotel1/400/300', amenities: ['Wi-Fi', 'Ресторан', 'Спа', 'Фитнесс', 'Зогсоол', 'Бар'], aiSummary: 'Зочид цэвэр байдал, өндөр зэрэглэлийн үйлчилгээг онцолдог. Хотын төвд байрлалтай тул зорчиход тохиромжтой.', hostName: 'Болормаа', hostInitials: 'БМ' },
  '2': { name: 'Тэрэлж Лодж', city: 'Тэрэлж', rating: 4.6, reviews: 128, price: 180000, image: 'https://picsum.photos/seed/hotel2/400/300', amenities: ['Wi-Fi', 'Ресторан', 'Морь унах', 'Явган аялал'], aiSummary: 'Байгалийн үзэсгэлэнт газар, амар тайван орчин. Wi-Fi заримдаа тасалддаг.', hostName: 'Дэлгэрмаа', hostInitials: 'ДМ' },
  '3': { name: 'Говийн Гэр Кэмп', city: 'Өмнөговь', rating: 4.5, reviews: 87, price: 95000, image: 'https://picsum.photos/seed/hotel3/400/300', amenities: ['Ресторан', 'Тэмээ унах', 'Од ажиглах'], aiSummary: 'Говийн байгаль, тэмээ унах, од ажиглах гайхалтай газар.', hostName: 'Ганбат', hostInitials: 'ГБ' },
  '4': { name: 'Хустайн Рисорт', city: 'Хустай', rating: 4.7, reviews: 215, price: 320000, image: 'https://picsum.photos/seed/hotel4/400/300', amenities: ['Wi-Fi', 'Ресторан', 'Усан сан', 'Хүүхдийн талбай'], aiSummary: 'Гэр бүлд тохиромжтой, хүүхдийн тоглоомын талбай, морь унах боломжтой.', hostName: 'Сүхбат', hostInitials: 'СБ' },
  '5': { name: 'Номад Гэстхаус', city: 'Улаанбаатар', rating: 4.3, reviews: 64, price: 55000, image: 'https://picsum.photos/seed/hotel5/400/300', amenities: ['Wi-Fi', 'Угаалга'], aiSummary: 'Хямд, цэвэрхэн, backpacker-уудад тохиромжтой.', hostName: 'Оюунаа', hostInitials: 'ОА' },
  '6': { name: 'Блү Скай Хотел', city: 'Улаанбаатар', rating: 4.7, reviews: 298, price: 380000, image: 'https://picsum.photos/seed/hotel6/400/300', amenities: ['Wi-Fi', 'Ресторан', 'Бар', 'Фитнесс', 'Спа'], aiSummary: 'Хотын төвийн гайхалтай харагдацтай, өндөр зэрэглэлийн үйлчилгээ.', hostName: 'Энхжин', hostInitials: 'ЭЖ' },
  '7': { name: 'Хөвсгөл Лодж', city: 'Хөвсгөл', rating: 4.9, reviews: 176, price: 210000, image: 'https://picsum.photos/seed/hotel7/400/300', amenities: ['Ресторан', 'Завь', 'Явган аялал', 'Загас барих'], aiSummary: 'Хөвсгөл нуурын дэргэд, загас барих, завиар аялах гайхалтай боломж.', hostName: 'Батбаяр', hostInitials: 'ББ' },
  '8': { name: 'Алтай Гэр Кэмп', city: 'Баян-Өлгий', rating: 4.4, reviews: 53, price: 85000, image: 'https://picsum.photos/seed/hotel8/400/300', amenities: ['Ресторан', 'Бүргэд ажиглах'], aiSummary: 'Казах соёл, бүргэд ажиглах, уулын байгаль.', hostName: 'Айнур', hostInitials: 'АН' },
  '9': { name: 'Чингис Хаан Хотел', city: 'Улаанбаатар', rating: 4.6, reviews: 410, price: 290000, image: 'https://picsum.photos/seed/hotel9/400/300', amenities: ['Wi-Fi', 'Ресторан', 'Бар', 'Зогсоол'], aiSummary: 'Түүхэн хотелуудын нэг, хотын төвд байрладаг.', hostName: 'Мөнхбат', hostInitials: 'МБ' },
  '10': { name: 'Горхи Тэрэлж Рисорт', city: 'Тэрэлж', rating: 4.8, reviews: 192, price: 350000, image: 'https://picsum.photos/seed/hotel10/400/300', amenities: ['Wi-Fi', 'Ресторан', 'Спа', 'Морь унах', 'Явган аялал'], aiSummary: 'Тэрэлжийн хамгийн шилдэг рисорт. Байгаль, тайвшрал, luxury бүгд нэг дор.', hostName: 'Цэцэг', hostInitials: 'ЦЦ' },
};

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Ариунзаяа', rating: 5, text: 'Маш гайхалтай газар байлаа! Ажилчид маш найрсаг, өрөө цэвэрхэн.' },
  { id: 'r2', author: 'Тэмүүлэн', rating: 4, text: 'Байршил маш сайн. Үнэ цэнэ зохимжтой. Дахин очно.' },
];

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const hotel = HOTELS[id ?? '1'] ?? HOTELS['1'];

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiked(!liked);
  };

  return (
    <View style={s.safe}>
      <ScrollView style={s.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View style={s.imageHeaderWrap}>
          <ExpoImage
            source={{ uri: hotel.image }}
            placeholder={{ blurhash: BLURHASH }}
            style={s.imageHeader}
            contentFit="cover"
            transition={300}
          />
          <SafeAreaView style={s.overlay}>
            <Pressable
              style={({ pressed }) => [s.overlayBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color="#FFF" strokeWidth={2.2} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [s.overlayBtn, pressed && { opacity: 0.8 }]}
              onPress={handleLike}
            >
              <Heart
                size={22}
                color="#FFF"
                fill={liked ? '#E24B4A' : 'transparent'}
                strokeWidth={2}
              />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={s.content}>
          {/* Name + Rating */}
          <Text style={s.hotelName}>{hotel.name}</Text>
          <View style={s.metaRow}>
            <View style={s.metaItem}>
              <MapPin size={14} color="#888" strokeWidth={2} />
              <Text style={s.metaCity}>{hotel.city}</Text>
            </View>
            <View style={s.metaItem}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
              <Text style={s.metaRating}>{hotel.rating}</Text>
              <Text style={s.metaReviews}>({hotel.reviews})</Text>
            </View>
          </View>

          {/* Trust Card */}
          <View style={s.trustCard}>
            <ShieldCheck size={20} color="#0F6E56" strokeWidth={2} />
            <View style={s.trustContent}>
              <Text style={s.trustTitle}>Баталгаажсан буудал</Text>
              <Text style={s.trustText}>Бичиг баримт шалгагдсан, бодит үйл ажиллагаа баталгаажсан</Text>
            </View>
          </View>

          {/* Price Lock Card */}
          <View style={s.priceLockCard}>
            <Lock size={18} color="#0F6E56" strokeWidth={2} />
            <View style={s.priceLockContent}>
              <Text style={s.priceLockTitle}>{'Үнэ lock — ₮' + hotel.price.toLocaleString() + ' хадгалагдана'}</Text>
              <Text style={s.priceLockText}>Энэ үнэ 24 цагийн дотор хүчинтэй</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={s.amenities}>
            {hotel.amenities.map((a) => {
              const Icon = AMENITY_ICONS[a];
              return (
                <View key={a} style={s.amenityPill}>
                  {Icon && <Icon size={14} color="#555" strokeWidth={1.8} />}
                  <Text style={s.amenityText}>{a}</Text>
                </View>
              );
            })}
          </View>

          {/* AI Summary */}
          <View style={s.aiCard}>
            <View style={s.aiLabelRow}>
              <Sparkles size={14} color="#0F6E56" strokeWidth={2} />
              <Text style={s.aiLabel}>AI хураангуй</Text>
            </View>
            <Text style={s.aiText}>{hotel.aiSummary}</Text>
          </View>

          {/* Host Chat Preview */}
          <Pressable
            style={({ pressed }) => [s.hostCard, pressed && { backgroundColor: '#FAFAFA' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/chat/${id}`);
            }}
          >
            <View style={s.hostRow}>
              <View style={s.hostAvatar}>
                <Text style={s.hostAvatarText}>{hotel.hostInitials}</Text>
              </View>
              <View style={s.hostInfo}>
                <Text style={s.hostName}>Хост {hotel.hostName}</Text>
                <Text style={s.hostStatus}>Ихэвчлэн 5 мин-д хариулна</Text>
              </View>
            </View>
            <View style={s.hostChatBtn}>
              <MessageCircle size={16} color="#1A1A1A" strokeWidth={2} />
              <Text style={s.hostChatBtnText}>Чатлах</Text>
            </View>
          </Pressable>

          {/* Reviews */}
          <Text style={s.sectionLabel}>Сүүлийн үнэлгээ</Text>
          {MOCK_REVIEWS.map((r) => (
            <View key={r.id} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <Text style={s.reviewAuthor}>{r.author}</Text>
                <View style={s.reviewStars}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                  ))}
                </View>
              </View>
              <Text style={s.reviewText}>{r.text}</Text>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={s.actionBar}>
        <Pressable
          style={({ pressed }) => [s.actionPrimary, pressed && { opacity: 0.9 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/call/${id}`);
          }}
        >
          <Phone size={18} color="#FFF" strokeWidth={2} />
          <View>
            <Text style={s.actionPrimaryText}>Залгах</Text>
            <Text style={s.actionPrimaryPrice}>{'₮' + hotel.price.toLocaleString()}</Text>
          </View>
        </Pressable>
        <Pressable
          style={({ pressed }) => [s.actionSecondary, pressed && { backgroundColor: '#F5F5F5' }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/payment/${id}`);
          }}
        >
          <CreditCard size={18} color="#1A1A1A" strokeWidth={2} />
          <Text style={s.actionSecondaryText}>QPay</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [s.actionChat, pressed && { backgroundColor: '#F5F5F5' }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/chat/${id}`);
          }}
        >
          <MessageCircle size={22} color="#1A1A1A" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scrollView: { flex: 1 },
  imageHeaderWrap: { position: 'relative' },
  imageHeader: { height: 280, width: '100%' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  overlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20, marginTop: -12, borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: '#F8F7F3' },
  hotelName: { fontSize: 24, fontWeight: '500', color: '#1A1A1A', marginBottom: 6, letterSpacing: -0.3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 18 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaCity: { fontSize: 14, color: '#888' },
  metaRating: { fontSize: 14, fontWeight: '500', color: '#F59E0B' },
  metaReviews: { fontSize: 13, color: '#999' },
  trustCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  trustContent: { flex: 1 },
  trustTitle: { fontSize: 14, fontWeight: '500', color: '#04342C', marginBottom: 2 },
  trustText: { fontSize: 12, color: '#04342C', lineHeight: 18, opacity: 0.8 },
  priceLockCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  priceLockContent: { flex: 1 },
  priceLockTitle: { fontSize: 14, fontWeight: '500', color: '#1A1A1A', marginBottom: 2 },
  priceLockText: { fontSize: 12, color: '#888' },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  amenityText: { fontSize: 12, color: '#555', fontWeight: '500' },
  aiCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiLabel: { fontSize: 12, fontWeight: '500', color: '#0F6E56', textTransform: 'uppercase', letterSpacing: 0.5 },
  aiText: { fontSize: 14, color: '#04342C', lineHeight: 22 },
  hostCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: { fontSize: 15, fontWeight: '500', color: '#04342C' },
  hostInfo: { flex: 1 },
  hostName: { fontSize: 15, fontWeight: '500', color: '#1A1A1A' },
  hostStatus: { fontSize: 12, color: '#0F6E56', marginTop: 1 },
  hostChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingVertical: 12,
  },
  hostChatBtnText: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  sectionLabel: { fontSize: 16, fontWeight: '500', color: '#1A1A1A', marginBottom: 12 },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewAuthor: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 13, color: '#555', lineHeight: 20 },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  actionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#0F6E56',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionPrimaryText: { fontSize: 15, fontWeight: '500', color: '#FFF' },
  actionPrimaryPrice: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  actionSecondary: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingVertical: 16,
  },
  actionSecondaryText: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  actionChat: {
    width: 54,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
