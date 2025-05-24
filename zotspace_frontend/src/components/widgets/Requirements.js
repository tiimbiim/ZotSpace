import React from 'react';
import './Widgets.css';

const Requirements = () => {
  // Replace with actual requirement data
  const requirements = [
    { 
      category: 'Lower Division',
      completed: 8,
      total: 10,
      courses: ['ICS 31', 'ICS 32', 'ICS 33', 'ICS 45C', 'ICS 46', 'ICS 51', 'Math 2A', 'Math 2B']
    },
    {
      category: 'Upper Division',
      completed: 6,
      total: 12,
      courses: ['CS 161', 'CS 122A', 'ICS 139W', 'CS 132', 'CS 143A', 'CS 121']
    },
    {
      category: 'General Education',
      completed: 3,
      total: 10,
      courses: ['WR 50', 'MUSIC 51', 'SOCIO 1']
    }
  ];

  return (
    <div className="requirements-widget">
      <h2>Degree Progress</h2>
      {requirements.map((req, index) => (
        <div key={index} className="requirement-category">
          <div className="requirement-header">
            <h3>{req.category}</h3>
            <span className="progress-text">
              {req.completed}/{req.total} Completed
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(req.completed / req.total) * 100}%` }}
            />
          </div>
          <div className="completed-courses">
            {req.courses.map((course, i) => (
              <span key={i} className="course-tag">{course}</span>
            ))}
          </div>
        </div>
      ))}
      <div className="overall-progress">
        <h3>Overall Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${(requirements.reduce((acc, req) => acc + req.completed, 0) / 
                        requirements.reduce((acc, req) => acc + req.total, 0)) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Requirements; 