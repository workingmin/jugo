import { useState, useCallback } from 'react'

export const useMessage = () => {
  const [message, setMessage] = useState(null)

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 2000)
  }, [])

  const MessageComponent = message ? (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        backgroundColor: message.type === 'success' ? '#10B981' : message.type === 'warning' ? '#F59E0B' : '#EF4444',
        color: 'white',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        animation: 'slideDown 0.3s ease'
      }}
    >
      {message.text}
    </div>
  ) : null

  return { showMessage, MessageComponent }
}

export const useProgress = () => {
  const [progress, setProgress] = useState(null)

  const showProgress = useCallback((text, value) => {
    setProgress({ text, value })
    if (value >= 100) {
      setTimeout(() => setProgress(null), 500)
    }
  }, [])

  const hideProgress = useCallback(() => {
    setProgress(null)
  }, [])

  const ProgressComponent = progress ? (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        minWidth: '300px'
      }}
    >
      <div style={{ marginBottom: '12px', color: '#1F2937' }}>{progress.text}</div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress.value}%` }}></div>
      </div>
      <div style={{ marginTop: '8px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
        {progress.value}%
      </div>
    </div>
  ) : null

  return { showProgress, hideProgress, ProgressComponent }
}
