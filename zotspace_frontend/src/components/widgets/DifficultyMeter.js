import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebase.config';
import './Widgets.css';

const DifficultyMeter = () => {
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserIdAndCourses = async () => {
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

        const splitCourseId = (courseId) => {
          const match = courseId.match(/^([A-Za-z]+)(\d+[A-Za-z]?)$/);
          if (!match) return { department: courseId, courseNumber: null };
          return { department: match[1], courseNumber: match[2] };
        };

        const enrichedCourses = await Promise.all(
          coursesData.courses.map(async ([courseId, day, startTime, endTime, prof]) => {
            const { department, courseNumber } = splitCourseId(courseId);
            let difficulty = 50;
            let averageGPA = null;
            let percentAboveAvg = null;

            if (department && courseNumber) {
              try {
                const { data: dist } = await axios.get(
                  `https://anteaterapi.com/v2/rest/grades/aggregate?department=${department}&courseNumber=${courseNumber}`
                );
                const grades = dist.data.gradeDistribution || {};
                averageGPA = parseFloat(grades.averageGPA || 0).toFixed(2);

                const gradeCounts = {
                  A: grades.gradeACount || 0,
                  B: grades.gradeBCount || 0,
                  C: grades.gradeCCount || 0,
                  D: grades.gradeDCount || 0,
                  F: grades.gradeFCount || 0,
                };

                const gpaScale = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };
                const total = Object.values(gradeCounts).reduce((sum, count) => sum + count, 0);

                const aboveThresholdCount = Object.entries(gradeCounts)
                  .filter(([grade]) => gpaScale[grade] >= averageGPA)
                  .reduce((sum, [, count]) => sum + count, 0);

                percentAboveAvg = total > 0 ? Math.round((aboveThresholdCount / total) * 100) : 0;
                difficulty = 100 - percentAboveAvg;
              } catch (err) {
                console.warn(`Failed to fetch grade data for ${courseId}`, err);
              }
            }

            return {
              name: courseId,
              day,
              startTime,
              endTime,
              prof,
              difficulty,
              averageGPA,
              percentAboveAvg,
            };
          })
        );

        setCourses(enrichedCourses);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user or courses:', error);
        setLoading(false);
      }
    };

    fetchUserIdAndCourses();
  }, []);

  if (loading) return <div>Loading difficulty meter...</div>;
  if (!userId) return <div>Please log in to see your courses.</div>;
  if (courses.length === 0) return <div>No courses found.</div>;

  return (
    <div className="difficulty-meter-widget">
      <h2>Course Difficulty</h2>
      <div className="difficulty-list">
        {courses.map((course, index) => (
          <div key={index} className="difficulty-item">
            <div className="course-name-line">
              <span className="course-name-small">{course.name}</span>
              <span className="course-gpa-text">
                GPA: <strong>{course.averageGPA ?? 'N/A'}</strong> | Above Avg: <strong>{course.percentAboveAvg ?? 'N/A'}%</strong>
              </span>
            </div>
            <div className="progress-bar condensed" title={`${course.percentAboveAvg ?? 0}% of students scored ≥ avg GPA`}>
              <div 
                className="progress-fill"
                style={{ width: `${100 - course.difficulty}%`, backgroundColor: '#4CAF50' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DifficultyMeter;
