import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Widgets.css';

const CalendarWidget = () => {
  const today = new Date();

  return (
    <div className="calendar-widget">
      <h2>Calendar</h2>
      <div className="calendar-container">
        <Calendar
          value={today}
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