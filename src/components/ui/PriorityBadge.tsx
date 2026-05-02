import { Tag } from 'antd'
import type { TicketPriority } from '@/types/ticket.types'

const PRIORITY_CONFIG: Record<TicketPriority, { color: string; label: string }> = {
  low:      { color: 'default', label: 'Low' },
  medium:   { color: 'blue',    label: 'Medium' },
  high:     { color: 'orange',  label: 'High' },
  critical: { color: 'red',     label: 'Critical' },
}

export default function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const { color, label } = PRIORITY_CONFIG[priority]
  return <Tag color={color}>{label}</Tag>
}
