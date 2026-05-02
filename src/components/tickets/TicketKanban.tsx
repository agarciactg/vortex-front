import React, { useState } from 'react'
import { Card, Flex, Typography, Badge, Avatar, Space, Button, message } from 'antd'
import { PlusOutlined, UserOutlined, MessageOutlined, PaperClipOutlined } from '@ant-design/icons'
import type { Ticket, TicketStatus } from '@/types/ticket.types'
import PriorityBadge from '@/components/ui/PriorityBadge'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsService } from '@/services/tickets.service'
import { queryKeys } from '@/lib/queryKeys'

const { Text } = Typography

interface TicketKanbanProps {
  tickets: Ticket[]
  onAddTicket?: (status: TicketStatus) => void
  onViewTicket?: (ticketId: string) => void
}

const COLUMNS: { id: TicketStatus; title: string; color: string }[] = [
  { id: 'open', title: 'OPEN', color: '#3525cd' },
  { id: 'in_progress', title: 'IN PROGRESS', color: '#fa8c16' },
  { id: 'in_review', title: 'IN REVIEW', color: '#722ed1' },
  { id: 'closed', title: 'CLOSED', color: '#8c8c8c' },
]

export default function TicketKanban({ tickets, onAddTicket, onViewTicket }: TicketKanbanProps) {
  const qc = useQueryClient()
  const [dragOverCol, setDragOverCol] = useState<TicketStatus | null>(null)

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketsService.changeStatus(id, { status }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.tickets.all })
      qc.invalidateQueries({ queryKey: queryKeys.tickets.detail(variables.id) })
      message.success(`Ticket moved to ${variables.status.replace('_', ' ')}`)
    },
    onError: () => {
      message.error('Failed to move ticket - Only the author or assignee can change the status.')
    }
  })

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('ticketId', ticketId)
    setTimeout(() => {
      const target = e.target as HTMLElement
      if (target) target.style.opacity = '0.5'
    }, 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    if (target) target.style.opacity = '1'
    setDragOverCol(null)
  }

  const handleDragOver = (e: React.DragEvent, colId: TicketStatus) => {
    e.preventDefault()
    if (dragOverCol !== colId) {
      setDragOverCol(colId)
    }
  }

  const handleDragLeave = (e: React.DragEvent, colId: TicketStatus) => {
    if (dragOverCol === colId) {
      setDragOverCol(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetStatus: TicketStatus) => {
    e.preventDefault()
    setDragOverCol(null)
    
    const ticketId = e.dataTransfer.getData('ticketId')
    if (!ticketId) return

    const ticket = tickets.find((t) => t.id === ticketId)
    if (ticket && ticket.status !== targetStatus) {
      updateStatus({ id: ticketId, status: targetStatus })
    }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', minHeight: '60vh' }}>
      {COLUMNS.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.id)
        const isHovered = dragOverCol === col.id
        
        return (
          <div 
            key={col.id} 
            style={{ 
              minWidth: 300, 
              width: 300, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 12,
              backgroundColor: isHovered ? '#f0f5ff' : 'transparent',
              borderRadius: 8,
              padding: '8px 4px',
              transition: 'background-color 0.2s ease'
            }}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <Flex justify="space-between" align="center" style={{ padding: '0 8px' }}>
              <Space>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: col.color }} />
                <Text strong style={{ fontSize: 13, textTransform: 'uppercase' }}>{col.title}</Text>
                <Badge 
                  count={columnTickets.length} 
                  style={{ backgroundColor: '#f0f0f0', color: '#595959', fontSize: 12, border: 'none' }} 
                />
              </Space>
              <Button type="text" size="small" style={{ color: '#bfbfbf' }}>•••</Button>
            </Flex>

            <Flex vertical gap="small" style={{ minHeight: 150 }}>
              {columnTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  draggable 
                  onDragStart={(e) => handleDragStart(e, ticket.id)}
                  onDragEnd={handleDragEnd}
                  style={{ cursor: 'grab' }}
                >
                  <Card 
                    size="small" 
                    hoverable 
                    onClick={() => onViewTicket?.(ticket.id)}
                    styles={{ body: { padding: 16 } }}
                    style={{ borderRadius: 8, border: '1px solid #f0f0f0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                  >
                    <Flex vertical gap="middle">
                      <Flex justify="space-between" align="flex-start">
                        <PriorityBadge priority={ticket.priority} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          TK-{ticket.id.substring(0, 4)}
                        </Text>
                      </Flex>
                      <Text strong style={{ fontSize: 14, lineHeight: 1.4 }}>
                        {ticket.title}
                      </Text>
                      <Flex justify="space-between" align="center">
                        {ticket.assignee ? (
                          <Avatar size="small" src={ticket.assignee.avatar_url} icon={!ticket.assignee.avatar_url && <UserOutlined />} />
                        ) : (
                          <Avatar size="small" icon={<UserOutlined />} style={{ opacity: 0.5 }} />
                        )}
                        <Space size="middle" style={{ color: '#bfbfbf' }}>
                          <Space size={4}>
                            <MessageOutlined style={{ fontSize: 14 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>0</Text>
                          </Space>
                          <Space size={4}>
                            <PaperClipOutlined style={{ fontSize: 14 }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>0</Text>
                          </Space>
                        </Space>
                      </Flex>
                    </Flex>
                  </Card>
                </div>
              ))}

              <Button 
                type="dashed" 
                block 
                icon={<PlusOutlined />} 
                style={{ color: '#8c8c8c', borderStyle: 'dashed' }}
                onClick={() => onAddTicket && onAddTicket(col.id)}
              >
                Add Card
              </Button>
            </Flex>
          </div>
        )
      })}
    </div>
  )
}
