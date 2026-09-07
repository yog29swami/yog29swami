import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  favorites: 'tryon.favorites',
  isPro: 'tryon.isPro',
  onboarded: 'tryon.onboarded',
} as const;

export async function loadFavorites(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEYS.favorites);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export async function saveFavorites(favorites: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(favorites));
}

export async function loadIsPro(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.isPro);
  return raw === 'true';
}

export async function saveIsPro(isPro: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.isPro, isPro ? 'true' : 'false');
}

export async function loadOnboarded(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.onboarded);
  return raw === 'true';
}

export async function saveOnboarded(): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboarded, 'true');
}
