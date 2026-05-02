import { api } from './api'
import type { User } from '@/types/auth.types'

export interface UsersListOut {
  items: User[]
  total: number
}

export const usersService = {
  list: async (search?: string, skip = 0, limit = 50): Promise<UsersListOut> => {
    const { data } = await api.get<UsersListOut>('/users', {
      params: { search, skip, limit },
    })
    return data
  },
}
