import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'

export function useUsers(search?: string) {
  return useQuery({
    queryKey: ['users', search],
    queryFn: async () => {
      const result = await usersService.list(search)
      return result.items
    },
  })
}
