import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './weather.css';

const WeatherWidget = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('California');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const apiKey = 'daeb2ba28d16bf92cf39006539f91bb8';
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const convertToFahrenheit = (celcius) => {
        return (celcius * 9/5) + 32;
    };

    const getIcon = (weatherIcon) => {
        let iconClass = '';
        switch (weatherIcon) {
            case '01d':
                iconClass = 'fa-sun';
                break;
            case '01n':
                iconClass = 'fa-moon';
                break;
            case '02d':
            case '02n':
                iconClass = 'fa-cloud-sun';
                break;
            case '03d':
            case '03n':
                iconClass = 'fa-cloud';
                break;
            case '04d':
            case '04n':
                iconClass = 'fa-cloud-meatball';
                break;
            case '09d':
            case '09n':
                iconClass = 'fa-cloud-showers-heavy';
                break;
            case '10d':
            case '10n':
                iconClass = 'fa-cloud-rain';
                break;
            case '50d':
            case '50n':
                iconClass = 'fa-smog';
                break;
            default:
                iconClass = 'fa-question';
                break;
        }
        console.log('Icon class: ', iconClass);

        return iconClass;
    };

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
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
    }, [city]);

    return (
        <div className="weather-widget">
            {weatherData ? (
                <>
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
                </>
            ) : (
                <p>loading weather data...</p>
            )}
        </div>
    );
};

export default WeatherWidget;
