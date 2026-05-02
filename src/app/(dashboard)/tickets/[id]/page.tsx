'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Flex, Spin, Typography } from 'antd'

const { Title } = Typography

export default function TicketRedirectPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard')
  }, [router])

  return (
    <Flex vertical align="center" justify="center" style={{ minHeight: '60vh' }} gap="middle">
      <Spin size="large" />
      <Title level={4}>Loading Ticket...</Title>
    </Flex>
  )
}
