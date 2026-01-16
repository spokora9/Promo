import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DiscoveryMode = 'off' | 'active' | 'silent' | 'smart';

interface DiscoveryState {
  mode: DiscoveryMode;
  setMode: (mode: DiscoveryMode) => void;
  exposedShops: Set<string>;
  addExposedShop: (shopId: string) => void;
  hasBeenExposed: (shopId: string) => boolean;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      mode: 'off',
      exposedShops: new Set<string>(),

      setMode: (mode) => {
        set({ mode });
      },

      addExposedShop: (shopId) => {
        const exposedShops = new Set(get().exposedShops);
        exposedShops.add(shopId);
        set({ exposedShops });
      },

      hasBeenExposed: (shopId) => {
        return get().exposedShops.has(shopId);
      },
    }),
    {
      name: 'discovery-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Custom serialization for Set
      partialize: (state) => ({
        mode: state.mode,
        exposedShops: Array.from(state.exposedShops),
      }),
      // Custom deserialization for Set
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).exposedShops)) {
          state.exposedShops = new Set((state as any).exposedShops);
        }
      },
    }
  )
);
