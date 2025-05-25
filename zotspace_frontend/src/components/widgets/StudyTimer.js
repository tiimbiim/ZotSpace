import React, { useState, useEffect } from 'react';
import './Widgets.css';

const StudyTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
        if (!isBreak) {
          setTotalStudyTime(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isBreak]);

  const handleTimerComplete = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play();
    
    if (!isBreak) {
      setCycles(prev => prev + 1);
      setIsBreak(true);
      setTimeLeft(5 * 60); // 5 minute break
    } else {
      setIsBreak(false);
      setTimeLeft(25 * 60); // Back to 25 minute work session
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="study-timer">
      <h2>Pomodoro Timer</h2>
      <div className="timer-container">
        <div className="timer-circle">
          <div className="timer-display">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="mode">{isBreak ? 'Break Time' : 'Study Time'}</div>
          </div>
        </div>
        <div className="timer-controls">
          <button onClick={toggleTimer}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
      <div className="timer-stats">
        <div className="stat">
          <span className="stat-label">Cycles</span>
          <span className="stat-value">{cycles}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Study Time</span>
          <span className="stat-value">{formatTotalTime(totalStudyTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer; 