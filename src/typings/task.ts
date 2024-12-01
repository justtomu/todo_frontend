export interface Task {
  created_at: string;
  updated_at: string;
  description: string;
  email: string;
  id: number;
  is_completed: boolean;
  username: string;
}

export interface fetchTasksResponse {
  page: number;
  pages: number;
  tasks: Task[];
  total: number;
}

export interface fetchTasksParams {
  page: number;
  sort_by: string;
  sort_order: string;
}

export interface createTaskParams {
  username: string;
  email: string;
  description: string;
}

export type createTaskResponse = Task;

export interface updateTaskParams {
  description?: string;
  is_completed?: boolean;
}

export type updateTaskResponse = Task;
