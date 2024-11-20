import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import UserNameInput from './assets/user-name/user-name.jsx';
import UserLocation from './assets/user-location/user-location.jsx';
import WeatherWidget from './assets/weather-widget/weather-widget.jsx';
import './App.css';

const App = () => {
    const [userName, setUserName] = useState('');
    const [page, setPage] = useState('username');

    const handleNext = (nextPage) => {
        setPage(nextPage);
    };

    const handleBack = () => {
        setPage('username');
    };

    return (
        <div className="inputs-container">
            <TransitionGroup>
                <CSSTransition
                    key={page}
                    timeout={1500}
                    classNames="fade"
                    unmountOnExit={false}
                >
                    <div className="page-container">
                        {page === 'username' && (
                            <UserNameInput 
                                userName={userName} 
                                setUserName={setUserName} 
                                onNext={() => handleNext('location')} 
                            />
                        )}

                        {page === 'location' && (
                            <div>
                                <UserLocation 
                                    userName={userName}
                                    onBack={() => setPage('username')}
                                    onNext={() => setPage('main')}
                                />
                            </div>
                        )}

                        {page === 'main' && (
                            <WeatherWidget />
                        )}
                    </div>
                </CSSTransition>
            </TransitionGroup>  
        </div>
    );
};

export default App;
