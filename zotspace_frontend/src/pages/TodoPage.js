import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import '../components/widgets/Widgets.css';
import { useNavigate } from 'react-router-dom';
import './TodoPage.css';

const TodoPage = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  const categories = ['All', 'Assignments', 'Exams', 'Other'];
  
  const navigate = useNavigate();

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    addTask({
      text: newTask,
      completed: false,
      category: selectedCategory === 'All' ? 'Other' : selectedCategory,
      dueDate: selectedDate || new Date().toISOString().split('T')[0]
    });

    setNewTask('');
    setSelectedDate('');
  };

  const getAllTasks = () => {
    return tasks
      .filter(task => selectedCategory === 'All' || task.category === selectedCategory)
      .sort((a, b) => {
        // Sort by completion status (incomplete first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then sort by due date
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  };

  return (
    <div className="todo-page">
      <div className="header">
        <h1>To-Do List</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
      <div className="todo-container">
        <div className="todo-controls">
          <form onSubmit={handleAddTask} className="add-task-form">
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
            <div className="date-wrapper">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
              <span className="calendar-icon">📅</span>
            </div>
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

        <div className="tasks-list full-list">
          {getAllTasks().map(task => (
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
    </div>
  );
};

export default TodoPage; 