import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { designTokens } from '../config/theme';
import './MainLayout.css';

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout className="main-layout">
      {/* Left Sidebar - 240px fixed width */}
      <Sider
        width={designTokens.layout.sidebarWidth}
        className="main-layout-sider"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Sidebar />
      </Sider>

      {/* Main Content Area */}
      <Layout className="main-layout-content-wrapper">
        <Content className="main-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
