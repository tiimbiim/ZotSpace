import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudySpaces.css';
import backgroundImage from '../assets/nl/nav_background.jpg';

const StudySpaces = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('spaces');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [techEnhanced, setTechEnhanced] = useState('all');
  const [studyGroups, setStudyGroups] = useState([
    {
      id: 1,
      name: "CS 143 Study Group",
      course: "CS 143",
      members: 4,
      maxMembers: 6,
      meetingTime: "Monday, 2:00 PM",
      location: "Science Library",
      description: "Weekly study group for CS 143. We focus on algorithms and data structures."
    },
    {
      id: 2,
      name: "Math 2D Study Group",
      course: "Math 2D",
      members: 3,
      maxMembers: 5,
      meetingTime: "Wednesday, 3:00 PM",
      location: "Gateway Study Center",
      description: "Study group for Math 2D. We work on practice problems and review concepts."
    }
  ]);

  useEffect(() => {
    // Listen for messages from the confirmation window
    const handleMessage = (event) => {
      if (event.data.type === 'JOIN_GROUP_CONFIRMED') {
        const groupId = event.data.groupId;
        setStudyGroups(prevGroups => 
          prevGroups.map(group => 
            group.id === groupId 
              ? { ...group, members: group.members + 1 }
              : group
          )
        );
      } else if (event.data.type === 'NEW_GROUP_CREATED') {
        const newGroup = event.data.group;
        setStudyGroups(prevGroups => [...prevGroups, newGroup]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
      ]
    },
    {
      id: "44697",
      name: "Langson 382",
      location: "Langson Library",
      capacity: 6,
      techEnhanced: false,
      features: ['Whiteboard'],
      availableSlots: [
        { start: "1:00 PM", end: "1:30 PM" },
        { start: "1:30 PM", end: "2:00 PM" },
        { start: "2:00 PM", end: "2:30 PM" }
      ]
    },
    {
      id: "44690",
      name: "Science 530",
      location: "Science Library",
      capacity: 6,
      techEnhanced: true,
      features: ['Digital Display'],
      availableSlots: [
        { start: "1:00 PM", end: "2:00 PM" },
        { start: "3:00 PM", end: "3:30 PM" },
        { start: "5:30 PM", end: "7:30 PM" },
        { start: "9:00 PM", end: "10:00 PM" },
      ]
    },
    {
      id: "44706",
      name: "Gateway 2103",
      location: "Gateway Study Center",
      capacity: 4,
      techEnhanced: false,
      features: ['Whiteboard'],
      availableSlots: [
        { start: "10:00 AM", end: "1:30 PM" },
        { start: "4:30 PM", end: "6:00 PM" },
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

  const handleJoinClick = (group) => {
    // Open confirmation in new tab with query parameters
    const groupData = encodeURIComponent(JSON.stringify(group));
    const confirmationUrl = `/join-group-confirmation?groupData=${groupData}`;
    const confirmationWindow = window.open(confirmationUrl, '_blank', 'width=500,height=600');
  };

  const handleCreateGroup = () => {
    // Open create group form in new tab
    window.open('/create-group', '_blank', 'width=600,height=800');
  };

  return (
    <div className="study-spaces-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <header className="study-spaces-header">
        <div className="header-content">
          <h1>Study Spaces & Groups</h1>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'spaces' ? 'active' : ''}`}
          onClick={() => setActiveTab('spaces')}
        >
          Study Spaces
        </button>
        <button 
          className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Study Groups
        </button>
      </div>

      <main className="study-spaces-content">
        {activeTab === 'spaces' ? (
          <div className="spaces-section">
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

            <div className="spaces-grid">
              {filteredSpaces.map(space => (
                <div key={space.id} className="space-card">
                  <div className="space-header">
                    <h3>{space.name}</h3>
                  </div>
                  <div className="space-info">
                    <p className="space-location">Location: {space.location}</p>
                    <p className="space-capacity">Capacity: {space.capacity} people</p>
                    {space.techEnhanced && (
                      <p className="tech-enhanced">✓ Tech Enhanced</p>
                    )}
                    <p className="space-description">{space.description}</p>
                  </div>
                  <div className="available-slots">
                    <h4>Available Time Slots:</h4>
                    {space.availableSlots.map((slot, index) => (
                      <div key={index} className="time-slot">
                        {slot.start} - {slot.end}
                      </div>
                    ))}
                  </div>
                  <div className="space-features">
                    {space.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="groups-section">
            <div className="groups-header">
              <h2>Available Study Groups</h2>
              <button className="create-group-btn" onClick={handleCreateGroup}>
                Create Study Group
              </button>
            </div>

            <div className="groups-grid">
              {studyGroups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    <span className="course-tag">{group.course}</span>
                  </div>
                  <div className="group-info">
                    <p><strong>Meeting Time:</strong> {group.meetingTime}</p>
                    <p><strong>Location:</strong> {group.location}</p>
                    <p><strong>Members:</strong> {group.members}/{group.maxMembers}</p>
                    <p className="group-description">{group.description}</p>
                  </div>
                  <div className="group-actions">
                    <button 
                      className="join-btn" 
                      onClick={() => handleJoinClick(group)}
                      disabled={group.members >= group.maxMembers}
                    >
                      Join Group
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudySpaces; 