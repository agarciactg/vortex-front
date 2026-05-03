import { api } from './api'
import { ChatApiResponse, HistoryOut, SendMessagePayload } from '@/types/chat.types'

export const aiService = {
  chat: async (payload: SendMessagePayload): Promise<ChatApiResponse> => {
    const body = {
      message: payload.message,
      conversation_id: payload.conversationId,
    }
    const response = await api.post<ChatApiResponse>('/ai/chat', body)
    return response.data
  },

  getHistory: async (conversationId: string, skip = 0, limit = 50): Promise<HistoryOut> => {
    const response = await api.get<HistoryOut>('/ai/history', {
      params: { conversation_id: conversationId, skip, limit },
    })
    return response.data
  },
}
