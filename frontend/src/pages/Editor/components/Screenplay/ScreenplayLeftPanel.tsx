import React, { useState } from 'react'
import { Tabs } from 'antd'
import { FileTextOutlined, UserOutlined } from '@ant-design/icons'
import WorkInfo from '../WorkInfo'
import SceneList from './SceneList'
import CharacterList from './CharacterList'
import './ScreenplayLeftPanel.scss'

const { TabPane } = Tabs

const ScreenplayLeftPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scenes')

  return (
    <div className="screenplay-left-panel">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="left-panel-tabs">
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              场景
            </span>
          }
          key="scenes"
        >
          <WorkInfo isScreenplay />
          <SceneList />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              角色
            </span>
          }
          key="characters"
        >
          <CharacterList />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default ScreenplayLeftPanel