export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface SendMessagePayload {
  message: string
  conversationId?: string
}

export interface ToolCallOut {
  tool_name: string
  input: any
  result: string
}

export interface ChatApiResponse {
  reply: string
  conversation_id: string
  actions: ToolCallOut[]
}

export interface MessageOut {
  id: string
  role: MessageRole
  content: string | null
  tool_name: string | null
  created_at: string
}

export interface HistoryOut {
  items: MessageOut[]
  total: number
  conversation_id: string
}
