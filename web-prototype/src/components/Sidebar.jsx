import { Menu, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOutlined,
  ReadOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { designTokens } from '../config/theme';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 退出登录处理
  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        navigate('/login');
      },
    });
  };

  // Menu items based on design document
  const menuItems = [
    {
      key: 'works',
      icon: <BookOutlined />,
      label: '我的作品',
      onClick: () => navigate('/works'),
    },
    {
      type: 'divider',
      key: 'divider1',
    },
    {
      key: 'novel',
      icon: <ReadOutlined />,
      label: '小说创作',
      onClick: () => navigate('/editor/novel'),
    },
    {
      key: 'screenplay',
      icon: <VideoCameraOutlined />,
      label: '剧本创作',
      onClick: () => navigate('/editor/screenplay'),
    },
    {
      type: 'divider',
      key: 'divider2',
    },
    {
      key: 'tutorial',
      icon: <QuestionCircleOutlined />,
      label: '使用教程',
      onClick: () => navigate('/tutorial'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: '关于我们',
      onClick: () => navigate('/about'),
    },
    {
      type: 'divider',
      key: 'divider3',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Determine selected key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/' || path === '/works') return 'works';
    if (path.includes('/editor/novel')) return 'novel';
    if (path.includes('/editor/screenplay')) return 'screenplay';
    if (path.includes('/tutorial')) return 'tutorial';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/about')) return 'about';
    return 'works';
  };

  return (
    <div className="sidebar-container">
      {/* Logo and Slogan */}
      <div className="sidebar-header">
        <div className="logo">JUGO</div>
        <div className="slogan">AI赋能 笔落成文</div>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="sidebar-menu"
      />
    </div>
  );
};

export default Sidebar;
