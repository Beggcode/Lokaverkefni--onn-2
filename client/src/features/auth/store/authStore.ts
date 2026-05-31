// remembers what the server said
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@ntv/shared'

type AuthStore = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: 'auth' }
  )
)
