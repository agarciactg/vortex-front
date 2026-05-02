import type { UserSummary } from './ticket.types'

export interface CommentCreate {
  content: string
}

export interface Comment {
  id: string
  content: string
  author: UserSummary
  ticket_id: string
  created_at: string
}

export interface CommentListOut {
  items: Comment[]
  total: number
}
