// Calendar.jsx
import React from 'react';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin for month/week/day views

const Calendar = () => {
  const events = [
    { title: 'Event 1', date: '2024-11-14' },
    { title: 'Event 2', date: '2024-11-15' },
  ];

  return (
    <div>
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
