'use client'

import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd'
import type { MenuProps } from 'antd'
import {
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/auth.store'
import { NotificationProvider } from '@/components/notifications/NotificationProvider'
import { useUnreadCount } from '@/hooks/useNotifications'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const NAV_ITEMS: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: '/tickets',
    icon: <TagsOutlined />,
    label: <Link href="/tickets">Tickets</Link>,
  },
  {
    key: '/notifications',
    icon: <BellOutlined />,
    label: <Link href="/notifications">Notifications</Link>,
  }
]

const USER_MENU: MenuProps['items'] = [
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Sign out',
    danger: true,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { data: unreadCount = 0 } = useUnreadCount()

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'logout') {
      try {
        await api.post('/auth/logout')
      } catch (err) {
        console.error('Logout failed:', err)
      } finally {
        logout()
        localStorage.removeItem('auth_token')
        router.replace('/login')
      }
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="lg"
        collapsedWidth={64}
        width={220}
      >
        <Flex
          justify={collapsed ? 'center' : 'flex-start'}
          align="center"
          gap="small"
          style={{ padding: collapsed ? '16px 0' : '16px 20px', height: 64 }}
        >
          <Avatar
            size={32}
            icon={<TagsOutlined />}
            style={{ backgroundColor: '#4f46e5', flexShrink: 0 }}
          />
          {!collapsed && (
            <Text strong style={{ color: '#fff', fontSize: 16 }}>
              Ticketer
            </Text>
          )}
        </Flex>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={NAV_ITEMS}
        />
      </Sider>

      <Layout>

        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <Space>
            <Link href="/notifications">
              <Badge count={unreadCount} size="small" overflowCount={99}>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
            </Link>

            <Dropdown menu={{ items: USER_MENU, onClick: handleMenuClick }} placement="bottomRight" arrow>
              <Button type="text">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#3525cd' }} />
                  <Text style={{ fontSize: 13 }}>{user?.email || user?.name || 'User'}</Text>
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24 }}>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </Content>

      </Layout>
    </Layout>
  )
}
