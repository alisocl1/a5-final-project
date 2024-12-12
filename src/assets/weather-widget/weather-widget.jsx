import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './weather-widget.css';

const WeatherWidget = ({ location }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiKey = '05b0cccbfc7e3cc8975d21ed28edca41';
    // backup apiKey: daeb2ba28d16bf92cf39006539f91bb8
    const convertToFahrenheit = (celcius) => {
        return (celcius * 9/5) + 32;
    };

    const windSpeedConversion = (mps) => (mps * 2.23694).toFixed(1);

    const precipitation = weatherData && weatherData.rain ? weatherData.rain['1h'] : 0;

    const getBackgroundImage = (weatherIcon) => {
        if (weatherIcon.includes('d')) {
            return 'url(https://auroralabsnorway.com/blog/wp-content/uploads/2020/05/sun-3588618_1920-1200x800.jpg)';
        } else {
            return 'url(https://t3.ftcdn.net/jpg/00/92/57/76/360_F_92577670_M5qmsjtBd36X6YD7b2zUwmqqUXOmwVn9.jpg)';
        }
    };

    const getIcon = (weatherIcon) => {
        switch (weatherIcon) {
            case '01d': return 'fa-sun';
            case '01n': return'fa-moon';
            case '02d':
            case '02n': return 'fa-cloud-sun';
            case '03d':
            case '03n': return 'fa-cloud';
            case '04d':
            case '04n': return 'fa-cloud-meatball';
            case '09d':
            case '09n': return'fa-cloud-showers-heavy';
            case '10d':
            case '10n': return 'fa-cloud-rain';
            case '50d':
            case '50n': return 'fa-smog';
            default: return 'fa-question';
        }
    };

    useEffect(() => {
        const fetchWeather = async () => {
            if (!location) return;
            setLoading(true);
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;

            try {
                const response = await axios.get(apiURL);
                setWeatherData(response.data);
                setError('');
            } catch (err) {
                console.log(location);
                setError('Failed to fetch weather data. Please select a different location.')
                setWeatherData(null);
            }
            setLoading(false);
        };
        fetchWeather();
    }, [location])

    if (loading) { return <p className="weather-loading">loading...</p>; }
    if (error) { return <div className="error-box">{error}</div>; }

    return (
        <div className="weather-widget" style={{ backgroundImage: weatherData ? getBackgroundImage(weatherData.weather[0].icon) : ''}}>
            {weatherData && (
                <div className="weather-container">

                    {/* top row of weather widget */}
                    <div className="weather-top-row">
                        <p className="location">
                            <i className="map-marker"></i> {weatherData.name}, {' '}
                            {weatherData.sys.country}
                        </p>
                        <p className="weather-description">
                            {weatherData.weather[0].description}
                        </p>
                    </div>
                
                    {/* middle row of weather widget */}
                    <div className="weather-middle-row">
                        <div className="temperature">
                            {convertToFahrenheit(weatherData.main.temp).toFixed(1)}°F
                        </div>
                        <div className="weather-icon">
                            <i className={`fa ${getIcon(weatherData.weather[0].icon)} weather-icon`} />
                        </div>
                    </div>

                    {/* bottom row of weather widget */}
                    <div className="weather-bottom-row">
                        <div className="weather-details-container">

                            {/* rain */}
                            <div className="weather-detail"> 
                                <i className="fa fa-cloud-showers-heavy"></i>
                                <span>{precipitation > 0 ? `${precipitation}mm` : 'no rain'}</span>
                            </div>

                            {/* humidity */}
                            <div className="weather-detail">
                                <i className="fa fa-tint"></i> 
                                <span>{weatherData.main.humidity}%</span>
                            </div>

                            {/* wind */}
                            <div className="weather-detail">
                                <i className="fa fa-wind"></i> 
                                <span>{windSpeedConversion(weatherData.wind.speed)} mph</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherWidget;
