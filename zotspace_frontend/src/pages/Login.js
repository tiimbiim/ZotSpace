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

          const options = {method: 'POST', url: 'http://localhost:8000/api/users/create/'};
          let api_resp = null
          try {
            const { resp } = await axios.post(options, {email: email, password: password});
            api_resp = resp
            console.log(resp);
          } catch (error) {
            console.error('api:', error);
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