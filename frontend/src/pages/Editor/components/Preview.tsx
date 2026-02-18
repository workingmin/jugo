import React from 'react'
import { Card, Empty } from 'antd'
import { useEditorStore } from '@/store/editorStore'
import './Preview.scss'

const Preview: React.FC = () => {
  const { currentChapter } = useEditorStore()

  if (!currentChapter) {
    return (
      <div className="preview-empty">
        <Empty description="暂无内容" />
      </div>
    )
  }

  return (
    <Card className="preview-card" size="small" title="内容预览">
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: currentChapter.content }}
      />
    </Card>
  )
}

export default Preview