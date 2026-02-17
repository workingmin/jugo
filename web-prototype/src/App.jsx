import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Works from './pages/Works'
import NovelEditor from './pages/NovelEditor'
import ScreenplayEditor from './pages/ScreenplayEditor'
import Tutorial from './pages/Tutorial'
import Profile from './pages/Profile'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Default route redirects to Works Management page */}
        <Route index element={<Navigate to="/works" replace />} />

        {/* Main pages */}
        <Route path="works" element={<Works />} />
        <Route path="editor/novel" element={<NovelEditor />} />
        <Route path="editor/screenplay" element={<ScreenplayEditor />} />
        <Route path="tutorial" element={<Tutorial />} />
        <Route path="profile" element={<Profile />} />
        <Route path="about" element={<About />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/works" replace />} />
      </Route>
    </Routes>
  )
}

export default App
