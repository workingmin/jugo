import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import '../styles/login.css'

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = (values) => {
    setLoading(true)

    // 验证用户名和密码
    if (values.username === 'admin' && values.password === '123456') {
      message.success('登录成功！')
      // 保存登录状态到 localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', values.username)
      // 跳转到作品管理页面
      setTimeout(() => {
        navigate('/works')
      }, 500)
    } else {
      message.error('用户名或密码错误！')
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>AI小说剧本创作平台</h1>
          <p>欢迎登录</p>
        </div>

        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              size="large"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-footer">
          <p>默认账号：admin / 123456</p>
        </div>
      </div>
    </div>
  )
}

export default Login
