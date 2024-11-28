import WeatherWidget from '../weather-widget/weather-widget.jsx';
import Calendar from '../calendar/calendar.jsx';
import './user-room.css'

const UserRoom = ({ userName, userLocation }) => {
    return (
        <div className="room-container">
            <h1 className="header">hello, {userName}</h1>
            <div>
                <WeatherWidget location={userLocation} />
            </div>

            <div>
                <Calendar />
            </div>
        </div>
    )
}

export default UserRoom;
