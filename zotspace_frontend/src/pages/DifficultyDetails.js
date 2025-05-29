import backgroundImage from '../assets/nav_background.png'
import './DifficultyDetails.css';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import axios from 'axios'
import { auth } from '../firebase.config';


const DifficultyDetails = () => {

  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

    function formatProfessorName(fullName) {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length < 2) return fullName.toUpperCase(); // fallback

    const lastName = parts.pop().toUpperCase(); // last word = last name
    const firstInitial = parts[0][0].toUpperCase(); // first letter of first name

    return `${lastName}, ${firstInitial}.`;
    }

    const getDifficultyColor = (value) => {
        if (value < 40) return '#4CAF50'; // green
        if (value < 70) return '#FFEB3B'; // yellow
        return '#F44336'; // red
    };

  useEffect(() => {
    console.log('DifficultyDetails mounted, starting fetch');
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
        console.log(coursesData)
        const splitCourseId = (courseId) => {
          const match = courseId.match(/^([A-Za-z]+)(\d+[A-Za-z]?)$/);
          if (!match) return { department: courseId, courseNumber: null };
          return { department: match[1], courseNumber: match[2] };
        };

        const enrichedCourses = await Promise.all(
        coursesData.courses.map(async ([courseId, day, startTime, endTime, prof]) => {
            const { department, courseNumber } = splitCourseId(courseId);
            
            // defaults
            let overallData = {
                averageGPA: null,
                percentAboveAvg: null,
            };
            
            let profData = {
                averageGPA: null,
                percentAboveAvg: null,
            };

            const gpaScale = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };
            if (department && courseNumber) {
            // 1. Get overall grade data for the course
                try {
                    const { data: overallDist } = await axios.get(
                    `https://anteaterapi.com/v2/rest/grades/aggregate?department=${department}&courseNumber=${courseNumber}`
                    );
                    const grades = overallDist.data.gradeDistribution || {};
                    const averageGPA = parseFloat(grades.averageGPA || 0).toFixed(2);

                    // Calculate percentAboveAvg (overall)
                    const gradeCounts = {
                    A: grades.gradeACount || 0,
                    B: grades.gradeBCount || 0,
                    C: grades.gradeCCount || 0,
                    D: grades.gradeDCount || 0,
                    F: grades.gradeFCount || 0,
                    };
                    const total = Object.values(gradeCounts).reduce((sum, count) => sum + count, 0);
                    const aboveThresholdCount = Object.entries(gradeCounts)
                    .filter(([grade]) => gpaScale[grade] >= averageGPA)
                    .reduce((sum, [, count]) => sum + count, 0);
                    const percentAboveAvg = total > 0 ? Math.round((aboveThresholdCount / total) * 100) : 0;

                    overallData = {
                        averageGPA,
                        percentAboveAvg,
                    };
                } catch (err) {
                    console.warn(`Failed to fetch overall grade data for ${courseId}`, err);
                }

            // 2. Get grade data for the professor student inputs
            if (prof) {
                try {
                    const encodedProf = formatProfessorName(prof)
                    const { data: profDist } = await axios.get(
                        `https://anteaterapi.com/v2/rest/grades/aggregateByCourse?department=${department}&courseNumber=${courseNumber}&professor=${encodeURIComponent(encodedProf)}`
                    );
                    console.log(`${encodedProf}`, profDist.data[0]['averageGPA'])
                    const profGrades = profDist.data[0] || {};
                    const profAverageGPA = parseFloat(profDist.data[0]['averageGPA'] || 0).toFixed(2);

                    const profGradeCounts = {
                        A: profGrades.gradeACount || 0,
                        B: profGrades.gradeBCount || 0,
                        C: profGrades.gradeCCount || 0,
                        D: profGrades.gradeDCount || 0,
                        F: profGrades.gradeFCount || 0,
                    };
                    const totalProf = Object.values(profGradeCounts).reduce((sum, count) => sum + count, 0);
                    const aboveThresholdCountProf = Object.entries(profGradeCounts)
                        .filter(([grade]) => gpaScale[grade] >= profAverageGPA)
                        .reduce((sum, [, count]) => sum + count, 0);
                    const profPercentAboveAvg = totalProf > 0 ? Math.round((aboveThresholdCountProf / totalProf) * 100) : 0;

                    profData = {
                        averageGPA: profAverageGPA,
                        percentAboveAvg: profPercentAboveAvg,
                    };
                } catch (err) {
                    console.warn(`Failed to fetch grade data for professor ${prof} in ${courseId}`, err);
                }
                }
            }

            return {
            name: courseId,
            day,
            startTime,
            endTime,
            prof,
            overallData,
            profData,
            };
        })
        );

        console.log(courses);
        console.log(enrichedCourses);
        setCourses(enrichedCourses);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user or courses:', error);
        setLoading(false);
      }
    };

    fetchUserIdAndCourses();
  }, []);

    if (loading) return <div>Loading difficulty data...</div>;

    return (
<div
  className="difficulty_details_page"
  style={{ backgroundImage: `url(${backgroundImage})`, maxWidth: '100vw' }}
>
  <div className="difficulty_content">
    <h1 className="difficulty_title">difficulty</h1>
    <div className="difficulty_box">
      {courses.map((course, index) => (
<div key={index} className="diff-item-row">
  <div className="diff-course-name">
    <span className="diff-course-name-small">{course.name}</span>
  </div>

  <div className="diff-progress-bars-row">
    {/* Overall */}
    <div className="diff-pbar-column" title="Overall Course Difficulty">
      <div className="diff-pbar-info">
        Overall GPA: <strong>{course.overallData.averageGPA ?? 'N/A'}</strong> | Above Avg:{' '}
        <strong>{course.overallData.percentAboveAvg ?? 'N/A'}%</strong>
      </div>
      <div className="diff-pbar-circle">
        <CircularProgressbar
          value={100 - (course.overallData.percentAboveAvg ?? 0)}
          text={`${100 - (course.overallData.percentAboveAvg ?? 0)}%`}
          styles={buildStyles({
            pathColor: getDifficultyColor(100 - (course.profData.percentAboveAvg ?? 0)),
            textSize: '20px',
          })}
        />
      </div>
    </div>

    {/* Prof */}
    <div className="diff-pbar-column" title={`Difficulty for professor ${course.prof}`}>
      <div className="diff-pbar-info">
        {course.prof} GPA: <strong>{course.profData.averageGPA ?? 'N/A'}</strong> | Above Avg:{' '}
        <strong>{course.profData.percentAboveAvg ?? 'N/A'}%</strong>
      </div>
      <div className="diff-pbar-circle">
        <CircularProgressbar
          value={100 - (course.profData.percentAboveAvg ?? 0)}
          text={`${100 - (course.profData.percentAboveAvg ?? 0)}%`}
          styles={buildStyles({
            pathColor: getDifficultyColor(100 - (course.profData.percentAboveAvg ?? 0)),
            textSize: '20px',
          })}
        />
      </div>
    </div>
  </div>
</div>
      ))}
      {courses.length === 0 && <p className="no-courses-message">No courses found.</p>}
    </div>
  </div>
</div>

);
};

export default DifficultyDetails;