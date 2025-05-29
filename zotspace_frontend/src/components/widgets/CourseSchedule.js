import React, { useState, useEffect } from 'react';
import './Widgets.css';
import { auth } from '../../firebase.config';
import axios from 'axios';

const CourseSchedule = () => {
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8); // 8AM to 10PM

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const email = user.email;
        const { data: userIdData } = await axios.get(
          `http://localhost:8000/api/users/get-id/?email=${email}`
        );
        const currentUserId = userIdData.user_id;
        setUserId(currentUserId);

        const { data: coursesData } = await axios.get(
          `http://localhost:8000/api/users/${currentUserId}/courses/`
        );

        const colorPalette = ['#a4d4ae', '#ffcc80', '#90caf9', '#f48fb1', '#ce93d8', '#80cbc4'];
        const coloredCourses = coursesData.courses.map((course, i) => {
          const [courseId, day, startTime, endTime] = course;
          return {
            name: courseId,
            day,
            startTime,
            endTime,
            color: colorPalette[i % colorPalette.length],
          };
        });

        setCourses(coloredCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setLoading(false);
      }
    };

    fetchUserAndCourses();
  }, []);

  const getCourseForTimeSlot = (day, time) => {
    return courses.find(course =>
      course.day === day &&
      time >= course.startTime &&
      time < course.endTime
    );
  };

  if (loading) return <div>Loading schedule...</div>;
  if (!userId) return <div>Please log in to see your schedule.</div>;
  if (courses.length === 0) return <div>No courses scheduled.</div>;

  return (
    <div className="course-schedule-widget">
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
