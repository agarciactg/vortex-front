import type { Metadata } from 'next'
import '../styles/globals.css'
import AntdProvider from '@/providers/AntdProvider'


export const metadata: Metadata = {
  title: 'Orbidi Ticketing',
  description: 'Collaborative ticket tracking for modern teams.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>
            {children}
        </AntdProvider>
      </body>
    </html>
  )
}
