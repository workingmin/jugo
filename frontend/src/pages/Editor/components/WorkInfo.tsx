import React from 'react'
import { Card, Descriptions, Tag } from 'antd'
import { useEditorStore } from '@/store/editorStore'
import { useScreenplayStore } from '@/store/screenplayStore'
import './WorkInfo.scss'

interface WorkInfoProps {
  isScreenplay?: boolean
}

const WorkInfo: React.FC<WorkInfoProps> = ({ isScreenplay = false }) => {
  const { currentWorkId: novelWorkId, chapters } = useEditorStore()
  const { currentWorkId: screenplayWorkId, scenes } = useScreenplayStore()

  const currentWorkId = isScreenplay ? screenplayWorkId : novelWorkId

  if (!currentWorkId) {
    return null
  }

  if (isScreenplay) {
    // 剧本统计
    const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0)
    const completedScenes = scenes.filter(sc => sc.status === 'completed').length
    const draftScenes = scenes.filter(sc => sc.status === 'draft').length

    return (
      <Card className="work-info-card" size="small" title="作品信息">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="总时长">{totalDuration}分钟</Descriptions.Item>
          <Descriptions.Item label="场景数">{scenes.length}</Descriptions.Item>
          <Descriptions.Item label="已完成">
            <Tag color="success">{completedScenes}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="草稿">
            <Tag color="default">{draftScenes}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    )
  }

  // 小说统计
  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.words, 0)
  const completedChapters = chapters.filter(ch => ch.status === 'completed').length
  const draftChapters = chapters.filter(ch => ch.status === 'draft').length

  return (
    <Card className="work-info-card" size="small" title="作品信息">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="总字数">{totalWords.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="章节数">{chapters.length}</Descriptions.Item>
        <Descriptions.Item label="已完成">
          <Tag color="success">{completedChapters}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="草稿">
          <Tag color="default">{draftChapters}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default WorkInfo