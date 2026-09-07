export type ProductCategory = 'glasses' | 'earrings' | 'necklace';

export interface ColorVariant {
  id: string;
  label: string;
  hex: string;
  /** Optional secondary hex for a metallic/gradient look (e.g. gold rim, silver chain). */
  hexSecondary?: string;
}

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  brandStory: string;
  isPremium: boolean;
  colors: ColorVariant[];
  /** Relative size multiplier applied on top of the auto face-fit scale. */
  baseScale: number;
}

export interface FaceLandmarks {
  leftEyePosition: { x: number; y: number } | null;
  rightEyePosition: { x: number; y: number } | null;
  noseBasePosition: { x: number; y: number } | null;
  leftEarPosition: { x: number; y: number } | null;
  rightEarPosition: { x: number; y: number } | null;
  bounds: { x: number; y: number; width: number; height: number } | null;
  rollAngle: number;
}

export interface OverlayTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}
