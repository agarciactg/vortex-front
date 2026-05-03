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
import { aiService } from '@/services/ai.service'

const { Text, Title } = Typography
const { TextArea } = Input

const QUICK_ACTIONS = [
  '📋 Need help creating a new ticket?',
  '🔍 Want to reassign a ticket to another team member?',
  '📊 Need to update the status of an existing ticket?',
  '🤖 Want to add a comment or check ticket details?',
]

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
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<TextAreaRef>(null)

  useEffect(() => {
    const saved = localStorage.getItem('ai_conversations')
    if (saved) {
      try {
        const parsed = JSON.parse(saved, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') return new Date(value)
          return value
        })
        setConversations(parsed)
        setActiveId(parsed[0]?.id || '')
      } catch (e) {
        const initial = [createConversation()]
        setConversations(initial)
        setActiveId(initial[0].id)
      }
    } else {
      const initial = [createConversation()]
      setConversations(initial)
      setActiveId(initial[0].id)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ai_conversations', JSON.stringify(conversations))
    }
  }, [conversations, isLoaded])

  const active = conversations.find((c) => c.id === activeId)

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
      if (!active) return
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const cId = active.id
      const isFirst = active.messages.length === 0

      const userMsg: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      updateConversation(cId, (c) => ({
        ...c,
        title: c.messages.length === 0 ? trimmed.slice(0, 40) : c.title,
        messages: [...c.messages, userMsg],
        updatedAt: new Date(),
      }))

      setInput('')
      setIsTyping(true)

      try {
        const res = await aiService.chat({
          message: trimmed,
          conversationId: isFirst ? undefined : cId,
        })

        const aiMsg: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: res.reply,
          timestamp: new Date(),
        }

        if (isFirst) {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === cId) {
                return { ...c, id: res.conversation_id, messages: [...c.messages, aiMsg], updatedAt: new Date() }
              }
              return c
            })
          )
          setActiveId(res.conversation_id)
        } else {
          updateConversation(cId, (c) => ({
            ...c,
            messages: [...c.messages, aiMsg],
            updatedAt: new Date(),
          }))
        }
      } catch (err: any) {
        const errorDetail = err.response?.data?.detail || err.message
        const errMsg: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: `There was an error connecting to the assistant: ${errorDetail}`,
          timestamp: new Date(),
        }
        updateConversation(cId, (c) => ({
          ...c,
          messages: [...c.messages, errMsg],
          updatedAt: new Date(),
        }))
      } finally {
        setIsTyping(false)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    },
    [active, isTyping, updateConversation]
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

  if (!isLoaded || !active) return null

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
              placeholder="Ask the assistant... (Shift+Enter for new line)"
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
