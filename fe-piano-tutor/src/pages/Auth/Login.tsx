import React, {useEffect} from 'react'
import {Form, Input, Button, Typography, Alert, Card} from 'antd'
import {Link} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from 'store'
import {logout} from 'store/slices/auth/auth.slice'
import {LinkContainer, ProfileContainer, LoginContainer} from 'pages/Auth/styles/Login.styled'
import {loginUser} from 'store/slices/auth/auth.thunks'

// Helper function to check token expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    return true
  }
}

interface ILoginProps {
}

const Login: React.FC<ILoginProps> = () => {
  const dispatch = useAppDispatch()
  const {user, token, loading, error} = useAppSelector((state) => state.auth)

  // Auto logout if token is expired
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout())
    }
  }, [token, dispatch])

  const onFinish = (values: any) => {
    dispatch(loginUser(values))
  }

  if (user) {
    return (
      <ProfileContainer>
        <Card title="Profile">
          <p>You are logged in as: {user.email || 'User'}</p>
          <Button type="primary" danger onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </Card>
      </ProfileContainer>
    )
  }

  /* Render */
  return (
    <LoginContainer>
      <Card>
        <Typography.Title level={2}>Login</Typography.Title>
        <Typography.Paragraph>
          Log in now to save your progress, receive the latest updates, and unlock exclusive benefits!
        </Typography.Paragraph>
        {error && <Alert type="error" message={error} style={{marginBottom: 16}}/>}
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{required: true, message: 'Please input your email!'}, {type: 'email', message: 'Invalid email!'}]}>
            <Input placeholder="Email"/>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{required: true, message: 'Please input your password!'}]}>
            <Input.Password placeholder="Password"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <LinkContainer>
          <Typography.Text>
            Don't have an account? <Link to="/auth/register">Register</Link>
          </Typography.Text>
          <Typography.Text>
            Forgot your password? <Link to="/auth/password-reset">Reset Password</Link>
          </Typography.Text>
        </LinkContainer>
      </Card>
    </LoginContainer>
  )
}

export default Login
