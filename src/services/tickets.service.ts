import { api } from './api'
import type {
  Ticket,
  TicketListOut,
  TicketCreate,
  TicketUpdate,
  TicketAssign,
  TicketStatusChange,
} from '@/types/ticket.types'

export interface ListTicketsParams {
  status?: string
  priority?: string
  assignee_id?: string
  author_id?: string
  search?: string
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
  skip?: number
  limit?: number
}

export const ticketsService = {
  list: async (params: ListTicketsParams = {}): Promise<TicketListOut> => {
    const { data } = await api.get<TicketListOut>('/tickets', { params })
    return data
  },
  create: async (payload: TicketCreate): Promise<Ticket> => {
    const { data } = await api.post<Ticket>('/tickets', payload)
    return data
  },
  getById: async (ticketId: string): Promise<Ticket> => {
    const { data } = await api.get<Ticket>(`/tickets/${ticketId}`)
    return data
  },
  update: async (ticketId: string, payload: TicketUpdate): Promise<Ticket> => {
    const { data } = await api.patch<Ticket>(`/tickets/${ticketId}`, payload)
    return data
  },
  remove: async (ticketId: string): Promise<void> => {
    await api.delete(`/tickets/${ticketId}`)
  },
  assign: async (ticketId: string, payload: TicketAssign): Promise<Ticket> => {
    const { data } = await api.patch<Ticket>(`/tickets/${ticketId}/assign`, payload)
    return data
  },
  changeStatus: async (ticketId: string, payload: TicketStatusChange): Promise<Ticket> => {
    const { data } = await api.patch<Ticket>(`/tickets/${ticketId}/status`, payload)
    return data
  },
}
