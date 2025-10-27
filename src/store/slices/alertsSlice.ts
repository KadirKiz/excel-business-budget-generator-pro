import { create } from 'zustand';
import type { Alert } from '../../lib/alerts';

interface AlertsSlice {
  alerts: Alert[];
  lastEvaluatedAt?: string;
  
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
}

export const useAlertsStore = create<AlertsSlice>((set) => ({
  alerts: [],
  lastEvaluatedAt: undefined,

  setAlerts: (alerts) => set({ alerts, lastEvaluatedAt: new Date().toISOString() }),
  
  addAlert: (alert) => set((state) => {
    // Check if alert already exists (same id)
    if (state.alerts.some((a) => a.id === alert.id)) return state;
    return {
      alerts: [...state.alerts, alert],
      lastEvaluatedAt: new Date().toISOString(),
    };
  }),

  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a)),
  })),

  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.filter((a) => a.id !== id),
  })),

  clearAll: () => set({ alerts: [], lastEvaluatedAt: undefined }),
}));

// Helper to get unread count
export function selectUnreadCount(state: AlertsSlice): number {
  return state.alerts.filter((a) => !a.resolved).length;
}

