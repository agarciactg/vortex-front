'use client'

import { useState } from 'react'
import {
  App,
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useTickets'

const { Text } = Typography
const { TextArea } = Input

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 2)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return new Date(dateStr).toLocaleDateString()
}

interface TicketCommentsProps {
  ticketId: string
  currentUserId: string
}

export default function TicketComments({ ticketId, currentUserId }: TicketCommentsProps) {
  const [content, setContent] = useState('')
  const { message } = App.useApp()

  const { data: comments = [], isLoading } = useComments(ticketId)
  const { mutate: createComment, isPending: creating } = useCreateComment(ticketId)
  const { mutate: deleteComment } = useDeleteComment(ticketId)

  const handleSubmit = () => {
    const trimmed = content.trim()
    if (!trimmed) return
    createComment(
      { content: trimmed },
      {
        onSuccess: () => {
          setContent('')
          message.success('Comment posted')
        },
        onError: () => message.error('Failed to post comment'),
      }
    )
  }

  const handleDelete = (commentId: string) => {
    deleteComment(commentId, {
      onSuccess: () => message.success('Comment deleted'),
      onError:   () => message.error('Failed to delete comment'),
    })
  }

  return (
    <Flex vertical gap="large">

      {isLoading ? (
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      ) : comments.length === 0 ? (
        <Empty description="No comments yet. Be the first to comment." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Flex vertical gap="middle">
          {comments.map((comment) => (
            <Flex key={comment.id} gap="middle" align="flex-start" style={{ padding: '8px 0' }}>
              <Avatar
                src={comment.author.avatar_url}
                icon={!comment.author.avatar_url && <UserOutlined />}
                size={36}
                style={{ flexShrink: 0 }}
              />
              <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                <Flex justify="space-between" align="center">
                  <Space size="small">
                    <Text strong style={{ fontSize: 13 }}>{comment.author.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatRelative(comment.created_at)}
                    </Text>
                  </Space>
                  {comment.author.id === currentUserId && (
                    <Popconfirm
                      title="Delete this comment?"
                      okText="Delete"
                      okType="danger"
                      onConfirm={() => handleDelete(comment.id)}
                    >
                      <Tooltip title="Delete">
                        <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                      </Tooltip>
                    </Popconfirm>
                  )}
                </Flex>
                <div
                  style={{
                    backgroundColor: '#f0f3ff',
                    padding: '10px 14px',
                    borderRadius: '0 10px 10px 10px',
                    marginTop: 4,
                  }}
                >
                  <Text style={{ color: '#464555', fontSize: 14, whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                  </Text>
                </div>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      <Card size="small">
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          autoSize={{ minRows: 3, maxRows: 8 }}
          variant="borderless"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
          }}
          style={{ padding: 0, marginBottom: 12 }}
        />
        <Flex justify="space-between" align="center" style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
          <Button type="text" size="small" style={{ color: '#8c8c8c' }} />
          <Space>
            <Button size="small" onClick={() => setContent('')} disabled={!content}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<SendOutlined />}
              loading={creating}
              disabled={!content.trim()}
              onClick={handleSubmit}
            >
              Post Comment
            </Button>
          </Space>
        </Flex>
      </Card>

    </Flex>
  )
}
