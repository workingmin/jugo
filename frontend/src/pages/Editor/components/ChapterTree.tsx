import React, { useState } from 'react'
import { Tree, Button, Modal, Input, message, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useEditorStore } from '@/store/editorStore'
import type { Chapter } from '@/types/editor'
import './ChapterTree.scss'

const ChapterTree: React.FC = () => {
  const {
    chapters,
    currentChapterId,
    currentWorkId,
    loadChapter,
    createChapter,
    deleteChapter
  } = useEditorStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')

  // 处理章节选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0 && currentWorkId) {
      const chapterId = selectedKeys[0] as string
      loadChapter(currentWorkId, chapterId)
    }
  }

  // 创建新章节
  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim()) {
      message.warning('请输入章节标题')
      return
    }

    if (!currentWorkId) {
      message.error('未找到当前作品')
      return
    }

    const chapter = await createChapter({
      workId: currentWorkId,
      title: newChapterTitle,
      order: chapters.length + 1
    })

    if (chapter) {
      setIsModalOpen(false)
      setNewChapterTitle('')
      // 自动打开新创建的章节
      loadChapter(currentWorkId, chapter.chapterId)
    }
  }

  // 删除章节
  const handleDeleteChapter = (chapterId: string) => {
    if (!currentWorkId) return

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个章节吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => deleteChapter(currentWorkId, chapterId)
    })
  }

  // 章节菜单
  const getChapterMenu = (chapter: Chapter): MenuProps => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑'
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => handleDeleteChapter(chapter.chapterId)
      }
    ]
  })

  // 转换章节数据为树形结构
  const treeData = chapters.map(chapter => ({
    key: chapter.chapterId,
    title: (
      <div className="chapter-tree-node">
        <span className="chapter-title">
          <FileTextOutlined /> {chapter.title}
        </span>
        <Space size={4} className="chapter-actions">
          <span className="chapter-words">{chapter.words}字</span>
          <Dropdown menu={getChapterMenu(chapter)} trigger={['click']}>
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              onClick={e => e.stopPropagation()}
            />
          </Dropdown>
        </Space>
      </div>
    )
  }))

  return (
    <div className="chapter-tree">
      <div className="chapter-tree-header">
        <h4>章节列表</h4>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          新建章节
        </Button>
      </div>

      <Tree
        treeData={treeData}
        selectedKeys={currentChapterId ? [currentChapterId] : []}
        onSelect={handleSelect}
        showLine
        defaultExpandAll
      />

      <Modal
        title="新建章节"
        open={isModalOpen}
        onOk={handleCreateChapter}
        onCancel={() => {
          setIsModalOpen(false)
          setNewChapterTitle('')
        }}
        okText="创建"
        cancelText="取消"
      >
        <Input
          placeholder="请输入章节标题"
          value={newChapterTitle}
          onChange={e => setNewChapterTitle(e.target.value)}
          onPressEnter={handleCreateChapter}
        />
      </Modal>
    </div>
  )
}

export default ChapterTree