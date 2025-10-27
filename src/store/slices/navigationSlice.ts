import { create } from 'zustand';
import type { NavigationState } from '../../types/finance';

interface NavigationSlice extends NavigationState {
  setRoute: (route: string) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationSlice>((set, get) => ({
  currentRoute: '/welcome',
  previousRoute: undefined,
  setRoute: (route) => set({
    previousRoute: get().currentRoute,
    currentRoute: route,
  }),
  goBack: () => {
    const { previousRoute } = get();
    if (previousRoute) {
      set({
        currentRoute: previousRoute,
        previousRoute: undefined,
      });
    }
  },
}));

