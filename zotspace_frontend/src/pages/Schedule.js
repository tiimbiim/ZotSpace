import React from 'react';
import './Schedule.css';

function Schedule() {
  return (
    <div className="schedule-page">
      <header className="schedule-header">
        <h1>Schedule</h1>
        <p>Manage your study space bookings</p>
      </header>
      <main className="schedule-content">
        <div className="calendar-container">
          {/* Calendar component will go here */}
          <p>Calendar coming soon...</p>
        </div>
        <div className="booking-form">
          <h2>Book a Space</h2>
          <form>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input type="date" id="date" name="date" />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time:</label>
              <input type="time" id="time" name="time" />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration (hours):</label>
              <input type="number" id="duration" name="duration" min="1" max="4" />
            </div>
            <button type="submit" className="submit-button">Book Space</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Schedule; 