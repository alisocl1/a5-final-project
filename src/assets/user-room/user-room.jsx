import WeatherWidget from '../weather-widget/weather-widget.jsx';
import Calendar from '../calendar/calendar.jsx';
import Overlay from '../overlay-menu/overlay-menu.jsx';
import MenuButton from '../menu-button/menu-button.jsx';
import './user-room.css'

const UserRoom = ({ userName, userLocation, onButtonClick, onNavigate, isMenuVisible }) => {
    return (
        <div className="room-container">
            <div className="head">
                <h1 className="header">hello, {userName}</h1>
                <MenuButton onButtonClick={onButtonClick} />
            </div>
            <Overlay onNavigate={onNavigate} isMenuVisible={isMenuVisible} />
            {/*  <WeatherWidget location={userLocation}/> */}
            <div>
                <Calendar />
            </div>
        </div>
    )
}

export default UserRoom;
