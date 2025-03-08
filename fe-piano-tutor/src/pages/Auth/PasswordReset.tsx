import React, {useEffect, useState} from 'react'
import {Form, Input, Button, Typography, Alert, Tabs, Card} from 'antd'
import {useAppDispatch, useAppSelector} from 'store'
import styled from 'styled-components'
import {resetPassword, requestPasswordReset} from 'store/slices/auth/auth.thunks'
import {useLocation} from 'react-router-dom'


interface IPasswordResetProps {
}

const PasswordResetContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
`

const PasswordReset: React.FC<IPasswordResetProps> = () => {
  /* Store */
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const {loading, error} = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState<'request' | 'confirm'>('request')
  const [confirmForm] = Form.useForm()
  const location = useLocation()

  /* Effects */
  // Check if token is in URL and set active tab to confirm
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('token')

    if (token) {
      setActiveTab('confirm')
      confirmForm.setFieldsValue({token})
    }
  }, [location.search, confirmForm])

  /* Handlers */
  const onRequestFinish = (values: any) => {
    dispatch(requestPasswordReset(values))
  }

  const onConfirmFinish = async (values: any) => {
    await dispatch(resetPassword(values))
    window.location.href = '/auth/login'
  }


  /* Render */
  return (
    <PasswordResetContainer>
      <Card>
        <Typography.Title level={2}>Password Reset</Typography.Title>
        {error && <Alert type="error" message={error} style={{marginBottom: 16}}/>}
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'request' | 'confirm')}>
          <Tabs.TabPane tab="Request Reset" key="request">
            <Form name="passwordResetRequest" layout="vertical" onFinish={onRequestFinish}>
              <Form.Item
                name="email"
                label="Email"
                initialValue={user ? user.email : ''}
                rules={[{required: true, message: 'Please input your email!'}, {
                  type: 'email',
                  message: 'Invalid email!'
                }]}>
                <Input placeholder="Email" disabled={!!user}/>
              </Form.Item>
              <p className='mb-3'>You will receive an email with instructions to reset your password.</p>
              <Form.Item>
                <Button type="primary"  size='large' htmlType="submit" loading={loading} block>
                  Request Reset
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Confirm Reset" key="confirm">
            <Form
              form={confirmForm}
              name="passwordResetConfirm"
              layout="vertical"
              onFinish={onConfirmFinish}
            >
              <Form.Item
                name="token"
                label="Reset Token"
                rules={[{required: true, message: 'Please input your reset token!'}]}>
                <Input placeholder="Reset Token"/>
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{required: true, message: 'Please input your new password!'}, {
                  min: 6,
                  message: 'Password must be at least 6 characters!'
                }]}>
                <Input.Password placeholder="New Password"/>
              </Form.Item>
              <Form.Item>
                <Button type="primary" size='large' htmlType="submit" loading={loading} block>
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </PasswordResetContainer>
  )
}

export default PasswordReset
