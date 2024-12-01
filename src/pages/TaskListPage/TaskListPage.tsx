import React, { useEffect, useMemo, useState } from 'react';
import { useTaskContext } from '@context/TaskContext';
import styles from './TaskListPage.module.scss';
import { CreateTaskModal } from '@components/CreateTaskModal';
import { Each, Exists } from '@utils';
import { getUserData, removeUser } from '@typings/api/auth.ts';
import clsx from 'clsx';
import { Task } from '@typings';
import { SimpleEditableText } from '@components';
import { message } from 'antd';

export const TaskListPage: React.FC = () => {
  const {
    state: { tasks, isLoading, pages },
    actions: { fetchTasks, createTask, updateTask },
  } = useTaskContext();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('username');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [isModalOpen, setModalOpen] = useState(false);

  const userData = useMemo(() => getUserData(), []);

  const updateTaskList = () =>
    fetchTasks({ page, sort_by: sortBy, sort_order: sortOrder });

  useEffect(() => {
    updateTaskList();
  }, [page, sortBy, sortOrder]);

  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateTask = (
    username: string,
    email: string,
    description: string
  ) => {
    createTask({ username, email, description }).then(() => {
      message.success('Task created successfully');
      updateTaskList();
    });
    setModalOpen(false);
  };

  const handleTaskCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    task: Task
  ) => {
    updateTask(task.id, { is_completed: e.target.checked });
  };

  const handleTaskEdit = (value: string, task: Task) => {
    return updateTask(task.id, { description: value })
      .then(() => Promise.resolve(value))
      .catch(() => {
        return Promise.resolve(task.description);
      });
  };

  const handleSignOut = () => {
    removeUser();
    window.location.reload();
  };

  return (
    <div className={styles.taskListPageContainer}>
      <div className={styles.taskListPageContent}>
        <h1>Task List</h1>
        <div className={styles.createTaskContainer}>
          <button
            className={styles.createTaskButton}
            onClick={() => setModalOpen(true)}
          >
            + New task
          </button>
        </div>
        <div className={styles.sortOptions}>
          <button onClick={() => handleSortChange('username')}>
            Sort by Username{' '}
            {sortBy === 'username' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSortChange('email')}>
            Sort by Email{' '}
            {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSortChange('is_completed')}>
            Sort by Status{' '}
            {sortBy === 'is_completed' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        <Exists visible={isLoading}>
          <p>Loading tasks...</p>
        </Exists>
        <Exists visible={!isLoading}>
          <ul className={styles.taskList}>
            <Each<Task>
              of={tasks}
              render={(task) => (
                <div
                  className={clsx(
                    styles.taskItem,
                    task.is_completed ? styles.completed : ''
                  )}
                >
                  <li>
                    <h3>
                      <SimpleEditableText
                        isEditable={!!userData}
                        initialValue={task.description}
                        onCommit={(value) => handleTaskEdit(value, task)}
                      />
                    </h3>
                    <p>User: {task.username}</p>
                    <p>Email: {task.email}</p>
                    <Exists visible={task.updated_at !== task.created_at}>
                      <p>Edited by administrator</p>
                    </Exists>
                  </li>
                  <div className={styles.checkboxStyled}>
                    <input
                      type="checkbox"
                      disabled={!userData}
                      defaultChecked={task.is_completed}
                      id={String(task.id)}
                      onChange={(e) => handleTaskCheck(e, task)}
                    />
                    <label htmlFor={String(task.id)}></label>
                  </div>
                </div>
              )}
            />
          </ul>
        </Exists>
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
            disabled={page === pages}
          >
            Next
          </button>
        </div>
        <div className={styles.taskListFooter}>
          <Exists visible={!!userData}>
            <p>
              Logged in as {userData?.username}{' '}
              <a onClick={handleSignOut} href={'#'}>
                sign out
              </a>
            </p>
          </Exists>
          <Exists visible={!userData}>
            <p>
              <a href={'/login'}>sign in </a>
              to edit tasks
            </p>
          </Exists>
        </div>
      </div>
      <Exists visible={isModalOpen}>
        <CreateTaskModal
          onClose={() => setModalOpen(false)}
          onCreate={handleCreateTask}
        />
      </Exists>
    </div>
  );
};
