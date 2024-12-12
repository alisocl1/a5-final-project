import React, { useState, useEffect } from 'react';
import WeatherWidget from '../weather-widget/weather-widget.jsx';
import Calendar from '../calendar/calendar.jsx';
import TaskList from '../task-list/task-list.jsx';
import Overlay from '../overlay-menu/overlay-menu.jsx';
import MenuButton from '../menu-button/menu-button.jsx';
import './user-room.css'

const UserRoom = ({ userName, userLocation, onButtonClick, onNavigate, isMenuVisible }) => {
    const [resetMenu, setResetMenu] = useState(false);

    const handleNavigation = (page) => {
        if (page === "name" || page === "location") {
            setResetMenu(true);
        }
        onNavigate(page);
    };

    useEffect(() => {
        if (resetMenu) {
            setResetMenu(false);
        }
    }, [resetMenu]);
    
    return (
        <div className="room-container">
            <div className="head-container">
                <h1 className="header">hello, {userName}</h1>
                <MenuButton onButtonClick={onButtonClick} resetMenu={resetMenu} />
                <Overlay onNavigate={handleNavigation} isMenuVisible={isMenuVisible} />
            </div>
            <div className="top-row-container">
                <div className="widget-container">
                    <WeatherWidget location={userLocation}/>
                    <TaskList />
                </div>
            </div>
            <div className="calendar">
                <Calendar />
            </div>
        </div>
    )
}

export default UserRoom;
