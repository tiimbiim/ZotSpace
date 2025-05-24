import React, { useState } from 'react';
import './Widgets.css';

const StudyRooms = () => {
  // Replace with study room data
  const [rooms] = useState([
  ]);

  const getOccupancyColor = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 50) return '#4dff4d';
    if (percentage < 80) return '#ffd700';
    return '#ff4d4d';
  };

  return (
    <div className="study-rooms-widget">
      <h2>Study Spaces</h2>
      <div className="study-rooms-grid">
      </div>
    </div>
  );
};

export default StudyRooms; 