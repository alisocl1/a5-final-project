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
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
  else{
    // Darken the color by multiplying each component by 0.7
    r = Math.floor(r * 0.7);
    g = Math.floor(g * 0.7);
    b = Math.floor(b * 0.7);
    
    return `rgba(${r}, ${g}, ${b})`;
  }

}



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
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      color: clickInfo.event.backgroundColor,
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
      {/* <button onClick={clearAllEvents} className="clear-button">
        Clear [DEBUG]
      </button> */}
      <button onClick={() => setIsModalOpen(true)} className="add-event-button" title='Add an event'>
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
          if (info.event.allDay || isMultipleDays) {
            info.el.classList.add("all-day-event");

          }
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
  const [color, setColor] = useState('#4770ac');
  

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
      color: color,
    });


    // Reset fields and close modal
    setTitle('');
    setDate('');
    setTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setisAllDay(false);
    setColor('#4770ac')
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
            title='Enter event title.'
            type="text"
            placeholder="Add Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
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
          
          <ColorDropdown onColorSelect={setColor} />
          
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
        <h3 style={{ color: event.color }}>{event.title}</h3>
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