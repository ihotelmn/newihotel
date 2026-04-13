import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, fontWeights } from '@ihotel/config';

interface CardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export function Card({ title, subtitle, imageUrl }: CardProps) {
  return (
    <View style={styles.container}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border as string,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: fontWeights.medium as '500',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: fontWeights.regular as '400',
    color: colors.textSecondary,
    marginTop: 4,
  },
});
