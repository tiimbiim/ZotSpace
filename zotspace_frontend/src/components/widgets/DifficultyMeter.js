import React from 'react';
import './Widgets.css';

const DifficultyMeter = () => {
  // Replace with actual difficulty percentage
  const courses = [
    { name: 'CS 161', difficulty: 85 },
    { name: 'ICS 139W', difficulty: 45 },
    { name: 'CS 122A', difficulty: 70 },
    { name: 'CS 132', difficulty: 75 },
  ];

  return (
    <div className="difficulty-meter-widget">
      <h2>Course Difficulty</h2>
      <div className="difficulty-list">
        {courses.map((course, index) => (
          <div key={index} className="difficulty-item">
            <div className="difficulty-header">
              <span className="course-name">{course.name}</span>
              <div className="progress-bar" style={{ margin: '0 10px', flex: 1 }}>
                <div 
                  className="progress-fill"
                  style={{ width: `${course.difficulty}%`, backgroundColor: '#4CAF50' }}
                />
              </div>
              <span className="difficulty-percentage">{course.difficulty}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifficultyMeter;