'use client'

import { Flex, Typography } from 'antd'
import styles from './TypingIndicator.module.css'

const { Text } = Typography

export default function TypingIndicator() {
  return (
    <Flex align="center" gap={10} className={styles.container}>
      <Flex className={styles.dots} align="center" gap={4}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </Flex>
      <Text type="secondary" style={{ fontSize: 12 }}>
        AI is thinking…
      </Text>
    </Flex>
  )
}
