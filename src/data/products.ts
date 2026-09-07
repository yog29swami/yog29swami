import { Product } from '../types';

const glassesColors = [
  { id: 'black', label: 'Matte Black', hex: '#1B1B1F' },
  { id: 'tortoise', label: 'Tortoise', hex: '#7A4A2B' },
  { id: 'gold', label: 'Gold', hex: '#D4AF37' },
  { id: 'rose', label: 'Rose Gold', hex: '#E5B4B0' },
  { id: 'clear', label: 'Crystal Clear', hex: '#CFE8FF' },
];

const metalColors = [
  { id: 'gold', label: 'Gold', hex: '#D4AF37', hexSecondary: '#F6E27A' },
  { id: 'silver', label: 'Silver', hex: '#C9CDD3', hexSecondary: '#F1F3F5' },
  { id: 'rose-gold', label: 'Rose Gold', hex: '#E0AFA0', hexSecondary: '#F5D6C8' },
  { id: 'black', label: 'Black Rhodium', hex: '#22242A', hexSecondary: '#43464F' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'g-aviator',
    category: 'glasses',
    name: 'Classic Aviator',
    brandStory: 'Timeless teardrop lenses with a thin double bridge.',
    isPremium: false,
    colors: glassesColors,
    baseScale: 1.05,
  },
  {
    id: 'g-round',
    category: 'glasses',
    name: 'Retro Round',
    brandStory: 'Circular lenses inspired by 60s intellectual chic.',
    isPremium: false,
    colors: glassesColors,
    baseScale: 1.0,
  },
  {
    id: 'g-square',
    category: 'glasses',
    name: 'Bold Square',
    brandStory: 'Strong angular frame for a confident look.',
    isPremium: true,
    colors: glassesColors,
    baseScale: 1.02,
  },
  {
    id: 'g-cateye',
    category: 'glasses',
    name: 'Cat Eye',
    brandStory: 'Upswept corners with a vintage glamour edge.',
    isPremium: true,
    colors: glassesColors,
    baseScale: 1.0,
  },
  {
    id: 'e-hoop',
    category: 'earrings',
    name: 'Classic Hoops',
    brandStory: 'Everyday hoops that catch the light beautifully.',
    isPremium: false,
    colors: metalColors,
    baseScale: 1.0,
  },
  {
    id: 'e-drop',
    category: 'earrings',
    name: 'Crystal Drop',
    brandStory: 'A single sparkling drop for evening elegance.',
    isPremium: false,
    colors: metalColors,
    baseScale: 1.0,
  },
  {
    id: 'e-stud',
    category: 'earrings',
    name: 'Solitaire Studs',
    brandStory: 'Minimal studs that work with any outfit.',
    isPremium: true,
    colors: metalColors,
    baseScale: 0.85,
  },
  {
    id: 'n-chain',
    category: 'necklace',
    name: 'Delicate Chain',
    brandStory: 'A fine chain layered for a subtle everyday shine.',
    isPremium: false,
    colors: metalColors,
    baseScale: 1.0,
  },
  {
    id: 'n-pendant',
    category: 'necklace',
    name: 'Statement Pendant',
    brandStory: 'A bold centerpiece pendant that draws the eye.',
    isPremium: true,
    colors: metalColors,
    baseScale: 1.05,
  },
  {
    id: 'n-choker',
    category: 'necklace',
    name: 'Modern Choker',
    brandStory: 'A close-fit choker for a sleek modern silhouette.',
    isPremium: true,
    colors: metalColors,
    baseScale: 0.95,
  },
];

export const CATEGORY_LABELS: Record<Product['category'], string> = {
  glasses: 'Glasses',
  earrings: 'Earrings',
  necklace: 'Necklaces',
};

export function getProductsByCategory(category: Product['category']): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
