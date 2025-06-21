import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloudy_icon from '../assets/cloud.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const GEO_API_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const DEFAULT_UNITS = 'metric';

const weatherIconMap = {
    "01d": clear_icon, "01n": clear_icon,
    "02d": cloudy_icon, "02n": cloudy_icon,
    "03d": cloudy_icon, "03n": cloudy_icon,
    "04d": cloudy_icon, "04n": cloudy_icon,
    "09d": rain_icon, "09n": rain_icon,
    "10d": drizzle_icon, "10n": drizzle_icon,
    "11d": rain_icon, "11n": rain_icon,
    "13d": snow_icon, "13n": snow_icon,
    "50d": cloudy_icon, "50n": cloudy_icon,
};

const Weather = () => {
    const [temperature, setTemperature] = useState('--');
    const [location, setLocation] = useState('Loading...');
    const [humidity, setHumidity] = useState('--');
    const [windSpeed, setWindSpeed] = useState('--');
    const [weatherIcon, setWeatherIcon] = useState(clear_icon);
    const [dateTime, setDateTime] = useState('Loading...');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const inputRef = useRef(null);
    const API_KEY = import.meta.env.VITE_APP_ID;

    const unixConverter = (unixTime, timezoneOffset = 0) => {
        if (!unixTime) return 'N/A';
        const dateFromUnix = new Date((unixTime + timezoneOffset) * 1000);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC',
        };
        return dateFromUnix.toLocaleString(undefined, options);
    };

    const search = async (query, isCoords = false) => {
        setError(null);
        setLoading(true);

        if (!isCoords && (!query || query.trim() === '')) {
            setError("Please enter a city name.");
            setLoading(false);
            return;
        }

        try {
            let lat, lon, cityName;

            if (isCoords) {
                lat = query.latitude;
                lon = query.longitude;

                const reverseGeoUrl = `${GEO_API_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
                const reverseGeoResponse = await fetch(reverseGeoUrl);
                if (!reverseGeoResponse.ok) throw new Error(`HTTP error! status: ${reverseGeoResponse.status}`);
                const reverseGeoData = await reverseGeoResponse.json();

                if (reverseGeoData.length > 0 && reverseGeoData[0].name) {
                    cityName = reverseGeoData[0].name;
                } else {
                    cityName = "Unknown Location";
                }

            } else {
                const geoUrl = `${GEO_API_BASE_URL}/direct?q=${query}&limit=1&appid=${API_KEY}`;
                const geoResponse = await fetch(geoUrl);
                if (!geoResponse.ok) throw new Error(`HTTP error! status: ${geoResponse.status}`);
                const geoData = await geoResponse.json();

                if (geoData.length === 0) {
                    setError("City not found. Please enter a valid location.");
                    setLoading(false);
                    return;
                }
                ({ lat, lon, name: cityName } = geoData[0]);
            }

            const weatherUrl = `${WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${DEFAULT_UNITS}`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) throw new Error(`HTTP error! status: ${weatherResponse.status}`);
            const weatherData = await weatherResponse.json();

            setTemperature(`${Math.round(weatherData.main.temp)}°C`);
            setHumidity(`${weatherData.main.humidity}%`);
            setWindSpeed(`${Math.round(weatherData.wind.speed * 3.6)} km/h`);
            setLocation(cityName);
            setDateTime(unixConverter(weatherData.dt, weatherData.timezone));

            const iconCode = weatherData.weather[0].icon;
            setWeatherIcon(weatherIconMap[iconCode] || clear_icon);

            if (inputRef.current && !isCoords) {
                inputRef.current.value = '';
            }

        } catch (err) {
            console.error("Error fetching weather data:", err);
            setError(`Could not fetch weather data: ${err.message}. Please check your API key or network connection.`);
            setTemperature('--');
            setLocation('Failed to load');
            setHumidity('--');
            setWindSpeed('--');
            setDateTime('N/A');
            setWeatherIcon(cloudy_icon);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (inputRef.current) {
            search(inputRef.current.value);
        }
    };

    useEffect(() => {
        const getIpBasedLocation = async () => {
            setLoading(true);
            setLocation('Detecting your location via IP...');

            try {
                const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch IP-based location data: ${response.statusText}`);
                }
                const data = await response.json();

                if (data && data.latitude && data.longitude) {
                    search({ latitude: data.latitude, longitude: data.longitude }, true);
                } else {
                    throw new Error('IP geolocation data incomplete or unavailable.');
                }
            } catch (err) {
                console.error("IP-based geolocation failed:", err);
                setError("Could not auto-detect your location. Falling back to a default city.");
                search('London');
            }
        };

        getIpBasedLocation();
    }, []);

    return (
        <div className='weather-app relative min-h-screen flex items-center justify-center p-4 overflow-hidden
                        bg-transparent'>

            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob z-0"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000 z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-4000 z-0"></div>


            <div className='weather-container z-10 
                          flex flex-col items-center p-8 rounded-3xl shadow-2xl
                           opacity-90 backdrop-blur-xl border border-white border-opacity-30
                          max-w-md w-full transition-all duration-500 ease-in-out
                          transform hover:scale-102 hover:shadow-3xl'>

                <div className='search-bar flex items-center gap-4 w-full mb-6'>
                    <input
                        type="text"
                        ref={inputRef}
                        placeholder='Enter a city or location'
                        className='flex-grow rounded-full py-2.5 px-5 text-lg shadow-inner placeholder:text-gray-600 text-gray-700
                                   bg-white bg-opacity-25 backdrop-blur-sm border border-white border-opacity-40
                                    placeholder-gray-200
                                   focus:ring-2 focus:ring-yellow-300 focus:outline-none transition-all duration-300'
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <img
                        src={search_icon}
                        alt="Search"
                        className='w-12 h-12 p-3 rounded-full cursor-pointer
                                   bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all duration-200 shadow-md'
                        onClick={handleSearch}
                    />
                </div>

                {error && <p className="text-red-200 bg-red-800 bg-opacity-50 p-2 rounded-lg mb-4 text-center text-sm animate-fade-in-down">{error}</p>}

                {loading ? (
                    <div className='flex flex-col items-center justify-center my-8'>
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
                        <p className='text-xl text-yellow-200 animate-pulse'>{location}</p>
                    </div>
                ) : (
                    <>
                        <img src={weatherIcon} alt="Weather Icon" className='w-40 h-40 mx-auto my-4 transition-transform duration-500 transform hover:scale-115 animate-bounce-slow' />
                        <p className='text-7xl font-extrabold mb-2 text-white drop-shadow-lg animate-fade-in-up'>{temperature}</p>
                        <p className='text-4xl font-semibold mb-2 text-yellow-300 drop-shadow-md animate-fade-in-up animation-delay-200'>{location}</p>
                        <p className='text-lg text-gray-100 mb-8 animate-fade-in-up animation-delay-400'>{dateTime}</p>

                        <div className='grid grid-cols-2 gap-x-8 gap-y-6 w-full mt-6 '>
                            <div className="weather-data flex flex-col items-center p-3 bg-transparent bg-opacity-100 rounded-lg shadow-inner animate-fade-in-left">
                                <img src={humidity_icon} alt="Humidity Icon" className='w-14 h-14 mb-2 filter drop-shadow' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>{humidity}</p>
                                    <span className='text-sm text-gray-200'>Humidity</span>
                                </div>
                            </div>
                            <div className="weather-data flex flex-col items-center p-3 bg-transparent bg-opacity-100 rounded-lg shadow-inner animate-fade-in-right">
                                <img src={wind_icon} alt="Wind Icon" className='w-14 h-14 mb-2 filter drop-shadow' />
                                <div className='text-center'>
                                    <p className='text-2xl font-bold text-white'>{windSpeed}</p>
                                    <span className='text-sm text-gray-200'>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Weather;