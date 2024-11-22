import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './user-location.css'


const UserLocation = ({ 
    userName, 
    userLocation, 
    setUserLocation, 
    selectedCountry,
    setSelectedCountry,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    onNext 
}) => {

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const handleNext = () => {
        const cityInfo = cities.find(city => city.geonameId === parseInt(selectedCity));

        if (cityInfo) {
            const userLocation = `${cityInfo.name}, ${cityInfo.countryCode}`;
            console.log(userLocation)
            setUserLocation(userLocation);
        } else {
            console.log('nothing found');
        }
        onNext();
    }
    
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
                setCountries(response.data.geonames);
            } catch (err) {
                console.error('Failed to fetch countries.')
            }
            setLoading(false);
        };
        fetchCountries();
    }, []);

    // Fetch state/provinces
    useEffect(() => {
        const fetchStates = async() => {
            if (!selectedCountry) return;
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://api.geonames.org/childrenJSON?geonameId=${selectedCountry}&username=${geoNamesUsername}`
                );
                setStates(response.data.geonames || []);
            } catch (err) {
                console.error('Failed to fetch states.', err);
            }
            setLoading(false);
        };
        fetchStates();
    }, [selectedCountry]);

    // Fetch cities
    useEffect(() => {
        const fetchCities = async() => {
            if (!selectedState) return;
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://api.geonames.org/childrenJSON?geonameId=${selectedState}&username=${geoNamesUsername}`
                );
                setCities(response.data.geonames || []);
            } catch (err) {
                console.error('Failed to fetch cities.', err);
            }
            setLoading(false);
        };
        fetchCities();
    }, [selectedState]);


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
                        disabled={!selectedState}
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
