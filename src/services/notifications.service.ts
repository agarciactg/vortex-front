import { api } from './api'
import type { NotificationsListOut, UnreadCountOut, Notification } from '@/types/notification.types'

export const notificationsService = {
  list: async (params: { only_unread?: boolean; skip?: number; limit?: number } = {}): Promise<NotificationsListOut> => {
    const { data } = await api.get<NotificationsListOut>('/notifications', { params })
    return data
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<UnreadCountOut>('/notifications/unread-count')
    return data.unread_count
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const { data } = await api.patch<Notification>(`/notifications/${notificationId}/read`)
    return data
  },

  markAllAsRead: async (): Promise<{ updated: number; message: string }> => {
    const { data } = await api.patch('/notifications/read-all')
    return data
  },
}
