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
  Input,
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
  AppstoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  SyncOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import type { Ticket } from '@/types/ticket.types'
import { useTickets, useCreateTicket } from '@/hooks/useTickets'
import { useAuthStore } from '@/store/auth.store'
import CreateTicketModal from '@/components/tickets/CreateTicketModal'
import TicketKanban from '@/components/tickets/TicketKanban'

const { Title, Text } = Typography

import TicketTable from '@/components/tickets/TicketTable'

export default function DashboardPage() {
  const [ticketView, setTicketView] = useState<'all' | 'mine'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const user = useAuthStore((s) => s.user)

  const { data, isLoading } = useTickets({ limit: 50 })
  let tickets = data?.items || []

  if (ticketView === 'mine' && user) {
    tickets = tickets.filter(
      (t) => t.assignee?.id === user.id || t.author?.id === user.id
    )
  }

  if (searchText) {
    const lowSearch = searchText.toLowerCase()
    tickets = tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(lowSearch) ||
        t.description?.toLowerCase().includes(lowSearch) ||
        t.id.toLowerCase().includes(lowSearch)
    )
  }

  const openCount     = tickets.filter(t => t.status === 'open').length
  const progressCount = tickets.filter(t => t.status === 'in_progress').length
  const reviewCount   = tickets.filter(t => t.status === 'in_review').length
  const closedCount   = tickets.filter(t => t.status === 'closed').length
  const displayTotal  = tickets.length
  const pctTotal      = displayTotal || 1

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
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Ticket
          </Button>
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
                <Space size="middle">
                  <Text strong>Recent Tickets</Text>
                  <Input
                    placeholder="Search tickets..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    size="small"
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Badge count={tickets.length} color="blue" />
                </Space>
                <Space>
                  <Segmented
                    size="small"
                    value={viewMode}
                    onChange={(v) => setViewMode(v as 'list' | 'kanban')}
                    options={[
                      { label: <Space><UnorderedListOutlined /> List</Space>, value: 'list' },
                      { label: <Space><AppstoreOutlined /> Kanban</Space>, value: 'kanban' },
                    ]}
                  />
                  <Segmented
                    size="small"
                    value={ticketView}
                    onChange={(v) => setTicketView(v as 'all' | 'mine')}
                    options={[
                      { label: 'All', value: 'all' },
                      { label: 'Mine', value: 'mine' },
                    ]}
                  />
                </Space>
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
            {viewMode === 'list' ? (
              <TicketTable
                dataSource={tickets}
                loading={isLoading}
                pagination={{ pageSize: 5, size: 'small', showSizeChanger: false }}
              />
            ) : (
              <TicketKanban tickets={tickets} onAddTicket={() => setIsCreateModalOpen(true)} />
            )}
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


          </Flex>
        </Col>
      </Row>
      <CreateTicketModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </Flex>
  )
}
