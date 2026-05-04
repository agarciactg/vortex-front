'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Divider,
  Flex,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  useAssignTicket,
  useChangeTicketStatus,
  useDeleteTicket,
  useTicket,
} from '@/hooks/useTickets'
import TicketComments from '@/components/tickets/TicketComments'
import TicketAttachments from '@/components/tickets/TicketAttachments'
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import { useUsers } from '@/hooks/useUsers'
import { useAuth } from '@/hooks/useAuth'

const { Title, Text, Paragraph } = Typography

const PRIORITY_OPTIONS = [
  { label: 'Low',      value: 'low' },
  { label: 'Medium',   value: 'medium' },
  { label: 'High',     value: 'high' },
  { label: 'Critical', value: 'critical' },
]

const STATUS_OPTIONS = [
  { label: 'Open',        value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'In Review',   value: 'in_review' },
  { label: 'Closed',      value: 'closed' },
]

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { modal, message } = App.useApp()

  const { data: ticket, isLoading, isError } = useTicket(id)
  const { user: currentUser } = useAuth()
  const { data: users = [] }  = useUsers()

  const { mutate: changeStatus } = useChangeTicketStatus(id)
  const { mutate: assignTicket } = useAssignTicket(id)
  const { mutate: deleteTicket, isPending: deleting } = useDeleteTicket()

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  if (isError || !ticket) {
    return (
      <Flex vertical gap="middle" align="center" style={{ paddingTop: 40 }}>
        <Title level={4}>Ticket not found.</Title>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </Flex>
    )
  }

  const handleDelete = () => {
    modal.confirm({
      title:   'Delete Ticket',
      content: 'Are you sure? This action cannot be undone.',
      okText:  'Delete',
      okType:  'danger',
      onOk: () =>
        deleteTicket(ticket.id, {
          onSuccess: () => {
            message.success('Ticket deleted')
            router.push('/dashboard')
          },
          onError: () => message.error('Could not delete ticket'),
        }),
    })
  }

  const isAuthor = currentUser?.id === ticket.author.id

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>

      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Breadcrumb
          items={[
            { title: <a onClick={() => router.push('/dashboard')}>Dashboard</a> },
            { title: <a onClick={() => router.push('/tickets')}>Tickets</a> },
            { title: `TK-${ticket.id.substring(0, 8)}` },
          ]}
        />
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Flex>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 24,
        }}
      >

        <div style={{ gridColumn: 'span 8' }}>
          <Flex vertical gap="large">

            <div>
              <Title level={2} style={{ marginTop: 0, marginBottom: 12 }}>
                {ticket.title}
              </Title>
              <Space wrap>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </Space>
            </div>

            <Card title={<Text strong>Description</Text>}>
              {ticket.description ? (
                <Paragraph style={{ margin: 0, fontSize: 15, lineHeight: 1.7 }}>
                  {ticket.description}
                </Paragraph>
              ) : (
                <Text type="secondary" italic>No description provided.</Text>
              )}
            </Card>

            <Card title={<Text strong>Attachments</Text>}>
              <TicketAttachments ticketId={ticket.id} />
            </Card>
            <Card title={<Text strong>Activity & Comments</Text>}>
              <TicketComments
                ticketId={ticket.id}
                currentUserId={currentUser?.id ?? ''}
              />
            </Card>

          </Flex>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <Flex vertical gap="middle">

            <Card>
              <Flex vertical gap="large">

                <div>
                  <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                    Status
                  </Text>
                  <Select
                    value={ticket.status}
                    style={{ width: '100%' }}
                    options={STATUS_OPTIONS}
                    onChange={(val) => changeStatus({ status: val })}
                  />
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                    Priority
                  </Text>
                  <Select
                    value={ticket.priority}
                    style={{ width: '100%' }}
                    options={PRIORITY_OPTIONS}
                    onChange={(val) =>
                      changeStatus({ status: ticket.status })
                    }
                  />
                </div>

                <Divider style={{ margin: 0 }} />

                <div>
                  <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                    Assignee
                  </Text>
                  <Select
                    style={{ width: '100%' }}
                    value={ticket.assignee?.id ?? undefined}
                    placeholder="Unassigned"
                    allowClear
                    onChange={(val) => val && assignTicket({ assignee_id: val })}
                    options={users.map((u) => ({
                      label: (
                        <Space>
                          <Avatar size="small" icon={<UserOutlined />} />
                          {u.name}
                        </Space>
                      ),
                      value: u.id,
                    }))}
                  />
                </div>

                <div>
                  <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
                    Reporter
                  </Text>
                  <Flex
                    align="center"
                    gap="small"
                    style={{ backgroundColor: '#f9f9ff', padding: '8px 12px', borderRadius: 8 }}
                  >
                    <Avatar
                      size="small"
                      src={ticket.author.avatar_url}
                      icon={!ticket.author.avatar_url && <UserOutlined />}
                    />
                    <Text strong>{ticket.author.name}</Text>
                  </Flex>
                </div>

              </Flex>
            </Card>

            <Card>
              <Flex vertical gap="small">
                <Flex justify="space-between">
                  <Text type="secondary" style={{ fontSize: 13 }}>Created</Text>
                  <Text style={{ fontSize: 13 }}>
                    {new Date(ticket.created_at).toLocaleDateString()}{' '}
                    {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text type="secondary" style={{ fontSize: 13 }}>Updated</Text>
                  <Text style={{ fontSize: 13 }}>
                    {new Date(ticket.updated_at).toLocaleDateString()}
                  </Text>
                </Flex>
              </Flex>
            </Card>

            {isAuthor && (
              <Button
                danger
                block
                size="large"
                icon={<DeleteOutlined />}
                loading={deleting}
                onClick={handleDelete}
              >
                Delete Ticket
              </Button>
            )}

          </Flex>
        </div>

      </div>
    </div>
  )
}
