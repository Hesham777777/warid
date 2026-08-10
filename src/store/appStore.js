import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// حالة التطبيق العامة (الوضع الليلي، الإعدادات)
export const useAppStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      userSettings: {
        biometricEnabled: false,
        notificationsEnabled: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          userSettings: { ...state.userSettings, ...newSettings },
        })),
    }),
    {
      name: 'app-storage', // مفتاح التخزين
    }
  )
);
