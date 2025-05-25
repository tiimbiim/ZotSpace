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
    // console.log(email, email.includes("uci.edu"), ve)

    if (ve) {
      setValidEmail(true)
    }
    else {
      setValidEmail(false)
    }



    try {
      // alert(ve)
      if (ve) {
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);

          // Create user in Django backend
          try {
            const response = await axios.post('http://localhost:8000/api/users/create/', {
              email: email,
              password: password
            });
            console.log('Backend user created:', response.data);
          } catch (error) {
            console.error('Backend API error:', error.response?.data || error.message);
            // Optionally handle the error (e.g., show it to the user)
            setError('Failed to create user in backend: ' + (error.response?.data?.error || error.message));
            return;
          }
        }
        navigate('/'); // Navigate to home page after successful login/signup
      }
      else{
        setError('Email domain is invalid')
      }
      } catch (error) {
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