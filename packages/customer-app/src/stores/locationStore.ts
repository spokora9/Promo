import { create } from 'zustand';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  city?: string;
  region?: string;
}

interface LocationState {
  currentLocation: LocationData | null;
  lastUpdateTime: number | null;
  isTracking: boolean;
  setCurrentLocation: (location: LocationData) => void;
  setIsTracking: (tracking: boolean) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  lastUpdateTime: null,
  isTracking: false,

  setCurrentLocation: (location) => {
    set({
      currentLocation: location,
      lastUpdateTime: Date.now(),
    });
  },

  setIsTracking: (tracking) => {
    set({ isTracking: tracking });
  },

  clearLocation: () => {
    set({
      currentLocation: null,
      lastUpdateTime: null,
      isTracking: false,
    });
  },
}));
