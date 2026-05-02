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

  download: async (ticketId: string, attachment: Attachment): Promise<void> => {
    const response = await api.get(`/tickets/${ticketId}/attachments/${attachment.id}/download`, {
      responseType: 'blob',
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    link.setAttribute('download', attachment.original_filename)
    
    document.body.appendChild(link)
    link.click()
    
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  delete: async (ticketId: string, attachmentId: string): Promise<void> => {
    await api.delete(`/tickets/${ticketId}/attachments/${attachmentId}`)
  },
}