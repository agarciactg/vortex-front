'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'


export default function AuthProvider({ children }: { children: ReactNode }) {
  const { setLoading } = useAuthStore()

  useEffect(() => {
    setLoading(false)
  }, [setLoading])

  return <>{children}</>
}
