import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './user-location.css'


const UserLocation = ({ 
    userName, 
    setUserLocation, 
    onNext 
}) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [loading, setLoading] = useState(false);
    const geoNamesUsername = 'jacqun11';

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true)
            try {
                const response = await axios.get(
                    `http://api.geonames.org/countryInfoJSON?username=${geoNamesUsername}`
                );
                console.log(response.data);
                const countryData = response.data.geonames;
                setCountries(countryData);
            } catch (err) {
                console.error('Failed to fetch countries.')
            }
            setLoading(false);
        };
        fetchCountries();
    }, []);

    // Load data from local storage
    useEffect(() => {
        const savedLocation = JSON.parse(localStorage.getItem('userLocation'));

        if (savedLocation) {
            const { country, state, city } = savedLocation;

            setSelectedCountry(country || '');
            setSelectedState(state || '');
            setSelectedCity(city || '');

            if (country) {
                fetchStates(country).then(() => {
                    if (state) {
                        fetchCities(state);
                    }
                });
            }
        }
    }, []);

    // Fetch states when country is selected
    useEffect(() => {
        if (selectedCountry) {
            fetchStates(selectedCountry);
        }
    }, [selectedCountry]);

    // Fetch cities when state is selected
    useEffect(() => {
        if (selectedState) {
            fetchCities(selectedState);
        }
    }, [selectedState]);


    const fetchStates = async (countryId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://api.geonames.org/childrenJSON?geonameId=${countryId}&username=${geoNamesUsername}`
            );
            const statesData = response.data.geonames;
            setStates(statesData);
        } catch (err) {
            console.error('Failed to fetch states.', err);
        }
        setLoading(false);
    };

    const fetchCities = async (stateId) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://api.geonames.org/childrenJSON?geonameId=${stateId}&username=${geoNamesUsername}`
            );
            const citiesData = response.data.geonames;
            setCities(citiesData);
        } catch (err) {
            console.error('Failed to fetch cities.', err);
        }
        setLoading(false);
    };

    const handleNext = () => {
        const cityInfo = cities.find(city => city.geonameId === parseInt(selectedCity));

        if (cityInfo) {
            const userLocation = {
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
            };

            // Save location to local storage
            localStorage.setItem('userLocation', JSON.stringify(userLocation));
            console.log(userLocation);
            
            // Pass formatted info for weather widget back to App
            setUserLocation(`${cityInfo.name}, ${cityInfo.countryCode}`);
        } else {
            console.log('nothing found');
        }
        onNext();
    };


    return (
        <div className="user-location-container">
            <h1>nice to meet you, {userName}! <br />where are you from?</h1>
            
            {/* country dropdown */}
            <div className="dropdown-group">
                <div className="form-group">
                    <label htmlFor="country">country</label>
                    <select 
                        className="custom-dropdown"
                        id="country"
                        value={selectedCountry}
                        onChange={(e) => {
                            const countryId = e.target.value;
                            setSelectedCountry(countryId);
                            setSelectedState('');
                            setSelectedCity('');
                            setStates([]);
                            setCities([]);
                        }}
                    >
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                            <option key={country.geonameId} value={country.geonameId}>
                                {country.countryName}
                            </option>
                        ))}
                    </select>          
                </div>

                {/* state dropdown */}
                <div className="form-group">
                    <label htmlFor="state">state/province</label>
                    <select 
                        id="state"
                        className="custom-dropdown"
                        value={selectedState}
                        onChange={(e) => {
                            const stateId = e.target.value;
                            setSelectedState(stateId);
                            setSelectedCity('');
                            setCities([]);
                        }}
                        disabled={!selectedCountry}
                    >
                        <option value="">Select a state/province</option>
                        {states.length > 0 ? (
                            states.map((state) => (
                                <option key={state.geonameId} value={state.geonameId}>
                                    {state.name}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                No state/province available
                            </option>
                        )}
                    </select>
                </div>

                {/* city dropdown */}
                <div className="form-group">
                    <label htmlFor="city">city</label>
                    <select 
                        id="city"
                        className="custom-dropdown"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={!selectedCountry || !selectedState}
                    >
                        <option value="">Select a city</option>
                        {cities.length > 0 ? (
                            cities.map((city) => (
                                <option key={city.geonameId} value={city.geonameId}>
                                    {city.name}
                                </option>                              
                            ))
                        ) : (
                            <option value="" disabled>
                                No city available
                            </option>                     
                        )}
                    </select>
                </div>
                <button className={`next-button ${selectedCountry && selectedState && selectedCity ? 'active' : ''}`}
                    onClick={handleNext}
                    disabled={!selectedCountry || !selectedState || !selectedCity}
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default UserLocation;
