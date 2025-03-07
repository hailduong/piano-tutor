import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Tabs } from 'antd';
import { useAppDispatch, useAppSelector } from 'store';
import styled from 'styled-components';
import {resetPassword, requestPasswordReset} from 'store/slices/auth/auth.thunks'

/* Refs: None */

/* Props & Store: No additional props; Uses Redux store */
interface IPasswordResetProps {}

/* States: Managed by component and Ant Design Form */
const PasswordResetContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
`;

/* Handlers: Defined inside the component */
const PasswordReset: React.FC<IPasswordResetProps> = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'request' | 'confirm'>('request');

  /* Handlers */
  const onRequestFinish = (values: any) => {
    dispatch(requestPasswordReset(values));
  };

  const onConfirmFinish = (values: any) => {
    dispatch(resetPassword(values));
  };

  /* Effects: None for now */

  /* Render */
  return (
    <PasswordResetContainer>
      <Typography.Title level={2}>Password Reset</Typography.Title>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as 'request' | 'confirm')}>
        <Tabs.TabPane tab="Request Reset" key="request">
          <Form name="passwordResetRequest" layout="vertical" onFinish={onRequestFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email!' }]}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Request Reset
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Confirm Reset" key="confirm">
          <Form name="passwordResetConfirm" layout="vertical" onFinish={onConfirmFinish}>
            <Form.Item
              name="token"
              label="Reset Token"
              rules={[{ required: true, message: 'Please input your reset token!' }]}>
              <Input placeholder="Reset Token" />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ required: true, message: 'Please input your new password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}>
              <Input.Password placeholder="New Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </PasswordResetContainer>
  );
};

export default PasswordReset;
