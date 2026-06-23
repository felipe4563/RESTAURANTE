import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      usuario: null,
      setAuth: ({ token, refreshToken, usuario }) =>
        set({ token, refreshToken, usuario }),
      setToken: (token) => set({ token }),
      logout: () => set({ token: null, refreshToken: null, usuario: null }),
    }),
    { name: 'auth' }
  )
);
