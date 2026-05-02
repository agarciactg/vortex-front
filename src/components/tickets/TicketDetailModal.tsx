'use client'

import { Modal, Typography, Flex, Skeleton, Descriptions, Avatar, Space, Tag, Divider, Empty } from 'antd'
import { useTicket } from '@/hooks/useTickets'
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

interface TicketDetailModalProps {
  ticketId: string | null
  open: boolean
  onClose: () => void
}

export default function TicketDetailModal({ ticketId, open, onClose }: TicketDetailModalProps) {
  const { data: ticket, isLoading, isError } = useTicket(ticketId || '', {
    enabled: !!ticketId && open,
  })

  if (isLoading) {
    return (
      <Modal open={open} onCancel={onClose} footer={null} width={700}>
        <div style={{ padding: '24px 0' }}>
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </div>
      </Modal>
    )
  }

  if (isError || (!isLoading && !ticket && open)) {
    return (
      <Modal open={open} onCancel={onClose} footer={null}>
        <div style={{ padding: '40px 0' }}>
          <Empty description="Ticket not found or could not be loaded." />
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      title={
        <Space size="middle" align="center">
          <Text type="secondary" style={{ fontSize: 13 }}>TK-{ticket?.id.substring(0, 8)}</Text>
          {ticket && <StatusBadge status={ticket.status} />}
          {ticket && <PriorityBadge priority={ticket.priority} />}
        </Space>
      }
      styles={{ body: { paddingTop: 16 } }}
    >
      {ticket && (
        <Flex vertical gap="large">
          <div>
            <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>
              {ticket.title}
            </Title>
            
            <Paragraph>
              {ticket.description || (
                <Text type="secondary" italic>No description provided.</Text>
              )}
            </Paragraph>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <Descriptions column={2} size="small" layout="vertical">
            <Descriptions.Item label="Assignee">
              {ticket.assignee ? (
                <Space>
                  <Avatar size="small" src={ticket.assignee.avatar_url} icon={!ticket.assignee.avatar_url && <UserOutlined />} />
                  <Text>{ticket.assignee.name}</Text>
                </Space>
              ) : (
                <Text type="secondary">Unassigned</Text>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Author">
              <Space>
                <Avatar size="small" src={ticket.author.avatar_url} icon={!ticket.author.avatar_url && <UserOutlined />} />
                <Text>{ticket.author.name}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              <Space>
                <ClockCircleOutlined />
                <Text>{new Date(ticket.created_at).toLocaleString()}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              <Space>
                <ClockCircleOutlined />
                <Text>{new Date(ticket.updated_at).toLocaleString()}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: '8px 0' }} />

        </Flex>
      )}
    </Modal>
  )
}
