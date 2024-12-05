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

    const getIcon = (weatherIcon) => {
        switch (weatherIcon) {
            case '01d':
                return 'fa-sun';
            case '01n':
                return'fa-moon';
            case '02d':
            case '02n':
                return 'fa-cloud-sun';
            case '03d':
            case '03n':
                return 'fa-cloud';
            case '04d':
            case '04n':
                return 'fa-cloud-meatball';
            case '09d':
            case '09n':
                return'fa-cloud-showers-heavy';
            case '10d':
            case '10n':
                return 'fa-cloud-rain';
            case '50d':
            case '50n':
                return 'fa-smog';
            default:
                return 'fa-question';
        }
    };

    useEffect(() => {
        const fetchWeather = async () => {
            if (!location) return;
            console.log('Weather Data: ', location)
            setLoading(true);
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;

            try {
                const response = await axios.get(apiURL);
                setWeatherData(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch weather data');
                setWeatherData(null);
            }
            setLoading(false)
        };
        fetchWeather();
    }, [location]);

    return (
        <div className="weather-widget">
            {weatherData ? (
                <div>
                    <h2>
                        <i className={`fa ${getIcon(weatherData.weather[0].icon)} weather-icon`} />
                    </h2>
                    { loading ? (
                        <p>loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div className="weather-info">
                            <p>temperature: {convertToFahrenheit(weatherData.main.temp).toFixed(1)}°F</p>
                            <p>weather: {weatherData.weather[0].description}</p>
                            <p>humidity: {weatherData.main.humidity}%</p>
                            <p>wind speed: {weatherData.wind.speed} m/s</p>
                        </div>
                    )}
                </div>
            ) : (
                <p>
                    {getIcon('04n').icon}
                    loading weather data...<br />
                    uncomment 'apiURL' to display data.                </p>
            )}
        </div>
    );
};

export default WeatherWidget;
