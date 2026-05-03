import { api } from './api'
import type { User } from '@/types/auth.types'

export const authService = {
  me: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
}