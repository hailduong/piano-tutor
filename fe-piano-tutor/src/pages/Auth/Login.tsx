import React, {useEffect} from 'react'
import {useState} from 'react'
import {Form, Input, Button, Typography, Alert, Card} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import {useAppDispatch, useAppSelector} from 'store'
import {logout} from 'store/slices/auth/auth.slice'
import {loginUser, updateUserProfile} from 'store/slices/auth/auth.thunks'
import {LinkContainer, ProfileContainer, LoginContainer} from 'pages/Auth/styles/Login.styled'

// Helper function to check token expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch (error) {
    return true
  }
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {user, token, loading, error} = useAppSelector((state) => state.auth)
  const [updateError, setUpdateError] = useState<string | null>(null)

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout())
    }
  }, [token, dispatch])

 const onFinishLogin = async (values: any) => {
    await dispatch(loginUser(values)).unwrap()
    if (user && token && !isTokenExpired(token)) {
      navigate('/dashboard')
    }
  }

  const onFinishUpdate = (values: { firstName: string; lastName: string }) => {
    dispatch(updateUserProfile(values))
      .unwrap()
      .catch((err) => {
        setUpdateError(err.error || err)
      })
  }

  if (user) {
    return (
      <ProfileContainer>
        <Card className="mb-3">
          <Typography.Title level={3}>Profile</Typography.Title>
          {updateError && <Alert type="error" message={updateError} style={{marginBottom: 16}}/>}
          <Form
            name="profileUpdate"
            layout="vertical"
            initialValues={{firstName: user.firstName, lastName: user.lastName}}
            onFinish={onFinishUpdate}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{required: true, message: 'Please input your first name!'}]}
            >
              <Input placeholder="First Name"/>
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{required: true, message: 'Please input your last name!'}]}
            >
              <Input placeholder="Last Name"/>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Update Profile
              </Button>
            </Form.Item>
            <LinkContainer>
              <Typography.Text>
                Want to change your password? <br/>
                <Link to="/auth/password-reset">Reset Password</Link>
              </Typography.Text>
            </LinkContainer>
          </Form>
        </Card>
        <Card title="Account">
          <p>You are logged in as: {user?.email || 'User'}</p>
          <Button type="primary" danger onClick={() => dispatch(logout())} style={{marginBottom: '16px'}}>
            Logout
          </Button>
        </Card>
      </ProfileContainer>
    )
  }

  return (
    <LoginContainer>
      <Card>
        <Typography.Title level={2}>Login</Typography.Title>
        <Typography.Paragraph>
          Log in now to save your progress, receive the latest updates, and unlock exclusive benefits!
        </Typography.Paragraph>
        {error && <Alert type="error" message={error} style={{marginBottom: 16}}/>}
        <Form name="login" layout="vertical" onFinish={onFinishLogin}>
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
