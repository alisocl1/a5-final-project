import React, { useState } from 'react';
import UserNameInput from './assets/user-name/user-name.jsx';
import UserLocation from './assets/user-location/user-location.jsx';
import Overlay from './assets/overlay-menu/overlay-menu.jsx';
import MenuButton from './assets/menu-button/menu-button.jsx';
import UserRoom from './assets/user-room/user-room.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    const [userName, setUserName] = useState('');

    const [page, setPage] = useState('name');
    const [transition, setTransition] = useState(true);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const [userLocation, setUserLocation] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const handleNextPage = (newPage) => {
        setIsMenuVisible(false);
        setTransition(false);

        setTimeout(() => {
            setPage(newPage);
            setTransition(true);
        }, 1000);
    };

    const navPage = (newPage) => {
        setTransition(false);

        setTimeout(() => {
            setIsMenuVisible(false);
            setTransition(true);
            setPage(newPage);
        }, 1000);
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
                            onNext={() => handleNextPage('location')} />
                    </div>
                );
            case 'location':
                return (
                    <div className={`fade ${fadeClass}`}>
                        <UserLocation 
                            userName={userName}
                            userLocation={userLocation}
                            setUserLocation={setUserLocation}
                            selectedCountry={selectedCountry}
                            setSelectedCountry={setSelectedCountry}
                            selectedState={selectedState}
                            setSelectedState={setSelectedState}
                            selectedCity={selectedCity}
                            setSelectedCity={setSelectedCity}
                            onNext={() => handleNextPage('your room')} 
                        />
                    </div>
                );
            case 'your room':
                return (
                    <div className={`fade ${fadeClass}`}>
                        <MenuButton 
                            onButtonClick={toggleMenu} 
                        /> 
                        <Overlay 
                            onNavigate={navPage}
                            isMenuVisible={isMenuVisible}
                        />
                        <UserRoom
                            userName={userName}
                            userLocation={userLocation}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            {renderPage()}
        </div>
    );
};

export default App;
