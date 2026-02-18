import React, { useEffect, useRef, useState } from 'react'
import { Button, Space, Tooltip, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  SaveOutlined,
  ThunderboltOutlined,
  EditOutlined,
  ExpandOutlined,
  CheckOutlined
} from '@ant-design/icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEditorStore } from '@/store/editorStore'
import AIOperationModal from './AIOperationModal'
import type { AIOperationType } from '@/types/editor'
import './CenterPanel.scss'

const CenterPanel: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null)
  const {
    currentChapter,
    updateContent,
    saveContent,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt
  } = useEditorStore()

  const [aiModalVisible, setAiModalVisible] = useState(false)
  const [aiOperation, setAiOperation] = useState<AIOperationType>('continue')
  const [selectedText, setSelectedText] = useState<string>('')

  // 自动保存定时器
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (hasUnsavedChanges) {
        useEditorStore.getState().autoSave()
      }
    }, 30000) // 30秒自动保存

    return () => clearInterval(autoSaveTimer)
  }, [hasUnsavedChanges])

  const handleContentChange = (content: string) => {
    updateContent(content)
  }

  const handleSave = () => {
    saveContent()
  }

  // 打开 AI 操作弹窗
  const handleAIOperation = (operation: AIOperationType) => {
    // 获取选中的文本
    const quill = quillRef.current?.getEditor()
    const selection = quill?.getSelection()
    if (selection && selection.length > 0) {
      const text = quill?.getText(selection.index, selection.length)
      setSelectedText(text || '')
    } else {
      setSelectedText('')
    }

    setAiOperation(operation)
    setAiModalVisible(true)
  }

  // 应用 AI 生成结果
  const handleApplyAIResult = (result: string) => {
    const quill = quillRef.current?.getEditor()
    if (!quill) return

    const selection = quill.getSelection()
    if (selection) {
      // 如果有选中文本，替换选中内容
      if (selection.length > 0) {
        quill.deleteText(selection.index, selection.length)
        quill.insertText(selection.index, result)
      } else {
        // 否则在光标位置插入
        quill.insertText(selection.index, result)
      }
    } else {
      // 如果没有光标位置，追加到末尾
      const length = quill.getLength()
      quill.insertText(length, result)
    }
  }

  // AI 操作菜单
  const aiMenuItems: MenuProps['items'] = [
    {
      key: 'continue',
      label: 'AI 续写',
      icon: <ThunderboltOutlined />,
      onClick: () => handleAIOperation('continue')
    },
    {
      key: 'rewrite',
      label: 'AI 改写',
      icon: <EditOutlined />,
      onClick: () => handleAIOperation('rewrite')
    },
    {
      key: 'expand',
      label: 'AI 扩写',
      icon: <ExpandOutlined />,
      onClick: () => handleAIOperation('expand')
    },
    {
      key: 'polish',
      label: 'AI 润色',
      icon: <CheckOutlined />,
      onClick: () => handleAIOperation('polish')
    }
  ]

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean']
    ]
  }

  return (
    <div className="center-panel">
      {/* 工具栏 */}
      <div className="editor-toolbar">
        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
            disabled={!hasUnsavedChanges}
          >
            保存
          </Button>
          <Dropdown menu={{ items: aiMenuItems }} placement="bottomLeft">
            <Button icon={<ThunderboltOutlined />}>AI 助手</Button>
          </Dropdown>
        </Space>

        <div className="editor-status">
          {lastSavedAt && (
            <span className="save-time">
              最后保存: {new Date(lastSavedAt).toLocaleTimeString()}
            </span>
          )}
          {hasUnsavedChanges && <span className="unsaved-indicator">未保存</span>}
        </div>
      </div>

      {/* 编辑器 */}
      <div className="editor-content">
        {currentChapter ? (
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={currentChapter.content}
            onChange={handleContentChange}
            modules={modules}
            placeholder="开始写作..."
          />
        ) : (
          <div className="editor-empty">
            <p>请选择或创建一个章节开始写作</p>
          </div>
        )}
      </div>

      {/* AI 操作弹窗 */}
      <AIOperationModal
        visible={aiModalVisible}
        operation={aiOperation}
        selectedText={selectedText}
        onClose={() => setAiModalVisible(false)}
        onApply={handleApplyAIResult}
      />
    </div>
  )
}

export default CenterPanel