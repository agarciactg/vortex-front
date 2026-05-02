'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Flex, Spin, Typography, Result, Button } from 'antd'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/store/auth.store'

const { Text } = Typography

const TOKEN_COOKIE = 'auth_token'
const TOKEN_LOCALSTORAGE = 'auth_token'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken } = useAuthStore()

  const token = searchParams.get('token')
  const error = searchParams.get('error')

  useEffect(() => {
    if (error) return

    if (token) {
      Cookies.set(TOKEN_COOKIE, token, { expires: 7, sameSite: 'strict' })

      localStorage.setItem(TOKEN_LOCALSTORAGE, token)

      setToken(token)

      router.replace('/dashboard')
    }
  }, [token, error, router, setToken])

  if (error) {
    const messages: Record<string, string> = {
      token_exchange_failed: 'Can\'t exchange token with Google. Try again.',
      userinfo_failed: 'Can\'t get user profile from Google. Try again.',
      access_denied: 'Access denied. Verify your account permissions.',
    }

    return (
      <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
        <Result
          status="error"
          title="Error to sign in"
          subTitle={messages[error] ?? 'An unexpected error occurred. Please try again.'}
          extra={
            <Button type="primary" onClick={() => router.replace('/login')}>
              Back to Login
            </Button>
          }
        />
      </Flex>
    )
  }

  return (
    <Flex vertical justify="center" align="center" gap="middle" style={{ minHeight: '100vh' }}>
      <Spin size="large" />
      <Text type="secondary">Signing in…</Text>
    </Flex>
  )
}
