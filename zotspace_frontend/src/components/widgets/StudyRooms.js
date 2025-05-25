import React from 'react';
import './Widgets.css';

const StudyRooms = () => {
  // Sample study room data
  const studyRooms = [
    {
      id: 1,
      name: 'Langson Library',
      occupancy: 75,
      features: ['Quiet Zone', 'Power Outlets', 'Wi-Fi'],
      availableHours: '8:00 AM - 11:00 PM'
    },
    {
      id: 2,
      name: 'Science Library',
      occupancy: 45,
      features: ['Group Study', 'Whiteboards', 'Wi-Fi'],
      availableHours: '7:00 AM - 10:00 PM'
    },
    {
      id: 3,
      name: 'Student Center',
      occupancy: 60,
      features: ['Cafe Nearby', 'Power Outlets', 'Wi-Fi'],
      availableHours: '6:00 AM - 12:00 AM'
    },
    {
      id: 4,
      name: 'Engineering Hall',
      occupancy: 85,
      features: ['Computer Lab', 'Power Outlets', 'Wi-Fi'],
      availableHours: '7:00 AM - 9:00 PM'
    }
  ];

  // Get 3 study rooms based on availability
  const getThreeRooms = () => {
    return [...studyRooms]
      .slice(0, 3);
  };

  return (
    <div className="study-rooms-widget">
      <h2>Study Spaces</h2>
      <div className="study-rooms-grid">
        {getThreeRooms().map(room => (
          <div key={room.id} className="study-room-card">
            <div className="room-header">
              <h3>{room.name}</h3>
              <span className="available-hours">{room.availableHours}</span>
            </div>
            <div className="occupancy-info">
              <div className="occupancy-text">
                <span>Current Occupancy</span>
                <span>{room.occupancy}%</span>
              </div>
              <div className="occupancy-bar">
                <div 
                  className="occupancy-fill"
                  style={{ 
                    width: `${room.occupancy}%`,
                    backgroundColor: room.occupancy > 80 ? '#ff4444' : 
                                   room.occupancy > 60 ? '#ffd700' : '#4CAF50'
                  }}
                />
              </div>
            </div>
            <div className="room-features">
              {room.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyRooms;