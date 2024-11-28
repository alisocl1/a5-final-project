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
    const [location, setLocation] = useState([]);

    useEffect(() => {
        if (location) {
    
            const prepopulateLocation = async () => {
                try {
                    // Fetch and preselect country
                    const countryResponse = await axios.get(
                        `http://api.geonames.org/countryInfoJSON?username=${geoNamesUsername}`
                    );
                    const countries = countryResponse.data.geonames
                    setCountries(countries);
    
                    const country = countries.find(
                        (c) => c.countryCode === location[2]
                    );
                    setSelectedCountry(country.geonameId);
    
                    // Fetch and preselect state
                    const stateResponse = await axios.get(
                        `http://api.geonames.org/childrenJSON?geonameId=${country.geonameId}&username=${geoNamesUsername}`
                    );
                    const states = stateResponse.data.geonames
                    setStates(states);
    
                    const state = states.find((s) => s.name === location[1]);
                    setSelectedState(state.geoname);
    
                    // Fetch and preselect city
                    const cityResponse = await axios.get(
                        `http://api.geonames.org/childrenJSON?geonameId=${state.geonameId}&username=${geoNamesUsername}`
                    );
                    const cities = cityResponse.data.geonames
                    setCities(cities);
    
                    const city = cities.find((c) => c.geonameId === location[0]);
                    setSelectedCity(city.geonameId);

                } catch (err) {
                    console.error('Failed to prepopulate location data.', err);
                }
            };
    
            prepopulateLocation();
        }
    }, [userLocation]);
    
    

    const handleNext = () => {
        const cityInfo = cities.find(city => city.geonameId === parseInt(selectedCity));

        if (cityInfo) {
            // Data for weather widget
            const userLocation = `${cityInfo.name}, ${cityInfo.countryCode}`;
            console.log(userLocation)
            setUserLocation(userLocation);

            // Data for local storage : [city geo id (int), city admin code (str), city country code (str)]
            const location = [cityInfo.geonameId, cityInfo.adminCode1, cityInfo.countryCode];
            setLocation(location);
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

                const countries = response.data.geonames;
                setCountries(countries);
            } catch (err) {
                console.error('Failed to fetch countries.')
            }
            setLoading(false);
        };
        fetchCountries();
    }, []);

    // Fetch states when selectedCountry is updated (user selection only)
    useEffect(() => {
        if (!selectedCountry) return;

        const fetchStates = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://api.geonames.org/childrenJSON?geonameId=${selectedCountry}&username=${geoNamesUsername}`
                );

                const states = response.data.geonames;
                setStates(states);
            } catch (err) {
                console.error('Failed to fetch states.', err);
            }
            setLoading(false);
        };

        fetchStates();
    }, [selectedCountry]);

    // Fetch cities when selectedState is updated (user selection only)
    useEffect(() => {
        if (!selectedState) return;

        const fetchCities = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://api.geonames.org/childrenJSON?geonameId=${selectedState}&username=${geoNamesUsername}`
                );
                const cities = response.data.geonames
                setCities(cities);
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
                    disabled={!selectedCity}
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default UserLocation;
