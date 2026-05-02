import type { Attachment, AttachmentListOut } from '@/types/attachment.types'
import { api } from './api'

export const attachmentsService = {
  list: async (ticketId: string): Promise<AttachmentListOut> => {
    const { data } = await api.get<AttachmentListOut>(`/tickets/${ticketId}/attachments`)
    return data
  },

  upload: async (ticketId: string, file: File): Promise<Attachment> => {
    const form = new FormData()
    form.append('file', file)
    const { data } = await api.post<Attachment>(`/tickets/${ticketId}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  download: (ticketId: string, attachmentId: string): string =>
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tickets/${ticketId}/attachments/${attachmentId}/download`,

  delete: async (ticketId: string, attachmentId: string): Promise<void> => {
    await api.delete(`/tickets/${ticketId}/attachments/${attachmentId}`)
  },
}