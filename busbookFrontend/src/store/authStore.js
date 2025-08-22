import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      
      setAuth: (token, user) => set({ token, user }),
      
      logout: () => set({ token: null, user: null }),
      
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
)