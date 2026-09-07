import { create } from 'zustand';
import { loadFavorites, loadIsPro, saveFavorites, saveIsPro } from '../services/storage';

interface AppState {
  favorites: string[];
  isPro: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setPro: (isPro: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  favorites: [],
  isPro: false,
  hydrated: false,

  hydrate: async () => {
    const [favorites, isPro] = await Promise.all([loadFavorites(), loadIsPro()]);
    set({ favorites, isPro, hydrated: true });
  },

  toggleFavorite: (productId: string) => {
    const current = get().favorites;
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    set({ favorites: next });
    void saveFavorites(next);
  },

  isFavorite: (productId: string) => get().favorites.includes(productId),

  setPro: (isPro: boolean) => {
    set({ isPro });
    void saveIsPro(isPro);
  },
}));
