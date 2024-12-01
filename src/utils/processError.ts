import { AxiosError } from 'axios';
import { message } from 'antd';

export const processError = <T>(error: AxiosError<T>) => {
  if (error.response?.status === 401) {
    message.error('Unauthorized', 1).then(() => {
      window.open('/login', '_self');
    });
    return;
  }
  message.error(`Unexpected: ${String(error)}`);
};
