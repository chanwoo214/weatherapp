import { useEffect, useState, useCallback} from 'react';
import WeatherBox from './component/WeatherBox';
import WeatherButton from './component/WeatherButton';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 1. when app opens, current location weather is rendered
// 2. current location, temperature and status
// 3. there are 5 buttons (1 current location and 4 others)
// 4. when location is selected, selected city's weather is shown
// 5. when current location button is clicked, current location weather is shown 
// 6. until data has been received, this is shown by loading spinner
function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const cities = ['Paris', 'Sydney', 'Melbourne', 'Seoul', 'Los Angeles'];

  const getWeatherByCurrentLocation = async (lat, lon) => {
    setLoading(true); // Start loading
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9c50d93799569302b94e2ab396b348f9&units=metric`;
    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data && data.main && data.weather && data.weather[0]) {
        setWeather(data);
      } else {
        setWeather(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
    }
    setLoading(false); // Stop loading
  };

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getWeatherByCurrentLocation(lat, lon);
    });
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    console.log("city?", city);
  }, [city]);

  return (
    <div>
      <div className="container">
        {loading ? ( 
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        ) : (
          <WeatherBox weather={weather} />
        )}
        <WeatherButton cities={cities} setCity={setCity} />
      </div>
    </div>
  );
}

export default App;