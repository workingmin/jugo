import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { initialAppData } from '../utils/data'
import { formatNumber } from '../utils/helpers'
import { useMessage, useProgress } from '../utils/hooks'
import '../styles/home.css'

function Home() {
  const navigate = useNavigate()
  const [works, setWorks] = useState(initialAppData.works)
  const { showMessage, MessageComponent } = useMessage()
  const { showProgress, ProgressComponent } = useProgress()
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [guideStep, setGuideStep] = useState(0)

  const guideSteps = [
    {
      title: '第一步：选择创作类型',
      content: '点击"小说创作"或"剧本创作"按钮，选择您要创作的内容类型。'
    },
    {
      title: '第二步：输入创作构想',
      content: '在编辑区输入您的创作构想，可以是大纲、角色设定或故事梗概。'
    },
    {
      title: '第三步：使用AI辅助',
      content: '点击AI功能按钮（续写、润色、大纲生成），让AI帮助您完善内容。'
    },
    {
      title: '第四步：导出作品',
      content: '创作完成后，点击导出按钮，选择格式（PDF/Word/TXT）导出您的作品。'
    }
  ]

  const startCreation = (type) => {
    localStorage.setItem('creationType', JSON.stringify(type))
    showMessage(`正在进入${type === 'novel' ? '小说' : '剧本'}创作模式...`)
    setTimeout(() => {
      navigate(`/create?type=${type}`)
    }, 500)
  }

  const handleShowGuide = () => {
    setGuideStep(0)
    setShowGuideModal(true)
  }

  const handleSkipGuide = () => {
    showMessage('您可以随时在帮助中心查看引导教程', 'warning')
  }

  const editWork = (id) => {
    const work = works.find(w => w.id === id)
    if (work) {
      localStorage.setItem('currentWork', JSON.stringify(work))
      navigate(`/create?id=${id}&type=${work.type}`)
    }
  }

  const exportWork = (id, e) => {
    e.stopPropagation()
    const work = works.find(w => w.id === id)
    if (work) {
      showMessage(`正在导出《${work.title}》...`)
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        showProgress('导出中', progress)
        if (progress >= 100) {
          clearInterval(interval)
          showMessage('导出成功！', 'success')
        }
      }, 200)
    }
  }

  return (
    <main className="container">
      {MessageComponent}
      {ProgressComponent}

      {/* 创作入口区 */}
      <section className="creation-entry">
        <h2 className="section-title">开始创作</h2>
        <div className="entry-buttons">
          <div className="entry-card" onClick={() => startCreation('novel')}>
            <div className="entry-icon">📖</div>
            <h3>小说创作</h3>
            <p>10万+字长文本支持</p>
            <p>智能分章管理</p>
            <button className="btn btn-primary btn-large">开始写小说</button>
          </div>
          <div className="entry-card" onClick={() => startCreation('script')}>
            <div className="entry-icon">🎬</div>
            <h3>剧本创作</h3>
            <p>专业剧本格式</p>
            <p>场景角色管理</p>
            <button className="btn btn-primary btn-large">开始写剧本</button>
          </div>
        </div>
      </section>

      {/* 新手引导区 */}
      <section className="guide-section">
        <div className="card guide-card">
          <h3>新手入门</h3>
          <p className="guide-steps">3步完成创作：输入构想 → AI生成 → 优化导出</p>
          <div className="guide-actions">
            <button className="btn btn-warning" onClick={handleShowGuide}>开始引导</button>
            <button className="btn" style={{ background: '#E5E7EB' }} onClick={handleSkipGuide}>跳过</button>
          </div>
        </div>
      </section>

      {/* 最近创作区 */}
      <section className="recent-works">
        <div className="section-header">
          <h2 className="section-title">最近创作</h2>
          <a href="/works" className="view-all">查看全部 →</a>
        </div>
        <div className="works-grid">
          {works.slice(0, 3).map(work => (
            <div key={work.id} className="work-card" onClick={() => editWork(work.id)}>
              <div className="work-cover">{work.type === 'novel' ? '📖' : '🎬'}</div>
              <h3 className="work-title">{work.title}</h3>
              <div className="work-meta">
                <span className="tag">{work.type === 'novel' ? '小说' : '剧本'}</span>
                <span className="tag">{work.genre}</span>
                <span className="tag">{work.status === 'draft' ? '草稿' : '已完成'}</span>
              </div>
              <div className="work-info">字数：{formatNumber(work.words)}</div>
              <div className="work-info">更新时间：{work.updatedAt}</div>
              <div className="work-actions">
                <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); editWork(work.id); }}>编辑</button>
                <button className="btn btn-success" onClick={(e) => exportWork(work.id, e)}>导出</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 核心功能推荐区 */}
      <section className="features">
        <h2 className="section-title">核心功能</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>AI双向转换</h3>
            <p>小说与剧本一键互转，智能适配格式</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>长文本审校</h3>
            <p>10万+字智能审校，逻辑漏洞实时提示</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❄️</div>
            <h3>雪花写作法</h3>
            <p>分步引导创作，从构思到成文</p>
          </div>
        </div>
      </section>

      {/* 新手引导模态框 */}
      {showGuideModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div style={{ background: 'white', padding: '32px', borderRadius: '8px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ color: '#1F2937', marginBottom: '16px' }}>{guideSteps[guideStep].title}</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '24px', lineHeight: 1.6 }}>{guideSteps[guideStep].content}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: '12px' }}>步骤 {guideStep + 1}/{guideSteps.length}</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {guideStep > 0 && (
                  <button className="btn" onClick={() => setGuideStep(guideStep - 1)}>上一步</button>
                )}
                {guideStep < guideSteps.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => setGuideStep(guideStep + 1)}>下一步</button>
                ) : (
                  <button className="btn btn-success" onClick={() => { setShowGuideModal(false); showMessage('新手引导完成！', 'success'); }}>完成</button>
                )}
                <button className="btn" style={{ background: '#E5E7EB' }} onClick={() => { setShowGuideModal(false); showMessage('已跳过新手引导', 'warning'); }}>跳过</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home
