'use client'

import React, { use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Flex, Typography, Button, Space, Tag, Avatar, Input, Select, Divider, Spin, message, Modal } from 'antd'
import { ArrowLeftOutlined, TagOutlined, PaperClipOutlined, FilePdfOutlined, PictureOutlined, UploadOutlined, UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useTicket, useChangeTicketStatus, useAssignTicket, useDeleteTicket } from '@/hooks/useTickets'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { data: ticket, isLoading, isError } = useTicket(id)
  
  const { mutate: changeStatus } = useChangeTicketStatus(id)
  const { mutate: assignTicket } = useAssignTicket(id)
  const { mutate: deleteTicket } = useDeleteTicket()

  if (isLoading) {
    return <Flex justify="center" align="center" style={{ minHeight: '60vh' }}><Spin size="large" /></Flex>
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
    Modal.confirm({
      title: 'Delete Ticket',
      content: 'Are you sure you want to delete this ticket? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        deleteTicket(ticket.id, {
          onSuccess: () => {
            message.success('Ticket deleted successfully')
            router.push('/dashboard')
          }
        })
      }
    })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', padding: '16px 24px', borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <Space size="large">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push('/dashboard')} style={{ color: '#595959' }}>
            Back to Dashboard
          </Button>
          <div style={{ width: 1, height: 16, backgroundColor: '#f0f0f0' }} />
          <Text strong style={{ fontSize: 18 }}>TK-{ticket.id.substring(0, 8)}</Text>
        </Space>
      </Flex>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
        
        <div style={{ gridColumn: 'span 8' }}>
          <Flex vertical gap="large">
            
            <div style={{ paddingBottom: 16 }}>
              <Title level={2} style={{ marginTop: 0, marginBottom: 16 }}>
                {ticket.title}
              </Title>
              <Space>
                <Tag icon={<TagOutlined />} style={{ borderRadius: 16, border: 'none', backgroundColor: '#e7eefe', color: '#151c27', padding: '4px 12px' }}>
                  Infrastructure
                </Tag>
                {ticket.priority === 'high' || ticket.priority === 'critical' ? (
                  <Tag color="volcano" style={{ borderRadius: 16, border: 'none', padding: '4px 12px' }}>High Priority</Tag>
                ) : null}
              </Space>
            </div>

            <Card title={<Text strong>Description</Text>} extra={<Button type="link">Edit</Button>} styles={{ body: { fontSize: 15, lineHeight: 1.6 } }} style={{ borderRadius: 12 }}>
              <Paragraph>
                {ticket.description || <Text type="secondary" italic>No description provided.</Text>}
              </Paragraph>
            </Card>

            <div style={{ marginTop: 16 }}>
              <Title level={4}><Space><PaperClipOutlined /> Attachments</Space></Title>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
                
                <Card size="small" hoverable styles={{ body: { padding: 12 } }} style={{ borderColor: '#f0f0f0', borderRadius: 8 }}>
                  <Flex align="center" gap="small">
                    <Avatar shape="square" size="large" icon={<FilePdfOutlined />} style={{ backgroundColor: '#fff1f0', color: '#f5222d', borderRadius: 6 }} />
                    <Flex vertical style={{ minWidth: 0 }}>
                      <Text strong ellipsis>query_plan_log.pdf</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>2.4 MB</Text>
                    </Flex>
                  </Flex>
                </Card>

                <Card size="small" hoverable styles={{ body: { padding: 12 } }} style={{ borderColor: '#f0f0f0', borderRadius: 8 }}>
                  <Flex align="center" gap="small">
                    <Avatar shape="square" size="large" icon={<PictureOutlined />} style={{ backgroundColor: '#e6f7ff', color: '#1890ff', borderRadius: 6 }} />
                    <Flex vertical style={{ minWidth: 0 }}>
                      <Text strong ellipsis>profiler_stats.png</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>842 KB</Text>
                    </Flex>
                  </Flex>
                </Card>

                <Card size="small" hoverable styles={{ body: { padding: 12 } }} style={{ borderStyle: 'dashed', backgroundColor: '#fafafa', cursor: 'pointer', borderRadius: 8 }}>
                  <Flex align="center" justify="center" gap="small" style={{ height: '40px', color: '#8c8c8c' }}>
                    <UploadOutlined /> <Text type="secondary" strong>Add File</Text>
                  </Flex>
                </Card>

              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
               <Title level={4}>Activity & Comments</Title>
               
               <Flex vertical gap="large" style={{ marginTop: 24 }}>
                  <Flex gap="middle">
                    <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4fOVcBG_Mc4dRYchqEt-QzpnS4V9BhnHbJZr5V-ZN50446LshkvO3_O3sedFrrQuWJj-1ZNmBJqIGqBAhj22cgMVZh44kkMk6Mb2NniXhXnRhq0-b4j3sa22yNv2b7z48r1FiA4WHtdSJeeP5aC6Q63ZcrHqpgbEPGTB31jqTjPVvpp-0n-F-TKVnajxE595Lw2A6dLVUcQhJ7XDWWAjBTwTOHbts2HCXps6zv_0VtFV5-7tgA_GCDXdWVJBzFDK16Z6PVhSX844" size={40} style={{ flexShrink: 0 }} />
                    <Flex vertical style={{ flex: 1 }}>
                      <Space align="center" style={{ marginBottom: 4 }}>
                        <Text strong>Sarah Jenkins</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>2 hours ago</Text>
                      </Space>
                      <div style={{ backgroundColor: '#f0f3ff', padding: '16px', borderRadius: '0px 12px 12px 12px' }}>
                        <Text style={{ color: '#464555' }}>I've reviewed the staging logs. The user_id column in the events table is definitely missing an index. I'll start working on the migration script now.</Text>
                      </div>
                      <Space style={{ marginTop: 8 }}>
                        <Button type="text" size="small" style={{ color: '#8c8c8c' }}>Like</Button>
                        <Button type="text" size="small" style={{ color: '#8c8c8c' }}>Reply</Button>
                      </Space>
                    </Flex>
                  </Flex>

                  <Flex align="center" gap="small" style={{ paddingLeft: 56 }}>
                    <div style={{ width: 8, height: 8, backgroundColor: '#d9d9d9', borderRadius: '50%' }} />
                    <Text type="secondary" italic style={{ fontSize: 13 }}>Ticket status changed to <Text strong style={{ color: '#3525cd' }}>In Progress</Text> by Marcus Aurelius · 4 hours ago</Text>
                  </Flex>

                  <Flex gap="middle">
                    <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1hUUUQMRUUnBHjoPZFyzBj26nj0loJ-9NhtTQ-5Use32kN57jVRrN3tJE4AX0ZsBmgfS2drW0mf8yzeOHttfEGuhCQ3SailZz2VOnxBjK6JX7x1AtMHqf0vs0U6OLYLdHISWU26Uzu8TJCtAVWfdO7S5Ueb9rvAEBFR3uDwlCDXgPjK2NQigChIdcVti6IQBkqGLoVwU0X5axdZfEeN3tuOojFCnfHb3qx6Df0BKRFc2arSfOoihNrcrhh8xg10Dw0q8Y08If8go" size={40} style={{ flexShrink: 0 }} />
                    <Flex vertical style={{ flex: 1 }}>
                      <Space align="center" style={{ marginBottom: 4 }}>
                        <Text strong>Marcus Aurelius</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>4 hours ago</Text>
                      </Space>
                      <div style={{ backgroundColor: '#f0f3ff', padding: '16px', borderRadius: '0px 12px 12px 12px' }}>
                        <Text style={{ color: '#464555' }}>Assigned this to Sarah. We need this resolved before the weekend promo event.</Text>
                      </div>
                    </Flex>
                  </Flex>
               </Flex>

               <div style={{ marginTop: 32 }}>
                 <Card styles={{ body: { padding: 16 } }} style={{ borderRadius: 12, borderColor: '#e2e8f8' }}>
                  <TextArea placeholder="Add a comment or internal note..." autoSize={{ minRows: 3 }} bordered={false} style={{ marginBottom: 16, padding: 0 }} />
                  <Flex justify="space-between" align="center" style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
                    <Space>
                      <Button type="text" icon={<EditOutlined />} style={{ color: '#8c8c8c' }} />
                      <Button type="text" icon={<PaperClipOutlined />} style={{ color: '#8c8c8c' }} />
                    </Space>
                    <Space>
                      <Button type="text" style={{ color: '#8c8c8c', fontWeight: 600 }}>Cancel</Button>
                      <Button type="primary" style={{ backgroundColor: '#3525cd', fontWeight: 600, borderRadius: 8 }}>Post Comment</Button>
                    </Space>
                  </Flex>
                 </Card>
               </div>
            </div>

          </Flex>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <Flex vertical gap="middle">
            
            <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: 12 }}>
              <Flex vertical gap="large">
                
                <div style={{ backgroundColor: '#f9f9ff' }}>
                  <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 1 }}>Status</Text>
                  <Select 
                    value={ticket.status} 
                    style={{ width: '100%', height: 40 }}
                    onChange={(val) => changeStatus({ status: val })}
                    options={[
                      { label: 'Open', value: 'open' },
                      { label: 'In Progress', value: 'in_progress' },
                      { label: 'In Review', value: 'in_review' },
                      { label: 'Closed', value: 'closed' },
                    ]}
                  />
                </div>

                <div>
                  <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 1 }}>Priority</Text>
                  <Space.Compact style={{ width: '100%' }}>
                    <Button style={{ width: '33.33%' }} type={ticket.priority === 'low' ? 'primary' : 'default'} disabled>Low</Button>
                    <Button style={{ width: '33.33%' }} type={ticket.priority === 'medium' ? 'primary' : 'default'} disabled>Medium</Button>
                    <Button style={{ width: '33.33%' }} type={ticket.priority === 'high' || ticket.priority === 'critical' ? 'primary' : 'default'} danger={ticket.priority === 'high' || ticket.priority === 'critical'} disabled>High</Button>
                  </Space.Compact>
                </div>

                <Divider style={{ margin: 0 }} />

                <div>
                  <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 1 }}>Assignee</Text>
                  <Select
                    style={{ width: '100%', height: 40 }}
                    value={ticket.assignee?.id || undefined}
                    onChange={(val) => assignTicket({ assignee_id: val })}
                    placeholder="Unassigned"
                    options={[
                        { label: 'Sarah Jenkins', value: 'fe6b2a09-e85d-4099-8cf0-e047ce576137' },
                        { label: 'David Miller', value: '9z3i2j4k-5l6m-7n8o-9p0q-1r2s3t4u5v6w' }
                    ]}
                  />
                </div>

                <div>
                  <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 8, letterSpacing: 1 }}>Reporter</Text>
                  <Flex align="center" gap="small" style={{ backgroundColor: '#f9f9ff', padding: '8px 12px', borderRadius: 8 }}>
                    <Avatar size="small" src={ticket.author?.avatar_url} icon={!ticket.author?.avatar_url && <UserOutlined />} />
                    <Text strong>{ticket.author?.name || 'Unknown'}</Text>
                  </Flex>
                </div>

              </Flex>
            </Card>

            <Card styles={{ body: { padding: 24 } }} style={{ borderRadius: 12 }}>
              <Flex vertical gap="middle">
                <Flex justify="space-between" align="center">
                  <Text type="secondary" style={{ fontSize: 13 }}>Created</Text>
                  <Text strong style={{ fontSize: 13 }}>{new Date(ticket.created_at).toLocaleDateString()} · {new Date(ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text type="secondary" style={{ fontSize: 13 }}>Updated</Text>
                  <Text strong style={{ fontSize: 13 }}>{new Date(ticket.updated_at).toLocaleDateString()}</Text>
                </Flex>
              </Flex>
            </Card>

            <div style={{ marginTop: 8 }}>
              <Button danger block size="large" icon={<DeleteOutlined />} onClick={handleDelete} style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e', color: '#f5222d', fontWeight: 600, borderRadius: 8 }}>
                Delete Ticket
              </Button>
            </div>

          </Flex>
        </div>

      </div>
    </div>
  )
}
