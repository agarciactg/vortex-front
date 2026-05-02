'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Statistic,
  Typography,
  Breadcrumb,
  Empty,
} from 'antd'
import {
  FileTextOutlined,
  PlusOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useTickets } from '@/hooks/useTickets'
import { useAuthStore } from '@/store/auth.store'
import TicketTable from '@/components/tickets/TicketTable'
import TicketFilters from '@/components/tickets/TicketFilters'
import CreateTicketModal from '@/components/tickets/CreateTicketModal'

const { Title, Text } = Typography

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [view, setView] = useState<'all' | 'mine'>('all')
  
  const user = useAuthStore((s) => s.user)
  const { data, isLoading } = useTickets({ limit: 100 })
  let tickets = data?.items || []

  if (view === 'mine' && user) {
    tickets = tickets.filter(t => t.author?.id === user.id || t.assignee?.id === user.id)
  }
  
  if (searchText) {
    const low = searchText.toLowerCase()
    tickets = tickets.filter(t => 
      t.title.toLowerCase().includes(low) || 
      t.id.toLowerCase().includes(low)
    )
  }

  if (selectedStatuses.length > 0) {
    tickets = tickets.filter(t => selectedStatuses.includes(t.status))
  }

  if (selectedPriority) {
    tickets = tickets.filter(t => t.priority === selectedPriority)
  }

  const userTickets = (data?.items || []).filter(t => t.author?.id === user?.id || t.assignee?.id === user?.id)
  const closedUserTicketsCount = userTickets.filter(t => t.status === 'closed').length
  const myTicketsCount = (data?.items || []).filter(t => t.assignee?.id === user?.id).length
  const openCount = tickets.filter(t => t.status === 'open').length

  return (
    <Flex vertical gap="large">
      <Flex vertical gap="small">
        <Breadcrumb items={[{ title: 'Home' }, { title: 'Tickets' }]} />
        <Flex justify="space-between" align="center">
          <Flex vertical>
            <Title level={3} style={{ margin: 0 }}>Ticket Management</Title>
            <Text type="secondary">View and manage all support requests in one place.</Text>
          </Flex>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalOpen(true)}
            size="large"
            style={{ borderRadius: 8, height: 35, padding: '0 24px' }}
          >
            Create New Ticket
          </Button>
        </Flex>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title={<Text type="secondary"><FileTextOutlined /> Total in View</Text>}
              value={tickets.length}
              valueStyle={{ color: '#1a1a1a', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title={<Text type="secondary"><UserOutlined /> Assigned to Me</Text>}
              value={myTicketsCount}
              valueStyle={{ color: '#3525cd', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title={<Text type="secondary"><ClockCircleOutlined /> Open Issues</Text>}
              value={openCount}
              valueStyle={{ color: '#fa8c16', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Flex vertical gap="middle">
            <TicketFilters
              onSearch={setSearchText}
              onStatusChange={setSelectedStatuses}
              onPriorityChange={setSelectedPriority}
              onViewChange={setView}
              currentView={view}
            />
            
            <Card size="small" title={<Title level={5} style={{ margin: 0 }}>Priority</Title>}>
              <Flex vertical gap="small">
                {['critical', 'high', 'medium', 'low'].map(p => {
                  const count = tickets.filter(t => t.priority === p).length
                  const pct = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0
                  const colors = { critical: '#f5222d', high: '#fa8c16', medium: '#52c41a', low: '#8c8c8c' }
                  return (
                    <div key={p}>
                      <Flex justify="space-between" style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: 12, textTransform: 'capitalize' }}>{p}</Text>
                        <Text style={{ fontSize: 12 }}>{count}</Text>
                      </Flex>
                      <Progress 
                        percent={pct} 
                        showInfo={false} 
                        size="small" 
                        strokeColor={colors[p as keyof typeof colors]} 
                        trailColor="#f0f0f0"
                      />
                    </div>
                  )
                })}
              </Flex>
            </Card>

            <Card size="small" title={<Title level={5} style={{ margin: 0 }}>My Efficiency</Title>}>
              <Flex vertical align="center" gap="small" style={{ padding: '10px 0' }}>
                <Progress 
                  type="dashboard" 
                  percent={userTickets.length > 0 ? Math.round((closedUserTicketsCount / userTickets.length) * 100) : 0} 
                  strokeColor="#52c41a"
                  size={120}
                  gapDegree={30}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>Resolution Rate</Text>
              </Flex>
            </Card>
          </Flex>
        </Col>
        <Col xs={24} md={18}>
          <Card bodyStyle={{ padding: 0 }} bordered={false} style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <TicketTable 
              dataSource={tickets} 
              loading={isLoading} 
              pagination={{ pageSize: 10 }}
              locale={{ emptyText: <Empty description="No tickets matching your filters" /> }}
            />
          </Card>
        </Col>
      </Row>

      <CreateTicketModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </Flex>
  )
}
