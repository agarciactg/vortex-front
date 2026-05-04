'use client'

import { ConfigProvider, App, theme } from 'antd'
import type { ReactNode } from 'react'

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  )
}
