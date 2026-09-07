import React from 'react';
import { View } from 'react-native';
import { ColorVariant, Product } from '../types';
import { OutfitGeometry } from '../utils/overlayGeometry';
import { GlassesOverlay } from './overlays/GlassesOverlay';
import { EarringOverlay } from './overlays/EarringOverlay';
import { NecklaceOverlay } from './overlays/NecklaceOverlay';

interface Props {
  product: Product;
  color: ColorVariant;
  geometry: OutfitGeometry;
}

/**
 * Lays out the correct try-on piece(s) for a product category around a shared
 * local origin (0,0) so the parent DraggableOverlay can move/scale/rotate the
 * whole outfit as one rigid group.
 */
export function OutfitLayer({ product, color, geometry }: Props) {
  if (product.category === 'glasses') {
    const w = geometry.glassesWidth * product.baseScale;
    const h = w * 0.42;
    return (
      <View style={{ position: 'absolute', left: -w / 2, top: -h / 2 }}>
        <GlassesOverlay size={w} color={color} />
      </View>
    );
  }

  if (product.category === 'earrings') {
    const size = geometry.earringSize * product.baseScale;
    return (
      <>
        <View style={{ position: 'absolute', left: -geometry.earringOffsetX - size / 2, top: geometry.earringOffsetY }}>
          <EarringOverlay size={size} color={color} variant={product.id} />
        </View>
        <View style={{ position: 'absolute', left: geometry.earringOffsetX - size / 2, top: geometry.earringOffsetY }}>
          <EarringOverlay size={size} color={color} variant={product.id} />
        </View>
      </>
    );
  }

  const w = geometry.necklaceWidth * product.baseScale;
  return (
    <View style={{ position: 'absolute', left: -w / 2, top: geometry.necklaceOffsetY }}>
      <NecklaceOverlay width={w} color={color} variant={product.id} />
    </View>
  );
}
