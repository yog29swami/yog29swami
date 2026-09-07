import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';
import { Product } from '../types';
import { GlassesOverlay } from './overlays/GlassesOverlay';
import { EarringOverlay } from './overlays/EarringOverlay';
import { NecklaceOverlay } from './overlays/NecklaceOverlay';
import { ProBadge } from './ProBadge';

interface Props {
  product: Product;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function ProductCard({ product, isFavorite, onPress, onToggleFavorite }: Props) {
  const previewColor = product.colors[0];

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.previewBox}>
        {product.category === 'glasses' && <GlassesOverlay size={110} color={previewColor} />}
        {product.category === 'earrings' && <EarringOverlay size={60} color={previewColor} variant={product.id} />}
        {product.category === 'necklace' && <NecklaceOverlay width={110} color={previewColor} variant={product.id} />}
      </View>

      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.story} numberOfLines={1}>
            {product.brandStory}
          </Text>
        </View>
        {product.isPremium && <ProBadge />}
      </View>

      <Pressable onPress={onToggleFavorite} hitSlop={8} style={styles.heart}>
        <Text style={{ fontSize: 18 }}>{isFavorite ? '❤️' : '🤍'}</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewBox: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  story: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
