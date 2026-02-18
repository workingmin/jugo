import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { antdTheme } from '@/config/theme'
import App from './App.tsx'
import './index.css'
import 'antd/dist/reset.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={antdTheme} locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
