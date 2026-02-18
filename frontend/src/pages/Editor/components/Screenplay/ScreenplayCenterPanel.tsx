import React, { useEffect, useState } from 'react'
import { Button, Space, Select } from 'antd'
import {
  SaveOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { useScreenplayStore } from '@/store/screenplayStore'
import type { ScreenplayElementType } from '@/types/screenplay'
import './ScreenplayCenterPanel.scss'

const { Option } = Select

const ScreenplayCenterPanel: React.FC = () => {
  const {
    currentScene,
    updateContent,
    saveContent,
    isSaving,
    hasUnsavedChanges,
    lastSavedAt
  } = useScreenplayStore()

  const [currentFormat, setCurrentFormat] = useState<ScreenplayElementType>('action')

  // 自动保存定时器
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (hasUnsavedChanges) {
        useScreenplayStore.getState().autoSave()
      }
    }, 30000) // 30秒自动保存

    return () => clearInterval(autoSaveTimer)
  }, [hasUnsavedChanges])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateContent(e.target.value)
  }

  const handleSave = () => {
    saveContent()
  }

  // 获取场景标题
  const getSceneHeading = () => {
    if (!currentScene) return ''

    const typeText = currentScene.type === 'interior' ? 'INT.' : 'EXT.'
    const timeMap = {
      day: '白天',
      night: '夜晚',
      dawn: '黎明',
      dusk: '黄昏',
      continuous: '连续'
    }

    return `${currentScene.sceneNumber}. ${typeText} ${currentScene.location} - ${timeMap[currentScene.time]}`
  }

  return (
    <div className="screenplay-center-panel">
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

          <Select
            value={currentFormat}
            onChange={setCurrentFormat}
            style={{ width: 120 }}
            size="middle"
          >
            <Option value="scene_heading">场景标题</Option>
            <Option value="action">动作描述</Option>
            <Option value="character">角色名</Option>
            <Option value="dialogue">台词</Option>
            <Option value="parenthetical">括号注释</Option>
            <Option value="transition">转场</Option>
          </Select>

          <Button icon={<ThunderboltOutlined />}>AI 续写</Button>
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
        {currentScene ? (
          <div className="screenplay-editor">
            {/* 场景标题 */}
            <div className="scene-heading">{getSceneHeading()}</div>

            {/* 内容编辑区 */}
            <textarea
              className="screenplay-textarea"
              value={currentScene.content}
              onChange={handleContentChange}
              placeholder="开始写作剧本..."
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="editor-empty">
            <p>请选择或创建一个场景开始写作</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScreenplayCenterPanel