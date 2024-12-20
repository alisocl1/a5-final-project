import './calendar.css';
import ColorDropdown from './color-dropdown.jsx'
import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import FullCalendar from '@fullcalendar/react'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin for month/week/day views
import interactionPlugin from '@fullcalendar/interaction';

// Helper function for converting hex to rgba
function hexToRGBA(hex, toggle) {
  let r = 0, g = 0, b = 0;

  // Parse 3-digit or 6-digit hex colors
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  if (toggle) {
    // Return "lightened" color
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
  else{
    // Return darkened color
    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);
    
    return `rgba(${r}, ${g}, ${b})`;
  }

}

// Calendar element
const Calendar = () => {
  const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8C33FF',
    '#33FFF6', '#F6FF33', '#8BFF33', '#FF3333'
  ];
  
  // Initializing events state from localStorage (if available)
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventOverlayOpen, setIsEventOverlayOpen] = useState(false);

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

  // Handle the "Edit" button click
  const handleEditEvent = () => {
    setIsModalOpen(true);
    setIsEventOverlayOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }

  // Handle updating event
  const updateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
      )
    );
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle event click to show event details
  const handleEventClick = (clickInfo) => {

    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      color: clickInfo.event.backgroundColor,
      isAllDay: clickInfo.event.allDay,
      description: clickInfo.event.extendedProps.description || '',
    });
    setIsEventOverlayOpen(true);
  };

  // Remove event
  const removeEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setSelectedEvent(null);
  };

  // For debugging
  const clearAllEvents = () => {
    setEvents([]);
    localStorage.removeItem('events');
    setSelectedEvent(null); 
  };

  return (
    <div className='calendar-container'>

      {/* DEBUG
      <button onClick={clearAllEvents} className="clear-button">
        Clear [DEBUG]
      </button> */}

      <button onClick={() => setIsModalOpen(true)} className="add-button" title='Add an event'>
        + Add Event
      </button>

      <FullCalendar
        height='70vw'
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dayMaxEvents={true}
        events={events}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          const event = info.event;
          const startDate = event.startStr;
          const endDate = event.endStr;
          const isMultipleDays = endDate != '' && !(startDate.slice(0, 10)==endDate.slice(0, 10));
          // specific formatting for All Day events
          if (info.event.allDay || isMultipleDays) {
            info.el.classList.add("all-day-event");
          }
          // cool bordering for normal events
          else{
            info.el.style.borderColor = info.event.backgroundColor;
            info.el.style.backgroundColor = `${hexToRGBA(info.event.backgroundColor, 1)}`;
            info.el.style.color = `${hexToRGBA(info.event.backgroundColor, 0)}`;
          }
        }}
        
        headerToolbar={{
          left: 'prev,next today',
          right: 'title',
        }}
      />
      
      {isModalOpen && (
        <AddEventModal onClose={handleClose} onAddEvent={addEvent} event={selectedEvent} onUpdateEvent={updateEvent}/>
      )}

      {isEventOverlayOpen && selectedEvent && (
        <EventOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={() => removeEvent(selectedEvent.id)}
          onEdit={handleEditEvent}
        />
      )}
    </div>
  );
};

// Modal for adding a new event
const AddEventModal = ({ onClose, onAddEvent, event, onUpdateEvent }) => {
  console.log(event);
  const [title, setTitle] = useState(event ? event.title : '');
  const [date, setDate] = useState(event ? event.start.slice(0, 10) : '');
  const [time, setTime] = useState(event ? event.start.slice(11, 16) : '');
  const [endDate, setEndDate] = useState(event ? event.end?.slice(0, 10) : '');
  const [endTime, setEndTime] = useState(event ? event.end?.slice(11, 16) : '');
  const [description, setDescription] = useState(event ? event.description : '');
  const [isAllDay, setIsAllDay] = useState(event ? event.isAllDay : false);
  const [color, setColor] = useState(event ? event.color : '#4770ac');
  
  // Handles creating/editing event when save button is pressed
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
    
    // Determine start and end times based on all-day
    const start = isAllDay ? date : `${date}T${time}`;
    const end = isAllDay ? null : `${endDate}T${endTime}`;

    const eventData = {
      title,
      start,
      end,
      description,
      allDay: isAllDay,
      color,
    };

    // Update existing event
    if (event) {
      onUpdateEvent({ id: event.id, ...eventData });
    }
    else {
      // Add new event
      onAddEvent(eventData);
    }

    // Reset fields and close modal
    setTitle('');
    setDate('');
    setTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setIsAllDay(false);
    setColor('#4770ac')
    onClose();
  };
  console.log(isAllDay);

  return (
    <div className="calendar-overlay">
      {/* form for creating/editing event */}
      <div className="event-modal">
        <div className="modal-header">
          <button onClick={onClose} className="close-icon">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input className='input-title'
            title='Enter event title.'
            type="text"
            placeholder="Add Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            {/* Start date required for ALL events */}
            <input className='input-date'
              title='Select start date.'
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
            {/* Remaining date/time inputs only required if isAllDay */}
            {!isAllDay && (
              <input className='input-date'
                title='Select start time.'
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
                title='Select end date.'
                type="date"
                placeholder="End Date (required)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              <input className='input-date'
                title='Select end time.'
                type="time"
                placeholder="End Time (required)"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          )}

          {/* Checkbox for All-Day Event */}
          <label className="check-container">
            <input type="checkbox" checked={isAllDay} onChange={() => setIsAllDay(!isAllDay)} />
            <span className="checkmark"></span>
            <span className="all-day">All-Day Event</span>
          </label>

          {/* Optional Description */}
          <textarea className='input-description'
            placeholder="Event Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          {/* ColorDropdown propogates color for editing existing events */}
          <ColorDropdown onColorSelect={setColor} currentColor={color} />
          
          <div className="modal-actions">
            <button type="submit" className="add-button">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Format the event date/time in a nice, consise way
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
    return `${startDateFormatted} ⋅ ${startTimeFormatted} – ${endTimeFormatted}`;
  } else {
    return `${startDateFormatted} ⋅ ${startTimeFormatted} – ${endDateFormatted} ⋅ ${endTimeFormatted}`;
  }
}

// Modal for event details
const EventOverlay = ({ event, onClose, onDelete, onEdit}) => {
  const formatedEventDateTime = formatEventTime(event.start, event.end)

  return (
    <div className="calendar-overlay">
      {/* Display event details */}
      <div className="event-modal">
        <div className="modal-header">
          <button onClick={onClose} className="close-icon">
            &times;
          </button>
        </div>
        <h3 style={{ color: event.color }}>{event.title}</h3>
        <p>{formatedEventDateTime}</p>
        {event.description && <p><strong>Description:</strong> {event.description}</p>}
        <div className="modal-actions">
          <button onClick={onEdit} className="edit-button">
            Edit
          </button>
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};


export default Calendar;