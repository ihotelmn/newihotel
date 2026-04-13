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

const HOTELS: Record<string, {
  name: string; city: string; rating: number; reviews: number;
  price: number; color: string; amenities: string[];
  aiSummary: string; hostName: string; hostInitials: string;
}> = {
  '1': { name: 'Шангри-Ла Улаанбаатар', city: 'Улаанбаатар', rating: 4.8, reviews: 342, price: 450000, color: '#E8D5B7', amenities: ['Wi-Fi', 'Ресторан', 'Спа', 'Фитнесс', 'Зогсоол', 'Бар'], aiSummary: 'Зочид цэвэр байдал, өндөр зэрэглэлийн үйлчилгээг онцолдог. Хотын төвд байрлалтай тул зорчиход тохиромжтой.', hostName: 'Болормаа', hostInitials: 'БМ' },
  '2': { name: 'Тэрэлж Лодж', city: 'Тэрэлж', rating: 4.6, reviews: 128, price: 180000, color: '#C5D9C3', amenities: ['Wi-Fi', 'Ресторан', 'Морь унах', 'Явган аялал'], aiSummary: 'Байгалийн үзэсгэлэнт газар, амар тайван орчин. Wi-Fi заримдаа тасалддаг.', hostName: 'Дэлгэрмаа', hostInitials: 'ДМ' },
  '3': { name: 'Говийн Гэр Кэмп', city: 'Өмнөговь', rating: 4.5, reviews: 87, price: 95000, color: '#D4C4A8', amenities: ['Ресторан', 'Тэмээ унах', 'Од ажиглах'], aiSummary: 'Говийн байгаль, тэмээ унах, од ажиглах гайхалтай газар.', hostName: 'Ганбат', hostInitials: 'ГБ' },
  '4': { name: 'Хустайн Рисорт', city: 'Хустай', rating: 4.7, reviews: 215, price: 320000, color: '#B8D4E3', amenities: ['Wi-Fi', 'Ресторан', 'Усан сан', 'Хүүхдийн талбай'], aiSummary: 'Гэр бүлд тохиромжтой, хүүхдийн тоглоомын талбай, морь унах боломжтой.', hostName: 'Сүхбат', hostInitials: 'СБ' },
  '5': { name: 'Номад Гэстхаус', city: 'Улаанбаатар', rating: 4.3, reviews: 64, price: 55000, color: '#E3D4B8', amenities: ['Wi-Fi', 'Угаалга'], aiSummary: 'Хямд, цэвэрхэн, backpacker-уудад тохиромжтой.', hostName: 'Оюунаа', hostInitials: 'ОА' },
  '6': { name: 'Блү Скай Хотел', city: 'Улаанбаатар', rating: 4.7, reviews: 298, price: 380000, color: '#B8C4E3', amenities: ['Wi-Fi', 'Ресторан', 'Бар', 'Фитнесс', 'Спа'], aiSummary: 'Хотын төвийн гайхалтай харагдацтай, өндөр зэрэглэлийн үйлчилгээ.', hostName: 'Энхжин', hostInitials: 'ЭЖ' },
  '7': { name: 'Хөвсгөл Лодж', city: 'Хөвсгөл', rating: 4.9, reviews: 176, price: 210000, color: '#C3D9D5', amenities: ['Ресторан', 'Завь', 'Явган аялал', 'Загас барих'], aiSummary: 'Хөвсгөл нуурын дэргэд, загас барих, завиар аялах гайхалтай боломж.', hostName: 'Батбаяр', hostInitials: 'ББ' },
  '8': { name: 'Алтай Гэр Кэмп', city: 'Баян-Өлгий', rating: 4.4, reviews: 53, price: 85000, color: '#D9D4C3', amenities: ['Ресторан', 'Бүргэд ажиглах'], aiSummary: 'Казах соёл, бүргэд ажиглах, уулын байгаль.', hostName: 'Айнур', hostInitials: 'АН' },
  '9': { name: 'Чингис Хаан Хотел', city: 'Улаанбаатар', rating: 4.6, reviews: 410, price: 290000, color: '#E3C4B8', amenities: ['Wi-Fi', 'Ресторан', 'Бар', 'Зогсоол'], aiSummary: 'Түүхэн хотелуудын нэг, хотын төвд байрладаг.', hostName: 'Мөнхбат', hostInitials: 'МБ' },
  '10': { name: 'Горхи Тэрэлж Рисорт', city: 'Тэрэлж', rating: 4.8, reviews: 192, price: 350000, color: '#C3E3D4', amenities: ['Wi-Fi', 'Ресторан', 'Спа', 'Морь унах', 'Явган аялал'], aiSummary: 'Тэрэлжийн хамгийн шилдэг рисорт. Байгаль, тайвшрал, luxury бүгд нэг дор.', hostName: 'Цэцэг', hostInitials: 'ЦЦ' },
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

  return (
    <View style={s.safe}>
      <ScrollView style={s.scrollView} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View style={[s.imageHeader, { backgroundColor: hotel.color }]}>
          <Text style={s.imageInitial}>{hotel.name.charAt(0)}</Text>
          <SafeAreaView style={s.overlay}>
            <Pressable style={s.overlayBtn} onPress={() => router.back()}>
              <Text style={s.overlayBtnText}>←</Text>
            </Pressable>
            <Pressable style={s.overlayBtn} onPress={() => setLiked(!liked)}>
              <Text style={s.overlayBtnText}>{liked ? '❤️' : '🤍'}</Text>
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={s.content}>
          {/* Name + Rating */}
          <Text style={s.hotelName}>{hotel.name}</Text>
          <View style={s.metaRow}>
            <Text style={s.metaCity}>📍 {hotel.city}</Text>
            <Text style={s.metaRating}>★ {hotel.rating} ({hotel.reviews})</Text>
          </View>

          {/* Trust Card */}
          <View style={s.trustCard}>
            <Text style={s.trustIcon}>🛡️</Text>
            <View style={s.trustContent}>
              <Text style={s.trustTitle}>Баталгаажсан буудал</Text>
              <Text style={s.trustText}>Бичиг баримт шалгагдсан, бодит үйл ажиллагаа баталгаажсан</Text>
            </View>
          </View>

          {/* Price Lock Card */}
          <View style={s.priceLockCard}>
            <Text style={s.priceLockIcon}>🔒</Text>
            <View style={s.priceLockContent}>
              <Text style={s.priceLockTitle}>Үнэ lock — ₮{hotel.price.toLocaleString()} хадгалагдана</Text>
              <Text style={s.priceLockText}>Энэ үнэ 24 цагийн дотор хүчинтэй</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={s.amenities}>
            {hotel.amenities.map((a) => (
              <View key={a} style={s.amenityPill}>
                <Text style={s.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          {/* AI Summary */}
          <View style={s.aiCard}>
            <Text style={s.aiLabel}>✨ AI хураангуй</Text>
            <Text style={s.aiText}>{hotel.aiSummary}</Text>
          </View>

          {/* Host Chat Preview */}
          <Pressable style={s.hostCard} onPress={() => router.push(`/chat/${id}`)}>
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
              <Text style={s.hostChatBtnText}>💬 Чатлах</Text>
            </View>
          </Pressable>

          {/* Reviews */}
          <Text style={s.sectionLabel}>Сүүлийн үнэлгээ</Text>
          {MOCK_REVIEWS.map((r) => (
            <View key={r.id} style={s.reviewCard}>
              <View style={s.reviewHeader}>
                <Text style={s.reviewAuthor}>{r.author}</Text>
                <Text style={s.reviewRating}>{'★'.repeat(r.rating)}</Text>
              </View>
              <Text style={s.reviewText}>{r.text}</Text>
            </View>
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={s.actionBar}>
        <Pressable style={s.actionPrimary} onPress={() => router.push(`/call/${id}`)}>
          <Text style={s.actionPrimaryText}>📞 Залгах</Text>
          <Text style={s.actionPrimaryPrice}>₮{hotel.price.toLocaleString()}</Text>
        </Pressable>
        <Pressable style={s.actionSecondary} onPress={() => router.push(`/payment/${id}`)}>
          <Text style={s.actionSecondaryText}>💳 QPay</Text>
        </Pressable>
        <Pressable style={s.actionChat} onPress={() => router.push(`/chat/${id}`)}>
          <Text style={s.actionChatText}>💬</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F3' },
  scrollView: { flex: 1 },
  imageHeader: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInitial: { fontSize: 72, fontWeight: '700', color: 'rgba(0,0,0,0.1)' },
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBtnText: { fontSize: 20, color: '#FFF' },
  content: { padding: 20 },
  hotelName: { fontSize: 22, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  metaCity: { fontSize: 13, color: '#888' },
  metaRating: { fontSize: 13, fontWeight: '600', color: '#F59E0B' },
  trustCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  trustIcon: { fontSize: 20 },
  trustContent: { flex: 1 },
  trustTitle: { fontSize: 13, fontWeight: '600', color: '#04342C', marginBottom: 2 },
  trustText: { fontSize: 12, color: '#04342C', lineHeight: 18 },
  priceLockCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  priceLockIcon: { fontSize: 18 },
  priceLockContent: { flex: 1 },
  priceLockTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  priceLockText: { fontSize: 12, color: '#888' },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  amenityPill: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amenityText: { fontSize: 12, color: '#555' },
  aiCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  aiLabel: { fontSize: 12, fontWeight: '600', color: '#0F6E56', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  aiText: { fontSize: 14, color: '#04342C', lineHeight: 21 },
  hostCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: { fontSize: 14, fontWeight: '600', color: '#04342C' },
  hostInfo: { flex: 1 },
  hostName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  hostStatus: { fontSize: 12, color: '#0F6E56' },
  hostChatBtn: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  hostChatBtnText: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 10 },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reviewAuthor: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  reviewRating: { fontSize: 12, color: '#F59E0B' },
  reviewText: { fontSize: 13, color: '#555', lineHeight: 19 },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    gap: 8,
  },
  actionPrimary: {
    flex: 1,
    backgroundColor: '#0F6E56',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionPrimaryText: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  actionPrimaryPrice: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  actionSecondary: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSecondaryText: { fontSize: 14, fontWeight: '500', color: '#1A1A1A' },
  actionChat: {
    width: 54,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionChatText: { fontSize: 20 },
});
