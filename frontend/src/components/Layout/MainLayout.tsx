import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import theme from '@/config/theme'
import './MainLayout.scss'

const { Sider, Content } = Layout

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Left Sidebar - 240px fixed width */}
      <Sider
        width={theme.layout.sidebarWidth}
        style={{ background: theme.colors.white }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Sidebar />
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ background: theme.colors.bgLight }}>
        <Content style={{ padding: '24px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
