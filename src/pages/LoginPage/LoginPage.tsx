import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLoginRequest } from '@services/api';
import styles from './LoginPage.module.scss';
import { Exists, requiredRules } from '@utils';
import { Form, Input } from 'antd';

interface FormValues {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const handleLogin = ({ username, password }: FormValues) => {
    adminLoginRequest({ params: { username, password } })
      .then(() => navigate('/tasks'))
      .catch(() => setError('Invalid username or password.'));
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      form.validateFields().then(handleLogin);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <Form form={form} layout={'vertical'} onFinish={handleLogin}>
          <h2>Admin Login</h2>
          <Exists visible={error !== null}>
            <p className={styles.errorMessage}>{error}</p>
          </Exists>
          <Form.Item name={'username'} rules={requiredRules}>
            <Input
              type="text"
              placeholder="Username"
              onKeyUp={handleEnterPress}
            />
          </Form.Item>
          <Form.Item name={'password'} rules={requiredRules}>
            <Input
              type="password"
              placeholder="Password"
              onKeyUp={handleEnterPress}
            />
          </Form.Item>
          <button type={'submit'}>Login</button>
        </Form>
      </div>
    </div>
  );
};
