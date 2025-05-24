import React from 'react';
import './StudyGroup.css';

function StudyGroup() {
  return (
    <div className="study-group-page">
      <header className="study-group-header">
        <h1>Find Study Group</h1>
        <p>Connect with other students for group study sessions</p>
      </header>
      <main className="study-group-content">
        <div className="search-section">
          <h2>Search Study Groups</h2>
          <div className="search-filters">
            <input 
              type="text" 
              placeholder="Search by subject or course..."
              className="search-input"
            />
            <select className="filter-select">
              <option value="">All Subjects</option>
              <option value="cs">Computer Science</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>
        </div>
        <div className="groups-list">
          <h2>Available Study Groups</h2>
          <div className="group-card">
            <h3>CS 143 Study Group</h3>
            <p>Meeting Time: Monday, 2:00 PM</p>
            <p>Location: Science Library</p>
            <p>Members: 4/6</p>
            <button className="join-button">Join Group</button>
          </div>
          {/* More group cards will be added dynamically */}
        </div>
      </main>
    </div>
  );
}

export default StudyGroup; 