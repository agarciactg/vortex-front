import { Tag } from 'antd'
import type { TicketStatus } from '@/types/ticket.types'

const STATUS_CONFIG: Record<TicketStatus, { color: string; label: string }> = {
  open:        { color: 'blue',    label: 'Open' },
  in_progress: { color: 'orange',  label: 'In Progress' },
  in_review:   { color: 'purple',  label: 'In Review' },
  closed:      { color: 'default', label: 'Closed' },
}

export default function StatusBadge({ status }: { status: TicketStatus }) {
  const { color, label } = STATUS_CONFIG[status]
  return <Tag color={color}>{label}</Tag>
}
