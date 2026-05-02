'use client'

import {
  Avatar,
  Button,
  Flex,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import {
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import type { Ticket } from '@/types/ticket.types'

const { Text } = Typography

interface TicketTableProps extends TableProps<Ticket> {
  onView?: (ticket: Ticket) => void
}

export default function TicketTable({ onView, ...props }: TicketTableProps) {
  const columns: ColumnsType<Ticket> = [
    {
      title: 'Ticket Info',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string, record) => (
        <Flex vertical gap={2}>
          <Link href={`/tickets/${record.id}`}>
            <Text strong style={{ color: '#3525cd' }}>{title}</Text>
          </Link>
          <Text type="secondary" style={{ fontSize: 12 }}>
            #{record.id.substring(0, 8)} · by {record.author?.name || 'Unknown'}
          </Text>
        </Flex>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (priority) => <PriorityBadge priority={priority} />,
      sorter: (a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3 }
        return order[a.priority as keyof typeof order] - order[b.priority as keyof typeof order]
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 160,
      render: (assignee) =>
        assignee ? (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text>{assignee.name}</Text>
          </Space>
        ) : (
          <Text type="secondary">Unassigned</Text>
        ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 130,
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(date).toLocaleDateString()}
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    },
    {
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Link href={`/tickets/${record.id}`}>
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Link>
      ),
    },
  ]

  return (
    <Table<Ticket>
      columns={columns}
      rowKey="id"
      size="middle"
      scroll={{ x: 800 }}
      {...props}
    />
  )
}
