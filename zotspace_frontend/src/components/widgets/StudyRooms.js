import React, { useState } from 'react';
import './Widgets.css';

const StudyRooms = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [techEnhanced, setTechEnhanced] = useState('all');

  const locations = [
    'Langson Library',
    'Gateway Study Center',
    'Science Library',
    'Multimedia Resources Center'
  ];

  const capacityOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const studySpaces = [
    {
      id: "102070",
      name: "Science 176",
      location: "Multimedia Resources Center",
      capacity: 2,
      techEnhanced: false,
      features: ['iMac Desktop', '4K display', 'HDMI Connection', 'Lecture-style seats', 'Podium'],
      availableSlots: [
        { start: "1:00 PM", end: "1:30 PM" },
        { start: "1:30 PM", end: "2:00 PM" },
        { start: "2:00 PM", end: "2:30 PM" }
      ]
    },
    {
      id: "178734",
      name: "Study Pod 2B",
      location: "Science Library",
      capacity: 1,
      techEnhanced: false,
      features: [''],
      availableSlots: [
        { start: "1:00 PM", end: "1:30 PM" },
        { start: "1:30 PM", end: "2:00 PM" },
        { start: "2:00 PM", end: "2:30 PM" }
      ]
    },
    {
      id: "44697",
      name: "Langson 382",
      location: "Langson Library",
      capacity: 6,
      techEnhanced: false,
      features: [''],
      availableSlots: [
        { start: "1:00 PM", end: "1:30 PM" },
        { start: "1:30 PM", end: "2:00 PM" },
        { start: "2:00 PM", end: "2:30 PM" }
      ]
    },
    {
      id: "44697",
      name: "Langson 382",
      location: "Langson Library",
      capacity: 6,
      techEnhanced: false,
      features: [''],
      availableSlots: [
        { start: "1:00 PM", end: "1:30 PM" },
        { start: "1:30 PM", end: "2:00 PM" },
        { start: "2:00 PM", end: "2:30 PM" }
      ]
    }
  ];

  const filteredSpaces = studySpaces.filter(space => {
    const locationMatch = selectedLocation === 'all' || space.location === selectedLocation;
    const capacityMatch = selectedCapacity === 'all' || space.capacity >= parseInt(selectedCapacity);
    const techMatch = techEnhanced === 'all' || 
      (techEnhanced === 'yes' && space.techEnhanced) || 
      (techEnhanced === 'no' && !space.techEnhanced);
    
    return locationMatch && capacityMatch && techMatch;
  });

  const getThreeRooms = () => {
    return filteredSpaces.slice(0, 3);
  };

  return (
    <div className="study-rooms-widget">
      <div className="filters-section">
        <div className="filter-group">
          <label>Location:</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Capacity:</label>
          <select 
            value={selectedCapacity} 
            onChange={(e) => setSelectedCapacity(e.target.value)}
            className="filter-select"
          >
            <option value="all">Any Capacity</option>
            {capacityOptions.map(cap => (
              <option key={cap} value={cap}>{cap} People</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Tech Enhanced:</label>
          <select 
            value={techEnhanced} 
            onChange={(e) => setTechEnhanced(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Rooms</option>
            <option value="yes">Tech Enhanced Only</option>
            <option value="no">Non-Tech Enhanced Only</option>
          </select>
        </div>
      </div>

      <div className="study-rooms-grid">
        {getThreeRooms().map(space => (
          <div key={space.id} className="study-room-card">
            <div className="room-header">
              <h3>{space.name}</h3>
            </div>
            <div className="room-info">
              <p className="room-location">Location: {space.location}</p>
              <p className="room-capacity">Capacity: {space.capacity} people</p>
              {space.techEnhanced && (
                <p className="tech-enhanced">✓ Tech Enhanced</p>
              )}
            </div>
            <div className="available-slots">
              <h4>Available Time Slots:</h4>
              {space.availableSlots.map((slot, index) => (
                <div key={index} className="time-slot">
                  {slot.start} - {slot.end}
                </div>
              ))}
            </div>
            <div className="room-features">
              {space.features.map((feature, index) => (
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