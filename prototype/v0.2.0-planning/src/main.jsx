import React from 'react'
import { createRoot } from 'react-dom/client'
import '@xyflow/react/dist/style.css'
import './styles/theme.css'
import './styles/project-dashboard.css'
import './styles/project-workspace.css'
import './styles/app.css'
import { App } from './App.jsx'

createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
