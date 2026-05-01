'use client'

import { Card, Col, Flex, Layout, Row, Space, Typography } from 'antd'
import Logo from '@/components/common/Logo'
import LoginForm from '@/components/forms/LoginForm'

const { Content } = Layout
const { Text, Title } = Typography

export default function LoginPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col xs={22} sm={16} md={12} lg={8} xl={7}>
            <Flex vertical align="center" gap="large">

              <Space direction="vertical" align="center" size="small">
                <Logo size="large" showLabel />
                <Text type="secondary">
                  Collaborative ticket tracking for modern teams.
                </Text>
              </Space>

              <Card style={{ width: '100%' }}>
                <Flex vertical gap="middle">
                  <Space direction="vertical" align="center" size={2}>
                    <Title level={4} style={{ margin: 0 }}>
                      Welcome back
                    </Title>
                    <Text type="secondary">Sign in to your account to continue</Text>
                  </Space>

                  <LoginForm />
                </Flex>
              </Card>

              <Space split={<Text type="secondary">·</Text>}>
                <Typography.Link href="/privacy" type="secondary">
                  Privacy Policy
                </Typography.Link>
                <Typography.Link href="/terms" type="secondary">
                  Terms of Service
                </Typography.Link>
              </Space>

            </Flex>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
