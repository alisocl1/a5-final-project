import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Event 1', date: '2024-11-14', time: '10:00 AM', description: 'Description for Event 1' },
    { id: 2, title: 'Event 2', date: '2024-11-15', time: '', description: '' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const addEvent = (newEvent) => {
    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setIsModalOpen(false);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
      time: clickInfo.event.extendedProps.time || '',
      description: clickInfo.event.extendedProps.description || '',
    });
  };

  const removeEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setSelectedEvent(null);
  };

  return (
    <div class="calendar">
      <button onClick={() => setIsModalOpen(true)} className="add-button">
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
    <div className="overlay">
      <div className="modal">
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
          <div className="modal-buttons">
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
    <div className="overlay">
      <div className="modal">
        <h3>Event Details</h3>
        <p><strong>Title:</strong> {event.title}</p>
        <p><strong>Date:</strong> {event.date}</p>
        {event.time && <p><strong>Time:</strong> {event.time}</p>}
        {event.description && <p><strong>Description:</strong> {event.description}</p>}
        <div className="modal-buttons">
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