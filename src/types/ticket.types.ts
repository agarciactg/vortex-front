export type TicketStatus   = 'open' | 'in_progress' | 'in_review' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface UserSummary {
  id: string
  name: string
  email: string
  avatar_url: string | null
}

export interface Ticket {
  id: string
  title: string
  description: string | null
  status: TicketStatus
  priority: TicketPriority
  author: UserSummary
  assignee: UserSummary | null
  created_at: string
  updated_at: string
}

export interface TicketListOut {
  items: Ticket[]
  total: number
}

// ── Request payloads (mirror backend schemas) ──────────────────────────────

export interface TicketCreate {
  title: string
  description?: string | null
  priority?: TicketPriority
  assignee_id?: string | null
}

export interface TicketUpdate {
  title?: string
  description?: string | null
  priority?: TicketPriority
  assignee_id?: string | null
}

export interface TicketAssign {
  assignee_id: string | null
}

export interface TicketStatusChange {
  status: TicketStatus
}
