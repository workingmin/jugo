import React from 'react'
import { Card, List, Tag, Empty } from 'antd'
import { WarningOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import type { Issue } from '@/types/editor'
import './IssueDetection.scss'

const IssueDetection: React.FC = () => {
  // 模拟问题数据
  const issues: Issue[] = []

  const getSeverityIcon = (severity: Issue['severity']) => {
    switch (severity) {
      case 'high':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      case 'medium':
        return <WarningOutlined style={{ color: '#faad14' }} />
      case 'low':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />
    }
  }

  const getSeverityTag = (severity: Issue['severity']) => {
    const colorMap = {
      high: 'error',
      medium: 'warning',
      low: 'default'
    }
    const textMap = {
      high: '严重',
      medium: '中等',
      low: '轻微'
    }
    return <Tag color={colorMap[severity]}>{textMap[severity]}</Tag>
  }

  if (issues.length === 0) {
    return (
      <div className="issue-detection-empty">
        <Empty description="暂无问题" />
      </div>
    )
  }

  return (
    <Card className="issue-detection-card" size="small" title="问题检测">
      <List
        dataSource={issues}
        renderItem={issue => (
          <List.Item className="issue-item">
            <div className="issue-header">
              {getSeverityIcon(issue.severity)}
              <span className="issue-type">{issue.type}</span>
              {getSeverityTag(issue.severity)}
            </div>
            <div className="issue-message">{issue.message}</div>
            {issue.suggestion && (
              <div className="issue-suggestion">建议: {issue.suggestion}</div>
            )}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default IssueDetection