import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Schedule from './pages/Schedule';
import StudyGroup from './pages/StudyGroup';

function Home() {
  const navigate = useNavigate();

  const handleSchedule = () => {
    navigate('/schedule');
  };

  const handleFindStudyGroup = () => {
    navigate('/study-group');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ZotSpace</h1>
        <p>Your Ultimate Study Space Management Solution</p>
        <div className="button-container">
          <button 
            className="action-button"
            onClick={handleSchedule}
          >
            Schedule
          </button>
          <button 
            className="action-button"
            onClick={handleFindStudyGroup}
          >
            Find Study Group
          </button>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/study-group" element={<StudyGroup />} />
      </Routes>
    </Router>
  );
}

export default App;
