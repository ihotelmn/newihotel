import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Heart, Star, CheckCircle2 } from 'lucide-react-native';
import { colors, radius, fontWeights, spacing, easing } from '@ihotel/config';
import { useHaptic } from './hooks/useHaptic';
import type { Hotel } from '@ihotel/types';

interface HotelCardProps {
  hotel: Hotel;
  onPress?: () => void;
  onToggleSave?: (id: string) => void;
  saved?: boolean;
}

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RTt7t5';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function HotelCardInner({
  hotel,
  onPress,
  onToggleSave,
  saved = false,
}: HotelCardProps) {
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const haptic = useHaptic();
  const lastTap = useSharedValue(0);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, easing.out);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, easing.out);
  }, []);

  const handleCardPress = useCallback(() => {
    haptic.light();
    onPress?.();
  }, [onPress]);

  const handleHeartPress = useCallback(() => {
    haptic.light();
    if (!saved) {
      heartScale.value = withSequence(
        withSpring(1.25, { damping: 8, stiffness: 200 }),
        withSpring(0.95, { damping: 10, stiffness: 200 }),
        withSpring(1, easing.out),
      );
    } else {
      heartScale.value = withSequence(
        withSpring(0.85, { damping: 10, stiffness: 200 }),
        withSpring(1, easing.out),
      );
    }
    onToggleSave?.(hotel.id);
  }, [saved, hotel.id, onToggleSave]);

  const handleImagePress = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.value < 300) {
      haptic.light();
      if (!saved) {
        heartScale.value = withSequence(
          withSpring(1.25, { damping: 8, stiffness: 200 }),
          withSpring(0.95, { damping: 10, stiffness: 200 }),
          withSpring(1, easing.out),
        );
      }
      onToggleSave?.(hotel.id);
    }
    lastTap.value = now;
  }, [saved, hotel.id, onToggleSave]);

  const isVerified = hotel.avg_rating > 4;

  return (
    <AnimatedPressable
      style={[styles.container, animatedCardStyle]}
      onPress={handleCardPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {/* Image */}
      <Pressable onPress={handleImagePress} style={styles.imageWrap}>
        <Image
          source={{ uri: hotel.image_url }}
          placeholder={{ blurhash: BLURHASH }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {/* Heart */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handleHeartPress();
          }}
          style={styles.heartBtn}
          hitSlop={8}
        >
          <Animated.View style={animatedHeartStyle}>
            <Heart
              size={14}
              color={saved ? '#E24B4A' : '#666'}
              fill={saved ? '#E24B4A' : 'transparent'}
              strokeWidth={2}
            />
          </Animated.View>
        </Pressable>
      </Pressable>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {hotel.name}
          </Text>
          {isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle2
                size={12}
                color={colors.primary}
                strokeWidth={2.5}
              />
            </View>
          )}
        </View>

        <Text style={styles.meta} numberOfLines={1}>
          {hotel.city}
        </Text>

        {hotel.avg_rating > 0 && (
          <View style={styles.ratingRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
            <Text style={styles.ratingText}>
              {hotel.avg_rating.toFixed(1)}
            </Text>
            <Text style={styles.ratingCount}>
              ({hotel.review_count} үнэлгээ)
            </Text>
          </View>
        )}

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₮{hotel.price_min.toLocaleString()}
          </Text>
          <Text style={styles.priceUnit}>/шөнө</Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export const HotelCard = React.memo(HotelCardInner, (prev, next) => {
  return prev.hotel.id === next.hotel.id && prev.saved === next.saved;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border as string,
    padding: spacing.md,
    gap: spacing.md,
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: 88,
    height: 88,
  },
  heartBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    fontSize: 15,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  ratingCount: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: fontWeights.medium as '500',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
