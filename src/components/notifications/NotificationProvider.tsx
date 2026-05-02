'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { message as antMessage } from 'antd'
import { useAuthStore } from '@/store/auth.store'

interface NotificationContextType {
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  const queryClient = useQueryClient()
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.close()
      }
      return
    }

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, '') || 'localhost:8000'
      const wsUrl = `${protocol}//${host}/api/v1/notifications/ws/${user.id}?token=${token}`

      const ws = new WebSocket(wsUrl)
      socketRef.current = ws

      ws.onopen = () => {
        console.log('Notification WebSocket connected')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === 'ping') return

        antMessage.info({
          content: data.message,
          duration: 5,
        })

        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      }

      ws.onclose = (event) => {
        console.log('Notification WebSocket closed:', event.reason)
        if (event.code !== 1000 && user && token) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000)
        }
      }

      ws.onerror = (error) => {
        console.error('Notification WebSocket error:', error)
      }
    }

    connect()

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [user, token, queryClient])

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
