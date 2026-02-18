import React, { useState } from 'react'
import { Modal, Button, Space, Spin, message } from 'antd'
import { ThunderboltOutlined, EditOutlined, ExpandOutlined, CheckOutlined } from '@ant-design/icons'
import type { AIOperationType, AISettings } from '@/types/editor'
import { useEditorStore } from '@/store/editorStore'
import * as chaptersApi from '@/api/chapters'
import './AIOperationModal.scss'

interface AIOperationModalProps {
  visible: boolean
  operation: AIOperationType
  selectedText?: string
  onClose: () => void
  onApply: (result: string) => void
}

const AIOperationModal: React.FC<AIOperationModalProps> = ({
  visible,
  operation,
  selectedText,
  onClose,
  onApply
}) => {
  const { currentWorkId, currentChapterId, currentChapter } = useEditorStore()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  // 获取操作标题和图标
  const getOperationInfo = () => {
    const infoMap = {
      continue: { title: 'AI 续写', icon: <ThunderboltOutlined /> },
      rewrite: { title: 'AI 改写', icon: <EditOutlined /> },
      expand: { title: 'AI 扩写', icon: <ExpandOutlined /> },
      polish: { title: 'AI 润色', icon: <CheckOutlined /> }
    }
    return infoMap[operation]
  }

  // 执行 AI 操作
  const handleGenerate = async () => {
    if (!currentWorkId || !currentChapterId || !currentChapter) {
      message.error('请先选择章节')
      return
    }

    setLoading(true)
    try {
      const settings: AISettings = {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        style: '流畅自然',
        tone: '中性'
      }

      const requestData = {
        workId: currentWorkId,
        chapterId: currentChapterId,
        operation,
        selectedText,
        context: currentChapter.content,
        settings
      }

      let response
      switch (operation) {
        case 'continue':
          response = await chaptersApi.aiContinue(requestData)
          break
        case 'rewrite':
          response = await chaptersApi.aiRewrite(requestData)
          break
        case 'expand':
          response = await chaptersApi.aiExpand(requestData)
          break
        case 'polish':
          response = await chaptersApi.aiPolish(requestData)
          break
      }

      setResult(response.result)
      message.success('生成成功')
    } catch (error: any) {
      message.error(error.message || 'AI 生成失败')
    } finally {
      setLoading(false)
    }
  }

  // 应用结果
  const handleApply = () => {
    if (result) {
      onApply(result)
      handleClose()
    }
  }

  // 关闭弹窗
  const handleClose = () => {
    setResult('')
    onClose()
  }

  const operationInfo = getOperationInfo()

  return (
    <Modal
      title={
        <Space>
          {operationInfo.icon}
          {operationInfo.title}
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          取消
        </Button>,
        <Button
          key="generate"
          type="primary"
          onClick={handleGenerate}
          loading={loading}
          disabled={!!result}
        >
          生成
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleApply}
          disabled={!result}
        >
          应用
        </Button>
      ]}
      className="ai-operation-modal"
    >
      {selectedText && (
        <div className="selected-text-section">
          <div className="section-title">选中文本:</div>
          <div className="selected-text">{selectedText}</div>
        </div>
      )}

      <div className="result-section">
        <div className="section-title">AI 生成结果:</div>
        {loading ? (
          <div className="loading-container">
            <Spin tip="AI 正在生成中..." />
          </div>
        ) : result ? (
          <div className="result-content">{result}</div>
        ) : (
          <div className="empty-result">点击"生成"按钮开始 AI 创作</div>
        )}
      </div>
    </Modal>
  )
}

export default AIOperationModal