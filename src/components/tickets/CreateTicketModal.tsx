'use client'

import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { useCreateTicket } from '@/hooks/useTickets'
import type { TicketCreate, TicketPriority } from '@/types/ticket.types'

interface CreateTicketModalProps {
  open: boolean
  onClose: () => void
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm()
  const { mutate: createTicket, isPending } = useCreateTicket()

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload: TicketCreate = {
        title: values.title,
        description: values.description,
        priority: values.priority as TicketPriority,
      }

      createTicket(payload, {
        onSuccess: () => {
          message.success('Ticket created successfully')
          onClose()
        },
        onError: (error: any) => {
          message.error(error.response?.data?.detail || 'Failed to create ticket')
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Modal
      title="Create New Ticket"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={isPending}
      okText="Create"
      cancelText="Cancel"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ priority: 'medium' }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter ticket title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea 
            placeholder="Describe the issue or request" 
            rows={4} 
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
        >
          <Select
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateTicketModal
