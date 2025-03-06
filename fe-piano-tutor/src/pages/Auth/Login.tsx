import React from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { useAppDispatch, useAppSelector } from 'store';
import { loginUser } from 'store/slices/authSlice';
import styled from 'styled-components';

/* Refs: None */

/* Props & Store: No additional props; Uses Redux store */
interface ILoginProps {}

/* States: Managed by Ant Design Form */
const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
`;

/* Handlers: Defined inside the component */
const Login: React.FC<ILoginProps> = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  /* Handlers */
  const onFinish = (values: any) => {
    dispatch(loginUser(values));
  };

  /* Effects: None for now */

  /* Render */
  return (
    <LoginContainer>
      <Typography.Title level={2}>Login</Typography.Title>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Form name="login" layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email!' }]}>
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </LoginContainer>
  );
};

export default Login;
