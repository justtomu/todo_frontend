import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import {
  fetchTasksRequest,
  createTaskRequest,
  updateTaskRequest,
} from '@services/api';
import {
  fetchTasksParams,
  createTaskParams,
  updateTaskParams,
} from '@typings/task';
import { Task } from '@typings';
import { processError } from '@utils/processError.ts';

interface TaskState {
  tasks: Task[];
  total: number;
  isLoading: boolean;
  error: string | null;
  pages: number;
}

type TaskAction =
  | { type: 'FETCH_TASKS_REQUEST' }
  | {
      type: 'FETCH_TASKS_SUCCESS';
      payload: { tasks: Task[]; total: number; pages: number };
    }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task };

const initialState: TaskState = {
  tasks: [],
  total: 0,
  isLoading: false,
  error: null,
  pages: 0,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_REQUEST':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: action.payload.tasks,
        total: action.payload.total,
        pages: action.payload.pages,
      };
    case 'FETCH_TASKS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    default:
      return state;
  }
};

const TaskContext = createContext<{
  state: TaskState;
  actions: {
    fetchTasks: (params: fetchTasksParams) => void;
    createTask: (params: createTaskParams) => Promise<void>;
    updateTask: (id: number, params: updateTaskParams) => Promise<void>;
  };
} | null>(null);

export const TaskProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasksAction = (params: fetchTasksParams) => {
    dispatch({ type: 'FETCH_TASKS_REQUEST' });
    fetchTasksRequest({ params })
      .then((response) => {
        dispatch({
          type: 'FETCH_TASKS_SUCCESS',
          payload: {
            tasks: response.data.tasks,
            total: response.data.total,
            pages: response.data.pages,
          },
        });
      })
      .catch((error) => {
        dispatch({ type: 'FETCH_TASKS_FAILURE', payload: error.message });
      });
  };

  const createTaskAction = (params: createTaskParams) => {
    return createTaskRequest({ params })
      .then(() => {
        return Promise.resolve();
      })
      .catch((error) => {
        processError(error);
      });
  };

  const updateTaskAction = (id: number, params: updateTaskParams) => {
    return updateTaskRequest({ id, params })
      .then((updatedTask) => {
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask.data });
        return Promise.resolve();
      })
      .catch((error) => {
        processError(error);
        return Promise.reject(error);
      });
  };

  return (
    <TaskContext.Provider
      value={{
        state,
        actions: {
          fetchTasks: fetchTasksAction,
          createTask: createTaskAction,
          updateTask: updateTaskAction,
        },
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
