export type NotificationType = 'ticket_assigned' | 'comment_added' | 'status_changed'

export interface Notification {
  id: string
  user_id: string
  ticket_id: string
  type: NotificationType
  message: string
  is_read: boolean
  created_at: string
}

export interface NotificationsListOut {
  items: Notification[]
  total: number
  unread_count: number
}

export interface UnreadCountOut {
  unread_count: number
}
