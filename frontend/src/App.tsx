import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/Layout/MainLayout'
import Login from '@/pages/Auth/Login'
import Register from '@/pages/Auth/Register'
import Works from '@/pages/Works/Works'
import Editor from '@/pages/Editor/Editor'
import Tutorial from '@/pages/Tutorial/Tutorial'
import Profile from '@/pages/Profile/Profile'
import About from '@/pages/About/About'
import { useAuthStore } from '@/store/authStore'

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* 认证页面 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 受保护的主应用路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default route redirects to Works Management page */}
        <Route index element={<Navigate to="/works" replace />} />

        {/* Main pages */}
        <Route path="works" element={<Works />} />
        <Route path="editor/:workId" element={<Editor />} />
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
