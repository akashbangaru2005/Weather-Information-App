
import { useWeather as useWeatherContext } from "../context/WeatherContext";

function useWeather() {
  return useWeatherContext();
}

export default useWeather;
