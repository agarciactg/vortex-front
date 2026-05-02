'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Avatar,
  Button,
  Flex,
  Input,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import {
  ClearOutlined,
  RobotOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import type { ChatConversation, ChatMessage } from '@/types/chat.types'
import ChatMessageBubble from '@/components/chat/ChatMessage'
import TypingIndicator from '@/components/chat/TypingIndicator'
import ConversationSidebar from '@/components/chat/ConversationSidebar'
import styles from './AIChatView.module.css'
import { v4 as uuidv4 } from 'uuid'

const { Text, Title } = Typography
const { TextArea } = Input

const QUICK_ACTIONS = [
  '📋 Show me the open tickets summary',
  '🔍 Which tickets are high priority?',
  '📊 Give me a status report for this week',
  '🤖 How can you help me with ticketing?',
]

async function mockAiReply(userMessage: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800))
  const responses: Record<string, string> = {
    open: 'Right now there are **12 open tickets**, 3 of which are flagged as high priority. Would you like me to list them?',
    priority: 'High-priority tickets: TK-041 (Payment gateway error), TK-038 (API timeout), TK-031 (Login failure). Should I assign any of them?',
    report: 'This week: 24 tickets created, 18 resolved, 6 still open. Resolution rate is 75% — slightly above the weekly average of 71%. 🎉',
    help: 'I can help you search, summarize, create, assign, and analyze tickets. Just ask me anything about your ticketing workflow!',
  }

  const lower = userMessage.toLowerCase()
  for (const [key, val] of Object.entries(responses)) {
    if (lower.includes(key)) return val
  }

  return `I received your message: *"${userMessage}"*.\n\nThis is a mock response — once you wire my endpoint I'll be fully operational. Let me know what you need! 🚀`
}


function createConversation(firstMsg?: string): ChatConversation {
  const now = new Date()
  return {
    id: uuidv4(),
    title: firstMsg ? firstMsg.slice(0, 40) : 'New conversation',
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}

export default function AIChatView() {
  const [conversations, setConversations] = useState<ChatConversation[]>([createConversation()])
  const [activeId, setActiveId] = useState<string>(conversations[0].id)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<TextAreaRef>(null)

  const active = conversations.find((c) => c.id === activeId)!

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages, isTyping])

  const updateConversation = useCallback(
    (id: string, updater: (c: ChatConversation) => ChatConversation) => {
      setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)))
    },
    []
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      updateConversation(activeId, (c) => ({
        ...c,
        title: c.messages.length === 0 ? trimmed.slice(0, 40) : c.title,
        messages: [...c.messages, userMsg],
        updatedAt: new Date(),
      }))

      setInput('')
      setIsTyping(true)

      try {
        const replyText = await mockAiReply(trimmed)

        const aiMsg: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date(),
        }

        updateConversation(activeId, (c) => ({
          ...c,
          messages: [...c.messages, aiMsg],
          updatedAt: new Date(),
        }))
      } finally {
        setIsTyping(false)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    },
    [activeId, isTyping, updateConversation]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleNewConversation = () => {
    const conv = createConversation()
    setConversations((prev) => [conv, ...prev])
    setActiveId(conv.id)
    setInput('')
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id)
      if (next.length === 0) {
        const fresh = createConversation()
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  const handleClearCurrent = () => {
    updateConversation(activeId, (c) => ({
      ...c,
      messages: [],
      title: 'New conversation',
      updatedAt: new Date(),
    }))
  }

  return (
    <Flex className={styles.root}>
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
      />

      <Flex vertical className={styles.chatPanel}>

        <Flex align="center" justify="space-between" className={styles.chatHeader}>
          <Flex align="center" gap={12}>
            <div className={styles.avatarGlow}>
              <Avatar
                size={40}
                icon={<RobotOutlined />}
                className={styles.headerAvatar}
              />
              <span className={styles.onlineDot} />
            </div>
            <Flex vertical gap={0}>
              <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>
                Ticketer AI Assistant
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Powered by your agent · Always ready
              </Text>
            </Flex>
          </Flex>

          <Flex gap={8} align="center">
            <Tag color="green" icon={<ThunderboltOutlined />} style={{ borderRadius: 20, padding: '0 10px' }}>
              Online
            </Tag>
            <Tooltip title="Clear conversation">
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClearCurrent}
                disabled={active.messages.length === 0}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Flex vertical gap={16} className={styles.messagesArea}>
          {active.messages.length === 0 && !isTyping ? (
            <Flex vertical align="center" justify="center" className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <RobotOutlined style={{ fontSize: 48, color: '#4f46e5' }} />
              </div>
              <Title level={4} style={{ margin: '16px 0 4px', color: '#1a1a2e' }}>
                How can I help you today?
              </Title>
              <Text type="secondary" style={{ marginBottom: 28, textAlign: 'center', maxWidth: 360 }}>
                Ask me anything about your tickets, team activity, or how to manage your workflow.
              </Text>
              <Flex wrap="wrap" gap={10} justify="center">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    className={styles.quickAction}
                    onClick={() => sendMessage(action)}
                  >
                    {action}
                  </button>
                ))}
              </Flex>
            </Flex>
          ) : (
            <>
              {active.messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </Flex>

        <div className={styles.inputBar}>
          <Flex align="flex-end" gap={10} className={styles.inputInner}>
            <TextArea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI assistant… (Shift+Enter for new line)"
              autoSize={{ minRows: 1, maxRows: 5 }}
              className={styles.textarea}
              disabled={isTyping}
            />
            <Tooltip title="Send (Enter)">
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                size="large"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className={styles.sendBtn}
                loading={isTyping}
              />
            </Tooltip>
          </Flex>
          <Text type="secondary" className={styles.hint}>
            Press <kbd className={styles.kbd}>Enter</kbd> to send · <kbd className={styles.kbd}>Shift+Enter</kbd> for new line
          </Text>
        </div>
      </Flex>
    </Flex>
  )
}
