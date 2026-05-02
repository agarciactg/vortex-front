'use client'

import {
  Card,
  Checkbox,
  Divider,
  Flex,
  Input,
  Radio,
  Select,
  Typography,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

interface TicketFiltersProps {
  onSearch: (text: string) => void
  onStatusChange: (status: string[]) => void
  onPriorityChange: (priority: string | null) => void
  onViewChange: (view: 'all' | 'mine') => void
  currentView: 'all' | 'mine'
}

export default function TicketFilters({
  onSearch,
  onStatusChange,
  onPriorityChange,
  onViewChange,
  currentView,
}: TicketFiltersProps) {
  return (
    <Card size="small" title={<Title level={5} style={{ margin: 0 }}>Filters</Title>}>
      <Flex vertical gap="middle">
        <div>
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Search</Text>
          <Input
            placeholder="ID, title, description..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>View</Text>
          <Radio.Group 
            value={currentView} 
            onChange={(e) => onViewChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="small"
            style={{ width: '100%' }}
          >
            <Radio.Button value="all" style={{ width: '50%', textAlign: 'center' }}>All</Radio.Button>
            <Radio.Button value="mine" style={{ width: '50%', textAlign: 'center' }}>Mine</Radio.Button>
          </Radio.Group>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Status</Text>
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={(checkedValues) => onStatusChange(checkedValues as string[])}
          >
            <Flex vertical gap={4}>
              <Checkbox value="open">Open</Checkbox>
              <Checkbox value="in_progress">In Progress</Checkbox>
              <Checkbox value="in_review">In Review</Checkbox>
              <Checkbox value="closed">Closed</Checkbox>
            </Flex>
          </Checkbox.Group>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div>
          <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Priority</Text>
          <Select
            placeholder="Select priority"
            style={{ width: '100%' }}
            allowClear
            onChange={onPriorityChange}
            options={[
              { label: 'Critical', value: 'critical' },
              { label: 'High',     value: 'high' },
              { label: 'Medium',   value: 'medium' },
              { label: 'Low',      value: 'low' },
            ]}
          />
        </div>
      </Flex>
    </Card>
  )
}
