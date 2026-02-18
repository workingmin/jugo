import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { useEditorStore } from '@/store/editorStore'
import LeftPanel from './components/LeftPanel'
import CenterPanel from './components/CenterPanel'
import RightPanel from './components/RightPanel'
import './Editor.scss'

const { Sider, Content } = Layout

const Editor: React.FC = () => {
  const { workId } = useParams<{ workId: string }>()
  const navigate = useNavigate()
  const { loadChapters, isLoading, currentWorkId, setCurrentWork } = useEditorStore()

  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  useEffect(() => {
    if (!workId) {
      navigate('/works')
      return
    }

    // 加载章节列表
    if (workId !== currentWorkId) {
      setCurrentWork(workId)
      loadChapters(workId)
    }
  }, [workId, currentWorkId, navigate, setCurrentWork, loadChapters])

  if (isLoading) {
    return (
      <div className="editor-loading">
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  return (
    <Layout className="editor-layout">
      {/* 左侧面板 */}
      <Sider
        className="editor-left-panel"
        width={280}
        collapsible
        collapsed={leftCollapsed}
        onCollapse={setLeftCollapsed}
        collapsedWidth={0}
      >
        <LeftPanel />
      </Sider>

      {/* 中间编辑区 */}
      <Content className="editor-center-panel">
        <CenterPanel />
      </Content>

      {/* 右侧面板 */}
      <Sider
        className="editor-right-panel"
        width={320}
        collapsible
        collapsed={rightCollapsed}
        onCollapse={setRightCollapsed}
        collapsedWidth={0}
        reverseArrow
      >
        <RightPanel />
      </Sider>
    </Layout>
  )
}

export default Editor