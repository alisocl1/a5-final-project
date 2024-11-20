import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './user-location.css'


const UserLocation = ({ userName, onBack , onNext }) => {
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
            <button className="back-button" onClick={onBack}>←</button>
            <button className="to-main-button" onClick={onNext}>→</button>

            <h1>nice to meet you, {userName}! <br />where are you from?</h1>
            
            {/* country dropdown */}
            <div className="form-group">
                <label htmlFor="country">country</label>
                <select 
                    id="country"
                    onChange={(e) => {
                        const countryId = e.target.value;
                        setSelectedCountry(countryId);
                        setSelectedState('');
                        setSelectedCity('');
                        setStates([]);
                        setCities([]);
                    }}
                    value={selectedCountry}
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
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedState}
                >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                        <option key={city.geonameId} value={city.geonameId}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default UserLocation;
