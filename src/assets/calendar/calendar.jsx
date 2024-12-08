import React, { useState, useEffect } from 'react';
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
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
      time: clickInfo.event.extendedProps.time || '',
      description: clickInfo.event.extendedProps.description || '',
    });
  };

  // Remove event
  const removeEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId); // Filter out the deleted event
    setEvents(updatedEvents); // Update the events state
    localStorage.setItem('events', JSON.stringify(updatedEvents)); // Update localStorage with the new events array
    setSelectedEvent(null); // Close the modal
  };

  const clearAllEvents = () => {
    setEvents([]); // Clear the events state
    localStorage.removeItem('events'); // Remove events from localStorage
    setSelectedEvent(null); // Clear any selected event
  };

  return (
    <div className='calendar-container'>
      <button onClick={clearAllEvents} className="clear-button">
        Clear [DEBUG]
      </button>
      <button onClick={() => setIsModalOpen(true)} className="add-button">
        Add Event
      </button>

      <FullCalendar
        height='75vw'
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
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert('All fields are required.');
      return;
    }
    if (new Date(start) >= new Date(end)) {
      alert('End time must be after start time.');
      return;
    }
    onAddEvent({ title, start, end, description });
    setTitle('');
    setStart('');
    setEnd('');
    setDescription('');
  };

  return (
    <div className="calendar-overlay">
      <div className="event-modal">
        <h3>Add New Event</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            placeholder="Start Date & Time (required)"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            placeholder="End Date & Time (required)"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
          <textarea
            placeholder="Event Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" className="add-button">
              Add Event
            </button>
            <button onClick={onClose} className="close-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Modal for event details
const EventOverlay = ({ event, onClose, onDelete }) => {
  return (
    <div className="calendar-overlay">
      <div className="event-modal">
        <h3>Event Details</h3>
        <p><strong>Title:</strong> {event.title}</p>
        <p><strong>Date:</strong> {event.date}</p>
        {event.time && <p><strong>Time:</strong> {event.time}</p>}
        {event.description && <p><strong>Description:</strong> {event.description}</p>}
        <div className="modal-actions">
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
          <button onClick={onClose} className="close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;