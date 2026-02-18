import React, { useState } from 'react'
import { Tabs } from 'antd'
import { FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import WorkInfo from './WorkInfo'
import ChapterTree from './ChapterTree'
import AISettings from './AISettings'
import './LeftPanel.scss'

const { TabPane } = Tabs

const LeftPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chapters')

  return (
    <div className="left-panel">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="left-panel-tabs">
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              章节
            </span>
          }
          key="chapters"
        >
          <WorkInfo />
          <ChapterTree />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              AI设置
            </span>
          }
          key="ai"
        >
          <AISettings />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default LeftPanel