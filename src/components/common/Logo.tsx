import { Avatar, Space, Typography } from 'antd'
import { TagsOutlined } from '@ant-design/icons'

const { Title } = Typography

interface LogoProps {
  size?: 'small' | 'default' | 'large'
  showLabel?: boolean
}

const avatarSizes = { small: 32, default: 48, large: 64 }
const titleLevels = { small: 5, default: 4, large: 3 } as const

export default function Logo({ size = 'default', showLabel = true }: LogoProps) {
  return (
    <Space direction="vertical" align="center" size="small">
      <Avatar
        size={avatarSizes[size]}
        icon={<TagsOutlined />}
        style={{ backgroundColor: '#3525cd' }}
      />
      {showLabel && (
        <Title level={titleLevels[size]} style={{ margin: 0 }}>
          Ticketer
        </Title>
      )}
    </Space>
  )
}
