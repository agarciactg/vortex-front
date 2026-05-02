import { api } from './api'
import type { Comment, CommentCreate, CommentListOut } from '@/types/comment.types'

export const commentsService = {
  list: async (ticketId: string): Promise<CommentListOut> => {
    const { data } = await api.get<CommentListOut>(`/tickets/${ticketId}/comments`)
    return data
  },

  create: async (ticketId: string, payload: CommentCreate): Promise<Comment> => {
    const { data } = await api.post<Comment>(`/tickets/${ticketId}/comments`, payload)
    return data
  },

  delete: async (ticketId: string, commentId: string): Promise<void> => {
    await api.delete(`/tickets/${ticketId}/comments/${commentId}`)
  },
}