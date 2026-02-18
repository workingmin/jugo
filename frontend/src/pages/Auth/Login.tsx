import { useState } from 'react'
import { Card, Form, Input, Button, message, Alert } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { createRules } from '@/utils/validation'
import './Login.scss'

const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError('')

      await login({
        email: values.email,
        password: values.password,
      })

      message.success('登录成功')
      navigate('/works')
    } catch (err: any) {
      const errorMessage = err.message || '登录失败，请检查邮箱和密码'
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" title="JUGO AI写作平台">
        <div className="login-slogan">AI赋能 笔落成文</div>

        {error && (
          <Alert
            message={error}
            type="error"
            closable
            onClose={() => setError('')}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[createRules.required('请输入邮箱'), createRules.email()]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[createRules.required('请输入密码')]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>

          <div className="login-footer">
            <span>还没有账号？</span>
            <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
