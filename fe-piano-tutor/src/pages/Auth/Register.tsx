import React from 'react'
import {Form, Input, Button, Typography, Alert} from 'antd'
import {useAppDispatch, useAppSelector} from 'store'
import {registerUser} from 'store/slices/authSlice'
import styled from 'styled-components'

/* Props & Store: No additional props; Uses Redux store */
interface IRegisterProps {
}

/* States: Local form state is managed by Ant Design Form */
const RegisterContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 24px;
`

/* Handlers: Will be defined inside the component */

const Register: React.FC<IRegisterProps> = () => {
  const dispatch = useAppDispatch()
  const {loading, error} = useAppSelector((state) => state.auth)

  /* Handlers */
  const onFinish = (values: any) => {
    dispatch(registerUser(values))
  }

  /* Effects: None for now */

  /* Render */
  return (
    <RegisterContainer>
      <Typography.Title level={2}>Register</Typography.Title>
      {error && <Alert type="error" message={error} style={{marginBottom: 16}}/>}
      <Form name="register" layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{required: true, message: 'Please input your email!'}, {type: 'email', message: 'Invalid email!'}]}>
          <Input placeholder="Email"/>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{required: true, message: 'Please input your password!'}, {
            min: 6,
            message: 'Password must be at least 6 characters!'
          }]}>
          <Input.Password placeholder="Password"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </RegisterContainer>
  )
}

export default Register
