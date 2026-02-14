import { Card, Typography, Menu } from 'antd';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

const Tutorial = () => {
  const [selectedKey, setSelectedKey] = useState('intro');

  const menuItems = [
    {
      key: 'beginner',
      label: '📘 新手入门',
      children: [
        { key: 'intro', label: '平台介绍' },
        { key: 'quickstart', label: '快速开始' },
        { key: 'interface', label: '界面导览' },
      ],
    },
    {
      key: 'novel',
      label: '📖 小说创作教程',
      children: [
        { key: 'novel-create', label: '创建小说作品' },
        { key: 'novel-ai', label: '使用AI续写' },
        { key: 'novel-chapter', label: '章节管理技巧' },
        { key: 'novel-export', label: '导出与发布' },
      ],
    },
    {
      key: 'screenplay',
      label: '🎬 剧本创作教程',
      children: [
        { key: 'screenplay-create', label: '创建剧本作品' },
        { key: 'screenplay-format', label: '剧本格式规范' },
        { key: 'screenplay-shot', label: '分镜脚本生成' },
        { key: 'screenplay-dialogue', label: '角色对话技巧' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 48px)' }}>
      {/* Left Directory */}
      <div style={{ width: '240px', background: '#fff', borderRadius: '8px', padding: '16px' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </div>

      {/* Right Content */}
      <div style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '24px', overflow: 'auto' }}>
        <Title level={2}>使用教程</Title>
        <Paragraph>
          这是教程与帮助内容页的占位页面。将实现：
        </Paragraph>
        <ul>
          <li>左侧目录区（240px）：分类导航树形结构</li>
          <li>右侧内容区：教程正文、搜索功能、视频教程</li>
          <li>面包屑导航</li>
          <li>相关教程推荐</li>
        </ul>
      </div>
    </div>
  );
};

export default Tutorial;
