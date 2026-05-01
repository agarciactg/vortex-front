import { create } from 'zustand'
import Cookies from 'js-cookie'
import type { AuthState, User } from '@/types/auth.types'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get(TOKEN_KEY) ?? null,
  isAuthenticated: !!Cookies.get(TOKEN_KEY),
  isLoading: true,

  setUser: (user: User | null) =>
    set({ user, isAuthenticated: !!user }),

  setToken: (token: string | null) => {
    if (token) {
      Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict' })
    } else {
      Cookies.remove(TOKEN_KEY)
    }
    set({ token, isAuthenticated: !!token })
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  logout: () => {
    Cookies.remove(TOKEN_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
