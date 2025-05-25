import React from 'react';
import { useNavigate } from 'react-router-dom';
// added
import { auth } from '../firebase.config.js';
// added
import './Dashboard.css';
import CourseSchedule from './widgets/CourseSchedule';
import Requirements from './widgets/Requirements';
import DifficultyMeter from './widgets/DifficultyMeter';
import TodoList from './widgets/ToDoList';
import StudyRooms from './widgets/StudyRooms';
import StudyTimer from './widgets/StudyTimer';
import ScheduleContainer from './widgets/ScheduleContainer';
import backgroundImage from '../assets/dash_background.png';

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

  const handleCourseScheduleClick = () => {
    navigate('/course-schedule');
  };

  const handleStudySpacesClick = () => {
    navigate('/study-spaces');
  };

  return (
    <div className="dashboard" style={{ backgroundImage: `url(${backgroundImage})`, maxWidth: '100vw'}}>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h1>ZotSpace Dashboard</h1>
      <h2 className="subtitle">Organize your world, the <i>ZOT</i> way. </h2>
      <div className="dashboard-grid">
        <div className="widget course-schedule">
          <div className="widget-header" onClick={handleCourseScheduleClick} style={{ cursor: 'pointer' }}>
            <h2>Course Schedule</h2>
          </div>
          <CourseSchedule />
          {/* <ScheduleContainer /> */}
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
        <div className="widget study-timer">
          <StudyTimer />
        </div>
        <div className="widget study-rooms">
          <div className="widget-header" onClick={handleStudySpacesClick} style={{ cursor: 'pointer' }}>
            <h2>Study Rooms & Groups</h2>
          </div>
          <StudyRooms />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;