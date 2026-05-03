'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, setUser, setLoading, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      if (isAuthenticated && !user) {
        try {
          const userData = await authService.me()
          setUser(userData)
        } catch (error) {
          console.error("Failed to fetch user", error)
          logout()
          router.push('/login')
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [isAuthenticated, user, setUser, setLoading, logout, router])

  return <>{children}</>
}
