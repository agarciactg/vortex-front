'use client'

import { Avatar, Flex, Typography } from 'antd'
import { RobotOutlined, UserOutlined } from '@ant-design/icons'
import type { ChatMessage as ChatMessageType } from '@/types/chat.types'
import styles from './ChatMessage.module.css'

const { Text } = Typography

interface Props {
  message: ChatMessageType
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <Flex
      className={`${styles.messageRow} ${isUser ? styles.userRow : styles.assistantRow}`}
      gap={10}
      align="flex-end"
    >
      {!isUser && (
        <Avatar
          size={32}
          icon={<RobotOutlined />}
          className={styles.botAvatar}
        />
      )}

      <Flex vertical gap={4} className={`${styles.bubbleWrap} ${isUser ? styles.userBubbleWrap : ''}`}>
        <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
          {message.isStreaming ? (
            <Flex align="center" gap={4}>
              <span className={styles.streamingText}>{message.content}</span>
              <span className={styles.cursor} />
            </Flex>
          ) : (
            <span className={styles.messageText}>{message.content}</span>
          )}
        </div>
        <Text type="secondary" className={`${styles.timestamp} ${isUser ? styles.timestampRight : ''}`}>
          {formatTime(message.timestamp)}
        </Text>
      </Flex>

      {isUser && (
        <Avatar
          size={32}
          icon={<UserOutlined />}
          className={styles.userAvatar}
        />
      )}
    </Flex>
  )
}
