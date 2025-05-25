import React, { useState, useEffect } from 'react';
import CourseSchedule from './CourseSchedule';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios'

const ScheduleContainer = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const auth = getAuth();
    
    const fetchCourses = async (email) => {
      const uid = await getUserId(email);
      setUserId(uid)
      console.log(uid)
      const courseData = await getCoursesForUser(uid);
      // console.log(courseData)
      setCourses(courseData);
      setLoading(false);
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCourses(user.email);
      } else {
        setLoading(false);
        console.log('User not logged in');
      }
    });
  }, []);
  
  const getUserId = async (email) => {
    const response = await fetch(`http://localhost:8000/api/users/get-id/?email=${email}`);
    const data = await response.text();
    const json = JSON.parse(data);
    console.log(json.user_id);
    return json.user_id;
  };
  
  const getCoursesForUser = async (uid) => {
    const response = await fetch(`http://localhost:8000/api/users/${uid}/courses/`);
    const data = await response.text();
    const json = JSON.parse(data)
    let courses = json['courses']

    for (let i = 0; i < courses.length; i++) {
      console.log(i,courses[i])
    }

    return courses; // Assuming this returns an array of courses
  };
  
  console.log('sc', courses)


  if (loading) return <div>Loading schedule...</div>;
  return <CourseSchedule courses={courses} userId={userId}/>;
};

export default ScheduleContainer;
