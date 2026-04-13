import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from '@ihotel/config';
import type { Hotel } from '@ihotel/types';

interface HotelCardProps {
  hotel: Hotel;
  onPress?: () => void;
}

export function HotelCard({ hotel, onPress }: HotelCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <Image source={{ uri: hotel.image_url }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {hotel.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {hotel.city} · {(Math.random() * 5 + 0.5).toFixed(1)} км
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {hotel.review_count > 0
              ? `★ ${hotel.avg_rating} · ${hotel.review_count} үнэлгээ`
              : 'Үнэлгээ байхгүй'}
          </Text>
          <Text style={styles.price}>
            ₮{hotel.price_min.toLocaleString()}-аас
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#E1F5EE',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: fontWeights.medium as '500',
    color: colors.primary,
  },
});
