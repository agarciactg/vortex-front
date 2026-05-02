import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { ticketsService, type ListTicketsParams } from '@/services/tickets.service'
import { queryKeys } from '@/lib/queryKeys'
import type { Ticket, TicketCreate, TicketUpdate, TicketAssign, TicketStatusChange } from '@/types/ticket.types'

export function useTickets(params: ListTicketsParams = {}) {
  return useQuery({
    queryKey: queryKeys.tickets.list(params as Record<string, unknown>),
    queryFn: () => ticketsService.list(params),
    staleTime: 30_000,
  })
}

export function useTicket(ticketId: string, options?: Partial<UseQueryOptions<Ticket>>) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(ticketId),
    queryFn: () => ticketsService.getById(ticketId),
    enabled: !!ticketId,
    staleTime: 30_000,
    ...options,
  })
}

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TicketCreate) => ticketsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tickets.all })
    },
  })
}

export function useUpdateTicket(ticketId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TicketUpdate) => ticketsService.update(ticketId, payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.tickets.detail(ticketId), updated)
      qc.invalidateQueries({ queryKey: queryKeys.tickets.all })
    },
  })
}

export function useDeleteTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ticketId: string) => ticketsService.remove(ticketId),
    onSuccess: (_data, ticketId) => {
      qc.removeQueries({ queryKey: queryKeys.tickets.detail(ticketId) })
      qc.invalidateQueries({ queryKey: queryKeys.tickets.all })
    },
  })
}

export function useAssignTicket(ticketId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TicketAssign) => ticketsService.assign(ticketId, payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.tickets.detail(ticketId), updated)
      qc.invalidateQueries({ queryKey: queryKeys.tickets.all })
    },
  })
}

export function useChangeTicketStatus(ticketId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TicketStatusChange) => ticketsService.changeStatus(ticketId, payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.tickets.detail(ticketId), updated)
      qc.invalidateQueries({ queryKey: queryKeys.tickets.all })
    },
  })
}
