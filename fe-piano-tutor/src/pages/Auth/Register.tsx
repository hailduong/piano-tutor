import React from 'react'
import {Form, Input, Button, Typography, Alert} from 'antd'
import {useAppDispatch, useAppSelector} from 'store'
import {registerUser} from 'store/slices/authSlice'
import styled from 'styled-components'

const RegisterContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 24px;
`

interface IFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}


const Register: React.FC = () => {
  const dispatch = useAppDispatch()
  const {loading, error} = useAppSelector((state) => state.auth)

  /* Handlers */
  const onFinish = (values: IFormValues) => {
    const {confirmPassword, ...rest} = values
    dispatch(registerUser(rest))
  }

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
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!'
            },
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }

                return Promise.reject(new Error('The two passwords that you entered do not match!'))
              }
            })
          ]}>
          <Input.Password placeholder="Confirm Password"/>
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
