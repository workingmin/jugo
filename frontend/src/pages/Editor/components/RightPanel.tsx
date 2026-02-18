import React, { useState } from 'react'
import { Tabs } from 'antd'
import { EyeOutlined, BugOutlined, BarChartOutlined } from '@ant-design/icons'
import Preview from './Preview'
import IssueDetection from './IssueDetection'
import Progress from './Progress'
import './RightPanel.scss'

const { TabPane } = Tabs

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('preview')

  return (
    <div className="right-panel">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="right-panel-tabs">
        <TabPane
          tab={
            <span>
              <EyeOutlined />
              预览
            </span>
          }
          key="preview"
        >
          <Preview />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BugOutlined />
              问题检测
            </span>
          }
          key="issues"
        >
          <IssueDetection />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              进度
            </span>
          }
          key="progress"
        >
          <Progress />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default RightPanel