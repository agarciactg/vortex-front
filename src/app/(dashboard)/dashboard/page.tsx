'use client'

import { useState } from 'react'
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Segmented,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  RightOutlined,
  SyncOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import type { Ticket } from '@/types/ticket.types'
import { useTickets } from '@/hooks/useTickets'
import { useAuthStore } from '@/store/auth.store'

const { Title, Text } = Typography

// Activity and members are still mocked for this UI as they don't have dedicated endpoints yet.
const MOCK_ACTIVITY = [
  { id: 1, user: 'Ana García',    action: 'created ticket',      target: 'Fix authentication bug',       time: '30m ago', color: '#3525cd' },
  { id: 2, user: 'Luis Martínez', action: 'moved to',            target: 'In Progress',                  time: '1h ago',  color: '#fa8c16' },
  { id: 3, user: 'Sara López',    action: 'commented on',        target: 'Update API documentation',     time: '2h ago',  color: '#52c41a' },
  { id: 4, user: 'Pedro Ruiz',    action: 'closed ticket',       target: 'Add CSV export to reports',    time: '3h ago',  color: '#8c8c8c' },
  { id: 5, user: 'Ana García',    action: 'assigned ticket to',  target: 'Luis Martínez',                time: '5h ago',  color: '#3525cd' },
]

const MOCK_MEMBERS = [
  { name: 'Ana García',    tickets: 2, color: '#3525cd' },
  { name: 'Luis Martínez', tickets: 1, color: '#fa8c16' },
  { name: 'Sara López',    tickets: 1, color: '#52c41a' },
  { name: 'Pedro Ruiz',    tickets: 1, color: '#722ed1' },
]

