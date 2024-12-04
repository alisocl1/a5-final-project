import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css';

const Calendar = () => {
  const events = [
    { title: 'Event 1', date: '2024-12-14' },
    { title: 'Event 2', date: '2024-12-15' },
  ];

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin]} // Add plugins here
        initialView="dayGridMonth" // Default view
        events={events} // Pass events to the calendar
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
      />
    </div>
  );
};

export default Calendar;