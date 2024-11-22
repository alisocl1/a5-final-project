import WeatherWidget from '../weather-widget/weather-widget.jsx';
import './user-room.css'

const UserRoom = ({ userName, userLocation }) => {
    return (
        <div className="room-container">
            <h1 className="header">hello, {userName}</h1>
            <WeatherWidget location={userLocation}/>
        </div>
    )
}

export default UserRoom;
