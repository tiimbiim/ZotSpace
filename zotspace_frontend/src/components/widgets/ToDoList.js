import React, { useState } from 'react';
import './Widgets.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete CS 161 Project', completed: false, category: 'Assignments', dueDate: '2024-03-20' },
    { id: 2, text: 'Study for ICS 139W Midterm', completed: false, category: 'Exams', dueDate: '2024-03-15' },
    { id: 3, text: 'Go to the gym', completed: true, category: 'Other', dueDate: '2024-03-10' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Assignments', 'Exams', 'Other'];

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      category: selectedCategory === 'All' ? 'Other' : selectedCategory,
      dueDate: new Date().toISOString().split('T')[0]
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = selectedCategory === 'All'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <div className="todo-list-widget">
      <h2>To-Do List</h2>
      <div className="todo-controls">
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="task-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button type="submit" className="add-button">Add</button>
        </form>
      </div>
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="tasks-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className="task-text">{task.text}</span>
              <span className="task-category">{task.category}</span>
              <span className="task-due-date">{task.dueDate}</span>
            </div>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;