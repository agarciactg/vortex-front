'use client'

import React from 'react'
import {
  Button,
  Card,
  Empty,
  Flex,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd'
import {
  BellOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/useNotifications'
import type { NotificationType } from '@/types/notification.types'

dayjs.extend(relativeTime)

const { Title, Text } = Typography

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  ticket_assigned: <UserAddOutlined style={{ color: '#1890ff' }} />,
  comment_added: <CommentOutlined style={{ color: '#52c41a' }} />,
  status_changed: <SwapOutlined style={{ color: '#fa8c16' }} />,
}

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications()
  const { mutate: markAsRead } = useMarkAsRead()
  const { mutate: markAllAsRead, isPending: markingAll } = useMarkAllAsRead()

  const notifications = data?.items || []
  const unreadCount = data?.unread_count || 0

  if (isLoading) return <Skeleton active />

  return (
    <Flex vertical gap="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <Title level={2} style={{ margin: 0 }}>
          <BellOutlined /> Notifications
          {unreadCount > 0 && <Text type="secondary" style={{ marginLeft: 12, fontSize: 16 }}>({unreadCount} unread)</Text>}
        </Title>
        {unreadCount > 0 && (
          <Button
            icon={<CheckCircleOutlined />}
            onClick={() => markAllAsRead()}
            loading={markingAll}
          >
            Mark all as read
          </Button>
        )}
      </Flex>

      {notifications.length === 0 ? (
        <Card>
          <Empty description="No notifications yet" />
        </Card>
      ) : (
        <Flex vertical gap={0}>
          {notifications.map((item) => (
            <Card
              key={item.id}
              size="small"
              styles={{ body: { padding: '12px 16px' } }}
              style={{
                marginBottom: 12,
                borderLeft: item.is_read ? '1px solid #f0f0f0' : '4px solid #1890ff',
                backgroundColor: item.is_read ? '#fff' : '#f0faff',
              }}
              hoverable
              onClick={() => !item.is_read && markAsRead(item.id)}
            >
              <Flex justify="space-between" align="center">
                <Flex align="center" gap="middle" style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, display: 'flex' }}>
                    {NOTIFICATION_ICONS[item.type]}
                  </div>
                  <Flex vertical gap={2}>
                    <Space size={4}>
                      <Text strong={!item.is_read}>{item.message}</Text>
                      {!item.is_read && <Tag color="blue" style={{ fontSize: 10, lineHeight: '14px', height: 16 }}>New</Tag>}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(item.created_at).fromNow()}
                    </Text>
                  </Flex>
                </Flex>
                <Link href={`/tickets/${item.ticket_id}`} onClick={(e) => e.stopPropagation()}>
                  <Button type="link">View Ticket</Button>
                </Link>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Flex>
  )
}
