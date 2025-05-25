import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config.js';
import './Login.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let ve = email.includes("@uci.edu")

    if (ve) {
      setValidEmail(true)
    }
    else {
      setValidEmail(false)
    }

    try {
      if (ve) {
        if (isLogin) {
          // Sign in
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('Firebase sign in successful:', userCredential.user);
          navigate('/');
        } else {
          // Sign up
          try {
            // Extract username (netID) from email
            const username = email.split('@')[0];
            
            // First create user in Django backend
            const response = await axios.post('http://localhost:8000/api/users/create/', {
              email: email,
              password: password,
              username: username
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 5000
            });
            console.log('Backend user created:', response.data);

            // Then create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Firebase user created:', userCredential.user);

            // Sign in the user after successful creation
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
          } catch (error) {
            console.error('Error during signup:', error);
            // If Firebase user was created but Django failed, we should clean up
            if (error.response?.status === 400 && auth.currentUser) {
              try {
                await auth.currentUser.delete();
                console.log('Cleaned up Firebase user after failed backend creation');
              } catch (cleanupError) {
                console.error('Error cleaning up Firebase user:', cleanupError);
              }
            }
            
            if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
              setError('Network error: Could not connect to the server. Please try again.');
            } else if (error.response) {
              setError(error.response.data.error || 'Server error occurred');
            } else if (error.request) {
              setError('No response from server. Please check your connection.');
            } else {
              setError(error.message);
            }
            return;
          }
        }
      }
      else {
        setError('Email domain is invalid')
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login; 