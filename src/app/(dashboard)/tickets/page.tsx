'use client'

import { Flex, Typography } from 'antd'

const { Title, Text } = Typography

export default function TicketsPage() {
  return (
    <Flex vertical gap="large">
      <Title level={3} style={{ margin: 0 }}>Tickets</Title>
      <Text type="secondary">Manage your support tickets here.</Text>
      
      {/* TODO: Add ticket list integration */}
    </Flex>
  )
}
