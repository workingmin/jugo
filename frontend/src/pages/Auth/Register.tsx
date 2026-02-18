import { useState } from 'react'
import { Card, Form, Input, Button, message, Alert, Progress } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { createRules, getPasswordStrength } from '@/utils/validation'
import './Register.scss'

const Register = () => {
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')

  const onFinish = async (values: { email: string; username: string; password: string }) => {
    try {
      setLoading(true)
      setError('')

      await register({
        email: values.email,
        username: values.username,
        password: values.password,
      })

      message.success('注册成功，正在跳转...')
      setTimeout(() => {
        navigate('/works')
      }, 1000)
    } catch (err: any) {
      const errorMessage = err.message || '注册失败，请稍后重试'
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    if (password) {
      const strength = getPasswordStrength(password)
      setPasswordStrength(strength)
    }
  }

  const getPasswordStrengthPercent = () => {
    switch (passwordStrength) {
      case 'weak':
        return 33
      case 'medium':
        return 66
      case 'strong':
        return 100
      default:
        return 0
    }
  }

  const getPasswordStrengthStatus = (): 'exception' | 'normal' | 'success' => {
    switch (passwordStrength) {
      case 'weak':
        return 'exception'
      case 'medium':
        return 'normal'
      case 'strong':
        return 'success'
      default:
        return 'normal'
    }
  }

  return (
    <div className="register-container">
      <Card className="register-card" title="注册 JUGO 账号">
        <div className="register-slogan">AI赋能 笔落成文</div>

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
          name="register"
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
            name="username"
            rules={[createRules.required('请输入用户名'), createRules.username()]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名（3-20位字母、数字、下划线）"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[createRules.required('请输入密码'), createRules.password()]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（至少8位，包含大小写字母和数字）"
              disabled={loading}
              onChange={handlePasswordChange}
            />
          </Form.Item>

          <Form.Item>
            <div className="password-strength">
              <span>密码强度：</span>
              <Progress
                percent={getPasswordStrengthPercent()}
                status={getPasswordStrengthStatus()}
                showInfo={false}
                strokeWidth={8}
              />
              <span className={`strength-text strength-${passwordStrength}`}>
                {passwordStrength === 'weak' && '弱'}
                {passwordStrength === 'medium' && '中'}
                {passwordStrength === 'strong' && '强'}
              </span>
            </div>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              createRules.required('请确认密码'),
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              注册
            </Button>
          </Form.Item>

          <div className="register-footer">
            <span>已有账号？</span>
            <Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
