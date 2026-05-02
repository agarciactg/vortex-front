import type { UserSummary } from './ticket.types'

export interface Attachment {
  id: string
  original_filename: string
  file_size: number
  content_type: string
  ticket_id: string
  uploader: UserSummary
  created_at: string
}

export interface AttachmentListOut {
  items: Attachment[]
  total: number
}
