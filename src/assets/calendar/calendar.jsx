import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin for month/week/day views
import './calendar.css';

const Calendar = () => {
  
  // Initializing events state from localStorage (if available)
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Save events to localStorage whenever the events change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    console.log('Updated events:', events);
  }, [events]);

  // Add a new event
  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      { id: Date.now().toString(), ...newEvent },
    ]);
    setIsModalOpen(false); // Close the modal after adding
  };

  // Handle event click to show event details
  const handleEventClick = (clickInfo) => {
    console.log('clickInfo????', clickInfo)
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      time: clickInfo.event.extendedProps.time || '',
      description: clickInfo.event.extendedProps.description || '',
    });
  };

  // Remove event
  const removeEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setSelectedEvent(null);
  };

  const clearAllEvents = () => {
    setEvents([]);
    localStorage.removeItem('events');
    setSelectedEvent(null); 
  };

  return (
    <div className='calendar-container'>
      <button onClick={clearAllEvents} className="clear-button">
        Clear [DEBUG]
      </button>
      <button onClick={() => setIsModalOpen(true)} className="add-button">
        + Add Event
      </button>

      <FullCalendar
        height='70vw'
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
      />

      {isModalOpen && (
        <AddEventModal onClose={() => setIsModalOpen(false)} onAddEvent={addEvent} />
      )}

      {selectedEvent && (
        <EventOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={() => removeEvent(selectedEvent.id)} // Delete event when clicked
        />
      )}
    </div>
  );
};

// Modal for adding a new event
const AddEventModal = ({ onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [isAllDay, setisAllDay] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || (!isAllDay && (!time || !endTime))) {
      alert('Please fill out required fields.');
      return;
    }

    if (!isAllDay && new Date(`${date}T${time}`) >= new Date(`${endDate}T${endTime}`)) {
      alert('End date and time must be after start date and time.');
      return;
    }

    const start = isAllDay ? date : `${date}T${time}`;
    const end = isAllDay ? null : `${endDate}T${endTime}`;

    // Add event
    onAddEvent({
      title,
      start,
      end,
      description,
      allDay: isAllDay,
    });


    // Reset fields and close modal
    setTitle('');
    setDate('');
    setTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setisAllDay(false);
    onClose();
  };

  return (
    <div className="calendar-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <button onClick={onClose} className="close-icon">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input className='input-title'
            type="text"
            placeholder="Add Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            <input className='input-date'
              type="date"
              placeholder="Start Date (required)"
              value={date}
              onChange={(e) => {
                const newStartDate = e.target.value;
                setDate(newStartDate);
                if (!endDate || newStartDate > endDate) {
                  setEndDate(newStartDate);
                }
              }}
              required
            />
            {!isAllDay && (
              <input className='input-date'
                type="time"
                placeholder="Start Time (required)"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            )}
          </div>
          {!isAllDay && (
            <div>
              <div>to</div>
              <input className='input-date'
                type="date"
                placeholder="End Date (required)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <input className='input-date'
                type="time"
                placeholder="End Time (required)"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          )}
          <label class="check-container">
            <input type="checkbox" checked={isAllDay} onChange={() => setisAllDay(!isAllDay)} />
            <span class="checkmark"></span>
            <span class="all-day">All-Day Event</span>
          </label>
          <textarea className='input-description'
            placeholder="Event Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" className="add-button">
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function formatEventTime(startTime, endTime) {
  if (!endTime) {
    const parsedStartTime = parseISO(startTime);
    const startDateFormatted = format(parsedStartTime, "EEEE, MMMM d");
    return `${startDateFormatted} ⋅ All Day`;
  }

  const parsedStartTime = parseISO(startTime);
  const parsedEndTime = parseISO(endTime);

  // Format the start date and time
  const startDateFormatted = format(parsedStartTime, "MMMM d");
  const startTimeFormatted = format(parsedStartTime, "p");

  // Format the end date and time
  const endDateFormatted = format(parsedEndTime, "MMMM d");
  const endTimeFormatted = format(parsedEndTime, "p");

  // Check if the start and end dates are the same
  if (startDateFormatted === endDateFormatted) {
    // If the dates are the same, return a simple format
    return `${startDateFormatted} ⋅ ${startTimeFormatted} – ${endTimeFormatted}`;
  } else {
    // If the dates are different, format as: "December 8 ⋅ 10:11 PM – December 12 ⋅ 10:12 PM"
    return `${startDateFormatted} ⋅ ${startTimeFormatted} – ${endDateFormatted} ⋅ ${endTimeFormatted}`;
  }
}

// Modal for event details
const EventOverlay = ({ event, onClose, onDelete }) => {
  const formatedEventDateTime = formatEventTime(event.start, event.end)

  return (
    <div className="calendar-overlay">
      <div className="event-modal">
        <div className="modal-header">
          <button onClick={onClose} className="close-icon">
            &times;
          </button>
        </div>
        <h3>{event.title}</h3>
        <p>{formatedEventDateTime}</p>
        {event.description && <p><strong>Description:</strong> {event.description}</p>}
        <div className="modal-actions">
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default Calendar;