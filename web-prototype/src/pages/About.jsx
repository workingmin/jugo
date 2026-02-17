import { Card, Typography, Button, Row, Col, Form, Input } from 'antd';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const About = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Brand Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
          borderRadius: '8px',
          padding: '80px 40px',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#fff',
        }}
      >
        <Title level={1} style={{ color: '#fff', fontSize: '36px', marginBottom: '16px' }}>
          JUGO
        </Title>
        <Title level={3} style={{ color: '#fff', fontWeight: 'normal', marginBottom: '16px' }}>
          AI赋能，笔落成文
        </Title>
        <Paragraph style={{ color: '#fff', fontSize: '16px', marginBottom: '32px' }}>
          专业的AI小说剧本创作平台，让创作更简单
        </Paragraph>
        <Button type="primary" size="large" style={{ marginRight: '16px' }}>
          立即体验
        </Button>
        <Button size="large" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none' }}>
          观看介绍视频
        </Button>
      </div>

      {/* Features Section */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        核心功能
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📖🎬</div>
            <Title level={4}>小说+剧本双场景</Title>
            <Paragraph>一键切换小说/剧本模式，支持双向转换，满足多场景创作需求</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
            <Title level={4}>AI全流程辅助</Title>
            <Paragraph>续写、润色、大纲生成、角色管理，AI陪伴创作每一步</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📚</div>
            <Title level={4}>10万+字长文本支持</Title>
            <Paragraph>分章管理、上下文同步、问题提示，长篇创作无压力</Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Contact Section */}
      <Card title="联系我们" style={{ marginBottom: '24px' }}>
        <Row gutter={[48, 24]}>
          <Col xs={24} md={12}>
            <Paragraph>
              <strong>📧 邮箱：</strong>support@jugo.ai
            </Paragraph>
            <Paragraph>
              <strong>💬 微信公众号：</strong>JUGO创作平台
            </Paragraph>
            <Paragraph>
              <strong>🐦 微博：</strong>@JUGO创作平台
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>意见反馈</Title>
            <Form layout="vertical">
              <Form.Item label="姓名" name="name">
                <Input placeholder="请输入您的姓名" />
              </Form.Item>
              <Form.Item label="邮箱" name="email">
                <Input placeholder="请输入您的邮箱" />
              </Form.Item>
              <Form.Item label="反馈内容" name="feedback">
                <TextArea rows={4} placeholder="请输入您的反馈内容" />
              </Form.Item>
              <Form.Item>
                <Button type="primary">提交反馈</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>
        <Paragraph>© 2026 JUGO. All rights reserved.</Paragraph>
      </div>
    </div>
  );
};

export default About;
