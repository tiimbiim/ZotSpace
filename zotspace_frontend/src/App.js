import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.config.js';
import './App.css';
import Login from './pages/Login';
import Schedule from './pages/Schedule';
import StudyGroup from './pages/StudyGroup';
import axios from 'axios';

import Dashboard from './components/Dashboard.js';

// const axios = require('axios').default;

// Protected Route component
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

// function Home() {
//   const navigate = useNavigate();

//   const handleSchedule = () => {
//     navigate('/schedule');
//   };

//   const handleFindStudyGroup = () => {
//     navigate('/study-group');
//   };

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };


//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Welcome to ZotSpace</h1>
//         <p>Your Ultimate Study Space Management Solution</p>
//         <div className="button-container">
//           <button 
//             className="action-button"
//             onClick={handleSchedule}
//           >
//             Schedule
//           </button>
//           <button 
//             className="action-button"
//             onClick={handleFindStudyGroup}
//           >
//             Find Study Group
//           </button>
//           <button 
//             className="action-button logout-button"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>
//       </header>
//     </div>
//   );
// }

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
{/* originally Home */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-group"
          element={
            <ProtectedRoute>
              <StudyGroup />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
