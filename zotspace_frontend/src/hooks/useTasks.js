import { useState, useEffect } from 'react';

const defaultTasks = [
  { id: 1, text: 'Complete CS 161 Project', completed: false, category: 'Assignments', dueDate: '2024-03-20' },
  { id: 2, text: 'Study for ICS 139W Midterm', completed: false, category: 'Exams', dueDate: '2024-03-15' },
  { id: 3, text: 'Go to the gym', completed: true, category: 'Other', dueDate: '2024-03-10' },
];

export const useTasks = () => {
  // Initialize state with tasks from localStorage or default tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, {
      ...newTask,
      id: Date.now()
    }]);
  };

  const toggleTask = (id) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask
  };
}; 