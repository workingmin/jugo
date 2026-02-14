import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ScreenplayEditor = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>剧本创作编辑页</Title>
        <Paragraph>
          这是剧本创作编辑页的占位页面。将实现三栏布局：
        </Paragraph>
        <ul>
          <li>左侧设置区（280px）：基础信息、场景管理、角色管理、AI辅助</li>
          <li>中间编辑区（主体）：专业剧本格式编辑器（等宽字体）、格式工具</li>
          <li>右侧预览区（320px）：分镜预览、时长统计、问题提示</li>
        </ul>
      </Card>
    </div>
  );
};

export default ScreenplayEditor;
