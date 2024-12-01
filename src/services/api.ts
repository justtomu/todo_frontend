import axios, { AxiosInstance } from 'axios';
import {
  createTaskParams,
  createTaskResponse,
  fetchTasksParams,
  fetchTasksResponse,
  updateTaskParams,
  updateTaskResponse,
} from '@typings/task.ts';
import { ServiceFetchType } from '@typings/api/services.ts';
import { authHeader, saveUser } from '@typings/api/auth.ts';
import { adminLoginParams, adminLoginResponse } from '@typings/admin.ts';
import { getEnvValue } from '@utils';

const API_BASE_URL = getEnvValue(
  'REACT_APP_BASE_URL_SERVER',
  'http://localhost:5000/'
);

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTasksRequest: ServiceFetchType<
  fetchTasksResponse,
  fetchTasksParams
> = ({ params }) => {
  return apiClient
    .get('/tasks/', {
      params,
    })
    .then((response) => response)
    .catch((error) => {
      console.error('Error fetching tasks:', error);
      throw error;
    });
};

export const createTaskRequest: ServiceFetchType<
  createTaskResponse,
  createTaskParams
> = ({ params }) => {
  return apiClient
    .post('/tasks/', params)
    .then((response) => response)
    .catch((error) => {
      console.error('Error creating task:', error);
      throw error;
    });
};

export const updateTaskRequest: ServiceFetchType<
  updateTaskResponse,
  updateTaskParams
> = ({ params, id }) => {
  return apiClient
    .put(`/manage/${id}`, params, { headers: authHeader() })
    .then((response) => response)
    .catch((error) => {
      console.error('Error updating task:', error);
      throw error;
    });
};

export const adminLoginRequest: ServiceFetchType<
  adminLoginResponse,
  adminLoginParams
> = ({ params }) => {
  return apiClient
    .post('/admin/login', params)
    .then((response) => {
      saveUser(response.data);
      return response;
    })
    .catch((error) => {
      console.error('Error logging in as admin:', error);
      throw error;
    });
};
