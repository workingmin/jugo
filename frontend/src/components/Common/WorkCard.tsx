import { Card, Tag, Button, Space, Dropdown, Modal, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExportOutlined, EllipsisOutlined, BookOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { Work } from '@/types/work'
import { formatDate, formatWordCount } from '@/utils/format'
import { deleteWork } from '@/api/works'
import './WorkCard.scss'

interface WorkCardProps {
  work: Work
  onDelete?: (workId: string) => void
  onUpdate?: () => void
}

const WorkCard = ({ work, onDelete, onUpdate }: WorkCardProps) => {
  const navigate = useNavigate()

  // 处理编辑
  const handleEdit = () => {
    navigate(`/editor/${work.workId}`)
  }

  // 处理删除
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除作品《${work.title}》吗？此操作不可恢复。`,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteWork(work.workId)
          message.success('删除成功')
          onDelete?.(work.workId)
          onUpdate?.()
        } catch (error: any) {
          message.error(error.message || '删除失败')
        }
      },
    })
  }

  // 处理导出
  const handleExport = () => {
    message.info('导出功能开发中...')
  }

  // 获取类型标签
  const getTypeTag = () => {
    if (work.type === 'novel') {
      return (
        <Tag icon={<BookOutlined />} color="blue">
          小说
        </Tag>
      )
    }
    return (
      <Tag icon={<VideoCameraOutlined />} color="purple">
        剧本
      </Tag>
    )
  }

  // 获取状态标签
  const getStatusTag = () => {
    const statusMap = {
      draft: { text: '草稿', color: 'default' },
      completed: { text: '已完成', color: 'success' },
      published: { text: '已发布', color: 'processing' },
    }
    const status = statusMap[work.status]
    return <Tag color={status.color}>{status.text}</Tag>
  }

  // 更多操作菜单
  const menuItems = [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: 'export',
      label: '导出',
      icon: <ExportOutlined />,
      onClick: handleExport,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete,
    },
  ]

  return (
    <Card
      className="work-card"
      hoverable
      cover={
        work.coverImage ? (
          <img alt={work.title} src={work.coverImage} className="work-card-cover" />
        ) : (
          <div className="work-card-cover-placeholder">
            {work.type === 'novel' ? <BookOutlined /> : <VideoCameraOutlined />}
          </div>
        )
      }
      actions={[
        <Button type="text" icon={<EditOutlined />} onClick={handleEdit}>
          编辑
        </Button>,
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Button type="text" icon={<EllipsisOutlined />}>
            更多
          </Button>
        </Dropdown>,
      ]}
    >
      <Card.Meta
        title={
          <div className="work-card-title">
            <span className="title-text" onClick={handleEdit}>
              {work.title}
            </span>
          </div>
        }
        description={
          <div className="work-card-description">
            <Space size="small" wrap>
              {getTypeTag()}
              {getStatusTag()}
              <Tag>{work.genre}</Tag>
            </Space>
            <div className="work-card-stats">
              <span>{formatWordCount(work.words)}</span>
              <span>·</span>
              <span>
                {work.type === 'novel'
                  ? `${work.numChapters || 0}章`
                  : `${work.numScenes || 0}场景`}
              </span>
            </div>
            <div className="work-card-time">
              更新于 {formatDate(work.updatedAt, 'YYYY-MM-DD HH:mm')}
            </div>
          </div>
        }
      />
    </Card>
  )
}

export default WorkCard
