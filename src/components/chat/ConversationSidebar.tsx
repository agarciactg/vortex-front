'use client'

import { Button, Flex, Tooltip, Typography } from 'antd'
import {
  DeleteOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { ChatConversation } from '@/types/chat.types'
import styles from './ConversationSidebar.module.css'

const { Text } = Typography

interface Props {
  conversations: ChatConversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
}

function truncate(text: string, max = 32) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <Flex vertical className={styles.sidebar}>
      <Flex justify="space-between" align="center" className={styles.header}>
        <Text strong style={{ fontSize: 13 }}>
          Conversations
        </Text>
        <Tooltip title="New conversation">
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={onNew}
            className={styles.newBtn}
          />
        </Tooltip>
      </Flex>

      <Flex vertical gap={2} className={styles.list}>
        {conversations.length === 0 && (
          <Flex vertical align="center" justify="center" className={styles.empty}>
            <MessageOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, textAlign: 'center' }}>
              No conversations yet.<br />Start one!
            </Text>
          </Flex>
        )}

        {conversations.map((conv) => (
          <Flex
            key={conv.id}
            align="center"
            justify="space-between"
            className={`${styles.item} ${conv.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(conv.id)}
            gap={6}
          >
            <Flex align="center" gap={8} style={{ minWidth: 0, flex: 1 }}>
              <MessageOutlined style={{ fontSize: 13, flexShrink: 0, color: conv.id === activeId ? '#4f46e5' : '#8c8c8c' }} />
              <Text
                style={{
                  fontSize: 13,
                  color: conv.id === activeId ? '#4f46e5' : undefined,
                  fontWeight: conv.id === activeId ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {truncate(conv.title)}
              </Text>
            </Flex>
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                className={styles.deleteBtn}
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id) }}
                danger
              />
            </Tooltip>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
