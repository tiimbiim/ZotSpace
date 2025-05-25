import React from 'react';
import { useNavigate } from 'react-router-dom';
// added
import { auth } from '../firebase.config.js';
// added
import './Dashboard.css';
import CourseSchedule from './widgets/CourseSchedule';
import Requirements from './widgets/Requirements';
import DifficultyMeter from './widgets/DifficultyMeter';
import TodoList from './widgets/TodoList';
import StudyRooms from './widgets/StudyRooms';
import CalendarWidget from './widgets/Calendar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="dashboard">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h1>ZotSpace Dashboard</h1>
      <h2 className="subtitle">Organize your world, the <i>ZOT</i> way. </h2>
      <div className="dashboard-grid">
        <div className="widget course-schedule">
          <CourseSchedule />
        </div>
        <div className="widget difficulty-meter">
          <DifficultyMeter />
        </div>
        <div className="widget requirements">
          <Requirements />
        </div>
        <div className="widget todo-list">
          <TodoList />
        </div>
        <div className="widget calendar">
          <CalendarWidget />
        </div>
        <div className="widget study-rooms">
          <StudyRooms />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;