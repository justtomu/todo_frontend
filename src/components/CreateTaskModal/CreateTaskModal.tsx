import React from 'react';
import styles from './CreateTaskModal.module.scss';
import { Form, Input } from 'antd';
import {emailRules, requiredRules} from '@utils';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (username: string, email: string, description: string) => void;
}

interface FormValues {
  username: string;
  email: string;
  description: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [form] = Form.useForm<FormValues>();

  const handleSubmit = ({ username, email, description }: FormValues) => {
    onCreate(username, email, description);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Form form={form} layout={'vertical'} onFinish={handleSubmit}>
          <h2>Create New Task</h2>
          <Form.Item name={'username'} rules={requiredRules}>
            <Input type="text" placeholder="Username" />
          </Form.Item>
          <Form.Item name={'email'} rules={emailRules}>
            <Input type="email" placeholder="Email" />
          </Form.Item>
          <Form.Item name={'description'} rules={requiredRules}>
            <Input type="text" placeholder="Task Description" />
          </Form.Item>
          <div className={styles.modalActions}>
            <button type={'submit'}>Create</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </Form>
      </div>
    </div>
  );
};
