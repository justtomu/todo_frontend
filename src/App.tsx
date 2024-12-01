import React from 'react';
import { TaskProvider } from '@context/TaskContext';
import AppRouter from '@routes/index';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppRouter />
    </TaskProvider>
  );
};

export default App;
