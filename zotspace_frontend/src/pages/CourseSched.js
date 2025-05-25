import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseSched.css';
import backgroundImage from '../assets/nav_background.png';
import { auth } from '../firebase.config';
import axios from 'axios'

const CourseSched = () => {
  const navigate = useNavigate();
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 8);

  // const [userId, setUserId] = useState(null);
  const userId = useRef(null)
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const email = user.email;
        const uid = await getUserId(email);
        // setUserId(uid);
        userId.current = uid;
  
        const courseData = await getCoursesForUser(uid);
        const uniqueCourseData = Array.from(new Set(courseData.map(JSON.stringify)), JSON.parse);
  
        const colorPalette = ['#FFD700', '#98FB98', '#87CEEB', '#FFA07A', '#DDA0DD'];
        const courseColorMap = {};
        let colorIndex = 0;

        const enrichedCourses = await Promise.all(
          uniqueCourseData.map(async ([name, day, startTime, endTime]) => {
            if (!courseColorMap[name]) {
              courseColorMap[name] = colorPalette[colorIndex % colorPalette.length];
              colorIndex++;
            }

            const details = await getCourseDetails(name);
            return {
              name,
              day,
              startTime,
              endTime,
              color: courseColorMap[name],
              location: details.location || 'TBD',
              professor: details.professor || 'TBD',
              professorOptions: details.professorOptions
            };
          })
        );
  
        setCourses(enrichedCourses);
        setLoading(false);
        console.log('Enriched courses:', enrichedCourses);
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const getUserId = async (email) => {
    const response = await fetch(`http://localhost:8000/api/users/get-id/?email=${email}`);
    const data = await response.text();
    const json = JSON.parse(data);
    console.log(json)
    return json.user_id;
  };

  const getCoursesForUser = async (uid) => {
    const response = await fetch(`http://localhost:8000/api/users/${uid}/courses/`);
    const data = await response.text();
    const json = JSON.parse(data);
    return json['courses'];
  };

  const [formData, setFormData] = useState({
    courseId: '',
    day: 'Monday',
    startTime: 8,
    endTime: 9,
    prof: 'tbd'
  });

  const getCourseDetails = async (courseId) => {
    try {
      const response = await fetch(`https://anteaterapi.com/v2/rest/courses/${courseId}`)
      const data = await response.text();
      const json = JSON.parse(data);
      console.log(json,'THATHASD')
      console.log('json', json.data['instructors']);
      const instructorList = json.data['instructors'].map(instr => instr.name).filter(Boolean);

      return {
        professor: instructorList[0] || 'TBD',
        professorOptions: instructorList
      }; // e.g. { location: 'DBH 1100', professor: 'Dr. X' }
    } catch (error) {
      console.error(`Error fetching details for ${courseId}:`, error);
      return { location: 'TBD', professor: 'TBD' };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!userId.current) {
      alert('User not loaded yet.');
      return;
    }

    const newCourse = {
      course_id: formData.courseId,
      day: formData.day,
      start_time: parseInt(formData.startTime),
      end_time: parseInt(formData.endTime),
      prof: formData.prof || 'tbd'
    };

    try {
      const response = await axios.post(`http://localhost:8000/api/users/${userId.current}/courses/add/`, newCourse);

      if (response.status !== 200) {
        const errorText = await response.data;
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      alert('Course added successfully!');
      // Optionally reload or update courses state if needed
    } catch (err) {
      console.error(err);
      // alert('Failed to add course.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!userId.current) return <div>Error: User ID not found.</div>;

  const handleProfessorChange = async (courseIndex, newProfessor) => {
    const updatedCourses = [...courses];
    const courseToUpdate = updatedCourses[courseIndex];
  
    // Update frontend state
    courseToUpdate.professor = newProfessor;
    setCourses(updatedCourses);
  
    // Prepare payload
    const updatedCoursePayload = {
      course_id: courseToUpdate.name,
      day: courseToUpdate.day,
      start_time: parseInt(courseToUpdate.startTime),
      end_time: parseInt(courseToUpdate.endTime),
      prof: newProfessor
    };
    console.log('LALA', updatedCoursePayload)
    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/${userId.current}/courses/add/`,
        updatedCoursePayload
      );
  
      if (response.status !== 200) {
        throw new Error(`Failed with status ${response.status}`);
      }
  
      console.log(`Professor updated to ${newProfessor} for ${courseToUpdate.name}`);
    } catch (error) {
      console.error('Failed to update professor:', error);
    }
  };

  return (
    <div className="dashboard" style={{ backgroundImage: `url(${backgroundImage})`, maxWidth: '100vw' }}>
      <div className="course-schedule-page">
        <div className="header">
          <h1>Course Schedule</h1>
          <button className="back-button" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>


        <div className="schedule-container">
        <div className="schedule-grid" style={{ display: 'grid', gridTemplateColumns: `60px repeat(${daysOfWeek.length}, 1fr)` , gridTemplateRows: `40px repeat(${timeSlots.length}, 60px)` }}>
  {/* Time labels column */}
  <div style={{ gridColumn: 1, gridRow: 1 }}></div> {/* empty corner */}
  {daysOfWeek.map((day, dayIndex) => (
    <div key={day} style={{ gridColumn: dayIndex + 2, gridRow: 1, fontWeight: 'bold', textAlign: 'center' }}>
      {day}
    </div>
  ))}
  {timeSlots.map((time, i) => (
    <div key={time} style={{ gridColumn: 1, gridRow: i + 2, textAlign: 'right', paddingRight: 4, fontSize: 12 }}>
      {time % 12 === 0 ? 12 : time % 12}:00 {time >= 12 ? 'PM' : 'AM'}
    </div>
  ))}

  {/* Empty cells */}
  {daysOfWeek.map((day, dayIndex) =>
    timeSlots.map((time, timeIndex) => (
      <div
        key={`${day}-${time}`}
        style={{
          gridColumn: dayIndex + 2,
          gridRow: timeIndex + 2,
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
      />
    ))
  )}

  {/* Course blocks */}
  {courses.map((course) => {
    const dayIndex = daysOfWeek.indexOf(course.day);
    const startRow = timeSlots.indexOf(course.startTime) + 2;
    const span = course.endTime - course.startTime;

    if (dayIndex === -1 || startRow === -1) return null;

    return (
      <div
        key={`${course.name}-${course.day}-${course.startTime}`}
        style={{
          gridColumn: dayIndex + 2,
          gridRow: `${startRow} / span ${span}`,
          backgroundColor: course.color,
          color: 'black',
          padding: '4px',
          borderRadius: '4px',
          zIndex: 10,
          overflow: 'hidden',
          fontSize: 12,
        }}
      >
        <div className="course-name">{course.name}</div>
        <div className="course-location">{course.location}</div>
      </div>
    );
  })}
</div>

          <div className="course-list">
            <h2>Course Details</h2>
            <p><strong>User ID:</strong> {userId.current}</p>
            {courses.map((course,index) => (
              <div key={course.name} className="course-card" style={{ borderLeft: `4px solid ${course.color}` }}>
                <h3>{course.name}</h3>
                {/* <p><strong>Professor:</strong> {course.professor}</p> */}
                <p><strong>Professor: </strong>
                {course.professorOptions && course.professorOptions.length > 0 ? (
                  <select
                    value={course.professor}
                    onChange={(e) =>
                      handleProfessorChange(index, e.target.value)
                    }
                  >
                    {course.professorOptions.map((prof, idx) => (
                      <option key={idx} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{course.professor}</span>
                )}</p>
                <p><strong>Time:</strong> {course.day} {course.startTime % 12 || 12}:00 {course.startTime >= 12 ? 'PM' : 'AM'}</p>
                <p><strong>Location:</strong> {course.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
              <form
          className="add-course-form"
          onSubmit={handleAddCourse}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '280px',
            flexShrink: 0,
            fontSize: '14px'
          }}
        >
          <h2 style={{ marginBottom: '12px', fontSize: '18px' }}>Add a Course</h2>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Course ID
            <input
              type="text"
              name="courseId"
              placeholder="e.g. CS161"
              value={formData.courseId}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '6px 8px',
                marginTop: '4px',
                marginBottom: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Day
            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '6px 8px',
                marginTop: '4px',
                marginBottom: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            >
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Start Time (24hr)
            <input
              type="number"
              name="startTime"
              min="0"
              max="23"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '6px 8px',
                marginTop: '4px',
                marginBottom: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            End Time (24hr)
            <input
              type="number"
              name="endTime"
              min="1"
              max="24"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '6px 8px',
                marginTop: '4px',
                marginBottom: '12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Add Course
          </button>
        </form>
    </div>
  );
};

export default CourseSched;
