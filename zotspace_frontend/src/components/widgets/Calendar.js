import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Widgets.css';

const CalendarWidget = () => {
  const today = new Date();

  const events = [
    { date: '2024-03-15', title: 'ICS 139W Midterm' },
    { date: '2024-03-20', title: 'CS 161 Project Due' },
    { date: '2024-03-25', title: 'CS 122A Quiz' }
  ];

  const tileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (events.some(event => event.date === formattedDate)) {
      return 'has-event';
    }
  };

  const tileContent = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const dayEvents = events.filter(event => event.date === formattedDate);
    if (dayEvents.length > 0) {
      return (
        <div className="event-dot"></div>
      );
    }
  };

  return (
    <div className="calendar-widget">
      <h2>Calendar</h2>
      <div className="calendar-container">
        <Calendar
          value={today}
          tileClassName={tileClassName}
          tileContent={tileContent}
          showNavigation={true}
          selectRange={false}
          onClickDay={null}
          onClickDecade={null}
          onClickMonth={null}
          onClickYear={null}
        />
      </div>
    </div>
  );
};

export default CalendarWidget; 