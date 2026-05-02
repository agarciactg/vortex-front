'use client'

import {
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Popconfirm,
  Skeleton,
  Space,
  Tooltip,
  Typography,
  Upload,
  message,
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
  PictureOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useAttachments, useDeleteAttachment, useUploadAttachment } from '@/hooks/useTickets'
import { attachmentsService } from '@/services/attachments.service'
import type { Attachment } from '@/types/attachment.types'

const { Text } = Typography

const MAX_MB = 10

function FileIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith('image/'))
    return <Avatar shape="square" size="large" icon={<PictureOutlined />} style={{ backgroundColor: '#e6f7ff', color: '#1677ff' }} />
  if (contentType === 'application/pdf')
    return <Avatar shape="square" size="large" icon={<FilePdfOutlined />} style={{ backgroundColor: '#fff1f0', color: '#f5222d' }} />
  if (contentType.includes('word'))
    return <Avatar shape="square" size="large" icon={<FileWordOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }} />
  if (contentType.includes('excel') || contentType.includes('spreadsheet'))
    return <Avatar shape="square" size="large" icon={<FileExcelOutlined />} style={{ backgroundColor: '#f6ffed', color: '#52c41a' }} />
  if (contentType.includes('presentation'))
    return <Avatar shape="square" size="large" icon={<FilePptOutlined />} style={{ backgroundColor: '#fff7e6', color: '#fa8c16' }} />
  return <Avatar shape="square" size="large" icon={<FileTextOutlined />} style={{ backgroundColor: '#f5f5f5', color: '#595959' }} />
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface TicketAttachmentsProps {
  ticketId: string
}

export default function TicketAttachments({ ticketId }: TicketAttachmentsProps) {
  const { data: attachments = [], isLoading } = useAttachments(ticketId)
  const { mutate: uploadFile, isPending: uploading } = useUploadAttachment(ticketId)
  const { mutate: deleteFile } = useDeleteAttachment(ticketId)

  const handleUpload = (file: File) => {
    if (file.size > MAX_MB * 1024 * 1024) {
      message.error(`File exceeds ${MAX_MB} MB limit`)
      return false
    }
    uploadFile(file, {
      onSuccess: () => message.success(`${file.name} uploaded`),
      onError:   () => message.error('Upload failed'),
    })
    return false
  }

  const handleDelete = (att: Attachment) => {
    deleteFile(att.id, {
      onSuccess: () => message.success(`${att.original_filename} deleted`),
      onError:   () => message.error('Delete failed'),
    })
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 2 }} />

  return (
    <Flex vertical gap="middle">
      {attachments.length === 0 ? (
        <Empty description="No attachments yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          {attachments.map((att) => (
            <Card
              key={att.id}
              size="small"
              hoverable
              styles={{ body: { padding: 12 } }}
            >
              <Flex align="center" gap="small">
                <FileIcon contentType={att.content_type} />
                <Flex vertical style={{ minWidth: 0, flex: 1 }}>
                  <Text strong ellipsis style={{ fontSize: 12 }}>
                    {att.original_filename}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {formatBytes(att.file_size)}
                  </Text>
                </Flex>
                <Space size={2}>
                  <Tooltip title="Download">
                    <Button
                      type="text"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => attachmentsService.download(ticketId, att)}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Delete this file?"
                    okText="Delete"
                    okType="danger"
                    onConfirm={() => handleDelete(att)}
                  >
                    <Tooltip title="Delete">
                      <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>
                </Space>
              </Flex>
            </Card>
          ))}
        </div>
      )}

      <Upload
        beforeUpload={handleUpload}
        showUploadList={false}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md"
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Add File <Text type="secondary" style={{ fontSize: 12 }}>
            (max {MAX_MB} MB)
          </Text>
        </Button>
      </Upload>
    </Flex>
  )
}