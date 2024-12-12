import React, { useState, useEffect } from 'react';
import UserNameInput from './assets/user-name/user-name.jsx';
import UserLocation from './assets/user-location/user-location.jsx';
import UserRoom from './assets/user-room/user-room.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {

    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [weatherLocation, setWeatherLocation] = useState(localStorage.getItem('weatherLocation') || '');
    
    const [page, setPage] = useState(userName && weatherLocation ? 'your room' : 'name');
    const [transition, setTransition] = useState(true);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // Save to localStorage when userName or weatherLocation changes
    useEffect(() => {
        if (userName) localStorage.setItem('userName', userName);
        if (weatherLocation) localStorage.setItem('weatherLocation', weatherLocation);
    }, [userName, weatherLocation]);

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleNextPage = (newPage) => {
        setIsMenuVisible(false);
        setTransition(false);

        setTimeout(() => {
            setPage(newPage);
            setTransition(true);
        }, 800);
    };

    const navPage = (newPage) => {
        setTransition(false);

        setTimeout(() => {
            setIsMenuVisible(false);
            setTransition(true);
            setPage(newPage);
        }, 800);
    };

    const renderPage = () => {
        let fadeClass = transition ? 'fade-in' : 'fade-out';

        switch (page) {
            case 'name':
                return (
                    <div className={`fade ${fadeClass}`}>
                        <UserNameInput
                            userName={userName}
                            setUserName={setUserName}
                            onNext={() => handleNextPage('location')}
                        />
                    </div>
                );
            case 'location':
                return (
                    <div className={`fade ${fadeClass}`}>
                        <UserLocation
                            userName={userName}
                            setUserLocation={setWeatherLocation}
                            onNext={() => handleNextPage('your room')}
                        />
                    </div>
                );
            case 'your room':
                return (
                    <div className={`fade ${fadeClass}`}>
                        <UserRoom userName={userName} userLocation={weatherLocation} onButtonClick={toggleMenu} onNavigate={navPage} isMenuVisible={isMenuVisible}/>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            {renderPage()}

            {/* <button onClick={localStorage.clear()}>
                reset
            </button> */}
        </div>
    );
};

export default App;
