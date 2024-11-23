import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Calendar = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Event 1', date: '2024-11-14', time: '10:00 AM', description: 'Description for Event 1' },
    { id: 2, title: 'Event 2', date: '2024-11-15', time: '', description: '' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // Selected event for viewing details

  // Add a new event
  const addEvent = (newEvent) => {
    setEvents([...events, { id: Date.now(), ...newEvent }]);
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
    setEvents(events.filter((event) => event.id !== eventId));
    setSelectedEvent(null); // Close the modal
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} style={addButtonStyles}>
        Add Event
      </button>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        eventClick={handleEventClick}
      />

      {isModalOpen && (
        <AddEventModal onClose={() => setIsModalOpen(false)} onAddEvent={addEvent} />
      )}

      {selectedEvent && (
        <EventOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={() => removeEvent(selectedEvent.id)}
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
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && date) {
      onAddEvent({ title, date, time, description });
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
    } else {
      alert('Title and Date are required.');
    }
  };

  return (
    <div style={overlayStyles}>
      <div style={modalStyles}>
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
            type="date"
            placeholder="Event Date (required)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            placeholder="Event Time (optional)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <textarea
            placeholder="Event Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div style={{ marginTop: '20px' }}>
            <button type="submit" style={addButtonStyles}>
              Add Event
            </button>
            <button onClick={onClose} style={closeButtonStyles}>
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
    <div style={overlayStyles}>
      <div style={modalStyles}>
        <h3>Event Details</h3>
        <p><strong>Title:</strong> {event.title}</p>
        <p><strong>Date:</strong> {event.date}</p>
        {event.time && <p><strong>Time:</strong> {event.time}</p>}
        {event.description && <p><strong>Description:</strong> {event.description}</p>}
        <div style={{ marginTop: '20px' }}>
          <button onClick={onDelete} style={deleteButtonStyles}>
            Delete
          </button>
          <button onClick={onClose} style={closeButtonStyles}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for buttons and modals
const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyles = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  textAlign: 'center',
};

const addButtonStyles = {
  background: 'green',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginBottom: '10px',
};

const closeButtonStyles = {
  background: 'gray',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
};

const deleteButtonStyles = {
  background: 'red',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  marginRight: '10px',
  cursor: 'pointer',
};

export default Calendar;
