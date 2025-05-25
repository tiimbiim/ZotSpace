import React from 'react';
import './Widgets.css';

const CourseSchedule = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 9); 

  // Replace with actual courses
  const courses = [
    { name: 'CS 161', day: 'Monday', startTime: 10, endTime: 11, color: '#FFD700' },
    { name: 'ICS 139W', day: 'Wednesday', startTime: 14, endTime: 15, color: '#98FB98' },
    { name: 'CS 122A', day: 'Thursday', startTime: 12, endTime: 13, color: '#87CEEB' },
  ];

  const getCourseForTimeSlot = (day, time) => {
    return courses.find(course => 
      course.day === day && 
      time >= course.startTime && 
      time < course.endTime
    );
  };

  return (
    <div className="course-schedule-widget">
      <h2>Course Schedule</h2>
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
                  {course && <div className="course-name">{course.name}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSchedule;