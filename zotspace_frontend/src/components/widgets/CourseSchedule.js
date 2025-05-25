import React from 'react';
import './Widgets.css';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react';
import axios from 'axios'

// const auth = getAuth();
// let user_email = null
// let user_uid = null
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const email = user.email;
//     user_email = email
//     console.log(email)
//     getUserId(email).then(uid => {
//       console.log('real', uid)
//       user_uid = uid
//     });
//   } else {
//     console.log("User not logged in")
//   }
// })

// const getUserId = async (email) => {
//     const response = await fetch(`http://localhost:8000/api/users/get-id/?email=${email}`);
//     const data = await response.text();
//     let json_data = JSON.parse(data)
//     console.log(json_data)
//     console.log(json_data["user_id"], json_data["email"])
//     return json_data["user_id"]
// };
// const getDataByUserId = async (uid) => {
//   const response = await fetch(`http://localhost:8000/api/users/${uid}/courses/`);
//   const text = await response.text();
//   const data = JSON.parse(text);
//   return data; // Assuming this is an array
// };

// 
console.log("COURSESCHEDULE")
const CourseSchedule = ({ courses = [], userId }) => {
  console.log('cs', courses)
  const safeCourses = Array.isArray(courses) ? courses : [];  
  const [inputValue, setInputValue] = useState('');

  console.log('safe courses', safeCourses)

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8);

  const getCourseForTimeSlot = (day, time) => {
    
    return safeCourses.find(course =>
      course.day === day &&
      time >= course.startTime &&
      time < course.endTime
    );
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {

      const response = await axios.post(`http://localhost:8000/api/users/${userId}/courses/add/`, {course_id: inputValue});

      if (response.ok) {
        console.log('Submitted successfully');
        setInputValue('');
      } else {
        console.error('Submission failed:', response.status);
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (

    


    <div className="course-schedule-widget">
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a message"
        />
        <button type="submit">Submit</button>
      </form>
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