const columns: ColumnsType<Ticket> = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
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
    render: (status) => <StatusBadge status={status} />,
    filters: [
      { text: 'Open',        value: 'open' },
      { text: 'In Progress', value: 'in_progress' },
      { text: 'In Review',   value: 'in_review' },
      { text: 'Closed',      value: 'closed' },
    ],
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    key: 'priority',
    width: 120,
    render: (priority) => <PriorityBadge priority={priority} />,
    sorter: (a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 }
      return order[a.priority] - order[b.priority]
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
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
    width: 130,
    render: (date: string) => (
      <Tooltip title={new Date(date).toLocaleString()}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatRelative(date)}
        </Text>
      </Tooltip>
    ),
    sorter: (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    defaultSortOrder: 'ascend',
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

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function DashboardPage() {
  const [ticketView, setTicketView] = useState<'all' | 'mine'>('all')
  const user = useAuthStore((s) => s.user)

  // Fetch real tickets from backend
  const { data, isLoading } = useTickets({ limit: 50 })
  let tickets = data?.items || []

  if (ticketView === 'mine' && user) {
    tickets = tickets.filter(
      (t) => t.assignee?.id === user.id || t.author?.id === user.id
    )
  }

  const openCount     = tickets.filter(t => t.status === 'open').length
  const progressCount = tickets.filter(t => t.status === 'in_progress').length
  const reviewCount   = tickets.filter(t => t.status === 'in_review').length
  const closedCount   = tickets.filter(t => t.status === 'closed').length
  const displayTotal  = tickets.length
  const pctTotal      = displayTotal || 1 // Avoid completely dividing by zero

  return (
    <Flex vertical gap="large">

      <Flex vertical gap="small">
        <Breadcrumb
          items={[
            { title: 'Home' },
            { title: 'Dashboard' },
          ]}
        />
        <Flex justify="space-between" align="center" wrap="wrap" gap="small">
          <Flex vertical gap={2}>
            <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
            <Text type="secondary">Overview of your team's ticketing activity</Text>
          </Flex>
          <Link href="/tickets">
            <Button type="primary" icon={<PlusOutlined />}>
              New Ticket
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Text type="secondary">Total Tickets</Text>}
              value={data?.total || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Text type="secondary">Open</Text>}
              value={openCount}
              styles={{ content: { color: '#1677ff' } }}
              prefix={<FolderOpenOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Text type="secondary">In Progress</Text>}
              value={progressCount}
              styles={{ content: { color: '#fa8c16' } }}
              prefix={<SyncOutlined spin />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title={<Text type="secondary">Closed</Text>}
              value={closedCount}
              styles={{ content: { color: '#52c41a' } }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>

        <Col xs={24} lg={16}>
          <Card
            title={
              <Flex justify="space-between" align="center" wrap="wrap" gap="small">
                <Space>
                  <Text strong>Recent Tickets</Text>
                  <Badge count={displayTotal} color="blue" />
                </Space>
                <Segmented
                  size="small"
                  value={ticketView}
                  onChange={(v) => setTicketView(v as 'all' | 'mine')}
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'Mine', value: 'mine' },
                  ]}
                />
              </Flex>
            }
            extra={
              <Link href="/tickets">
                <Button type="link" size="small" icon={<RightOutlined />} iconPlacement="end">
                  View all
                </Button>
              </Link>
            }
          >
            <Table<Ticket>
              dataSource={tickets}
              columns={columns}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5, size: 'small', showSizeChanger: false }}
              scroll={{ x: 600 }}
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Flex vertical gap="middle">

            <Card title={<Text strong>Status Breakdown</Text>}>
              <Flex vertical gap="middle">
                <Flex justify="space-between" align="center">
                  <Space>
                    <Tag color="blue">Open</Tag>
                    <Text type="secondary">{openCount} tickets</Text>
                  </Space>
                  <Text strong>{Math.round((openCount / pctTotal) * 100)}%</Text>
                </Flex>
                <Progress
                  percent={Math.round((openCount / pctTotal) * 100)}
                  showInfo={false}
                  strokeColor="#1677ff"
                  size="small"
                />

                <Flex justify="space-between" align="center">
                  <Space>
                    <Tag color="orange">In Progress</Tag>
                    <Text type="secondary">{progressCount} tickets</Text>
                  </Space>
                  <Text strong>{Math.round((progressCount / pctTotal) * 100)}%</Text>
                </Flex>
                <Progress
                  percent={Math.round((progressCount / pctTotal) * 100)}
                  showInfo={false}
                  strokeColor="#fa8c16"
                  size="small"
                />

                <Flex justify="space-between" align="center">
                  <Space>
                    <Tag color="purple">In Review</Tag>
                    <Text type="secondary">{reviewCount} tickets</Text>
                  </Space>
                  <Text strong>{Math.round((reviewCount / pctTotal) * 100)}%</Text>
                </Flex>
                <Progress
                  percent={Math.round((reviewCount / pctTotal) * 100)}
                  showInfo={false}
                  strokeColor="#722ed1"
                  size="small"
                />

                <Flex justify="space-between" align="center">
                  <Space>
                    <Tag>Closed</Tag>
                    <Text type="secondary">{closedCount} tickets</Text>
                  </Space>
                  <Text strong>{Math.round((closedCount / pctTotal) * 100)}%</Text>
                </Flex>
                <Progress
                  percent={Math.round((closedCount / pctTotal) * 100)}
                  showInfo={false}
                  strokeColor="#8c8c8c"
                  size="small"
                />
              </Flex>
            </Card>

            <Card
              title={
                <Space>
                  <ClockCircleOutlined />
                  <Text strong>Recent Activity</Text>
                </Space>
              }
            >
              <Flex vertical gap="middle">
                {MOCK_ACTIVITY.map((item) => (
                  <Flex key={item.id} gap="small" align="flex-start" style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: item.color }} />
                    <Flex vertical>
                      <Text style={{ fontSize: 13 }}>
                        <Text strong style={{ fontSize: 13 }}>{item.user}</Text>
                        {' '}{item.action}{' '}
                        <Text italic style={{ fontSize: 13 }}>{item.target}</Text>
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Text>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Card>

            <Card
              title={
                <Space>
                  <TeamOutlined />
                  <Text strong>Active Members</Text>
                </Space>
              }
            >
              <Flex vertical gap="middle">
                {MOCK_MEMBERS.map((member, idx) => (
                  <Flex key={idx} justify="space-between" align="center" style={{ paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <Flex gap="small" align="center">
                      <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: member.color }} />
                      <Text style={{ fontSize: 13 }}>{member.name}</Text>
                    </Flex>
                    <Badge count={member.tickets} color="blue" />
                  </Flex>
                ))}
              </Flex>
            </Card>

          </Flex>
        </Col>
      </Row>
    </Flex>
  )
}
