import React from 'react';
import './Dashboard.css';
import CourseSchedule from './widgets/CourseSchedule';
import Requirements from './widgets/Requirements';
import DifficultyMeter from './widgets/DifficultyMeter';
import TodoList from './widgets/TdDoList';
import StudyRooms from './widgets/StudyRooms';
import CalendarWidget from './widgets/Calendar';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>ZotSpace Dashboard</h1>
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