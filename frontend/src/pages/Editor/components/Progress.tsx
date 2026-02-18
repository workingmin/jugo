import React from 'react'
import { Card, Progress as AntProgress, Statistic, Row, Col } from 'antd'
import { useEditorStore } from '@/store/editorStore'
import './Progress.scss'

const Progress: React.FC = () => {
  const { chapters, currentChapter } = useEditorStore()

  // 计算统计数据
  const totalChapters = chapters.length
  const completedChapters = chapters.filter(ch => ch.status === 'completed').length
  const totalWords = chapters.reduce((sum, ch) => sum + ch.words, 0)
  const completionRate = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0

  // 当前章节字数
  const currentWords = currentChapter?.words || 0

  return (
    <div className="progress-panel">
      <Card className="progress-card" size="small" title="创作进度">
        <div className="progress-section">
          <div className="progress-label">章节完成度</div>
          <AntProgress
            percent={Math.round(completionRate)}
            status="active"
            strokeColor="#1e40af"
          />
          <div className="progress-stats">
            {completedChapters} / {totalChapters} 章节已完成
          </div>
        </div>

        <Row gutter={16} className="stats-row">
          <Col span={12}>
            <Statistic
              title="总字数"
              value={totalWords}
              suffix="字"
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="当前章节"
              value={currentWords}
              suffix="字"
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
        </Row>

        <Row gutter={16} className="stats-row">
          <Col span={12}>
            <Statistic
              title="总章节"
              value={totalChapters}
              suffix="章"
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="已完成"
              value={completedChapters}
              suffix="章"
              valueStyle={{ fontSize: 20, color: '#52c41a' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default Progress