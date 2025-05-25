import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseSched.css';
import backgroundImage from '../assets/dash_background.jpg';

const CourseSched = () => {
  const navigate = useNavigate();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8);

  // Replace with actual courses
  const courses = [
    { 
      name: 'CS 161', 
      day: 'Monday', 
      startTime: 10, 
      endTime: 11, 
      color: '#FFD700',
      location: 'DBH 1100',
      professor: 'Dr. ?',
    },
    { 
      name: 'ICS 139W', 
      day: 'Wednesday', 
      startTime: 14, 
      endTime: 15, 
      color: '#98FB98',
      location: 'HICF 100K',
      professor: 'Dr. ?',
    },
    { 
      name: 'CS 122A', 
      day: 'Thursday', 
      startTime: 12, 
      endTime: 13, 
      color: '#87CEEB',
      location: 'ICS 174',
      professor: 'Dr. ?',
    },
  ];

  const getCourseForTimeSlot = (day, time) => {
    return courses.find(course => 
      course.day === day && 
      time >= course.startTime && 
      time < course.endTime
    );
  };

  return (
    <div className="dashboard" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="course-schedule-page">
        <div className="header">
          <h1>Course Schedule</h1>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>

        <div className="schedule-container">
          <div className="schedule-grid">
            <div className="time-column">
              <div className="header-cell"></div>
              {timeSlots.map(time => (
                <div key={time} className="time-cell">
                  {time % 12 === 0 ? 12 : time % 12}:00 {time >= 12 ? 'PM' : 'AM'}
                </div>
              ))}
            </div>
            {daysOfWeek.map(day => (
              <div key={day} className="day-column">
                <div className="header-cell">{day}</div>
                {timeSlots.map(time => {
                  const course = getCourseForTimeSlot(day, time);
                  return (
                    <div 
                      key={`${day}-${time}`} 
                      className={`schedule-cell ${course ? 'has-course' : ''}`}
                      style={course ? { backgroundColor: course.color } : {}}
                    >
                      {course && (
                        <div className="course-details">
                          <div className="course-name">{course.name}</div>
                          <div className="course-location">{course.location}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="course-list">
            <h2>Course Details</h2>
            {courses.map(course => (
              <div key={course.name} className="course-card" style={{ borderLeft: `4px solid ${course.color}` }}>
                <h3>{course.name}</h3>
                <p><strong>Professor:</strong> {course.professor}</p>
                <p><strong>Time:</strong> {course.day} {course.startTime % 12 || 12}:00 {course.startTime >= 12 ? 'PM' : 'AM'}</p>
                <p><strong>Location:</strong> {course.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSched;
