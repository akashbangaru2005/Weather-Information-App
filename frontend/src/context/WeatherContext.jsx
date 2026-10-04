
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import { getWeather } from "../services/weatherService";

const WeatherContext = createContext(null);

const DEFAULT_LOCATION = "Hyderabad";
const DEFAULT_FORECAST_DAYS = 7;

/* =========================================================
   WEATHER ICON FALLBACK
========================================================= */

function getWeatherEmoji(condition = "") {
  const text = String(condition).toLowerCase();

  if (
    text.includes("thunder") ||
    text.includes("storm") ||
    text.includes("lightning")
  ) {
    return "⛈️";
  }

  if (
    text.includes("heavy rain") ||
    text.includes("moderate rain") ||
    text.includes("torrential")
  ) {
    return "🌧️";
  }

  if (
    text.includes("rain") ||
    text.includes("drizzle") ||
    text.includes("shower")
  ) {
    return "🌦️";
  }

  if (
    text.includes("snow") ||
    text.includes("sleet") ||
    text.includes("ice") ||
    text.includes("blizzard")
  ) {
    return "❄️";
  }

  if (
    text.includes("mist") ||
    text.includes("fog") ||
    text.includes("haze")
  ) {
    return "🌫️";
  }

  if (
    text.includes("overcast") ||
    text.includes("cloud")
  ) {
    return "☁️";
  }

  if (text.includes("partly")) {
    return "🌤️";
  }

  if (
    text.includes("clear") ||
    text.includes("sunny")
  ) {
    return "☀️";
  }

  return "🌤️";
}

/* =========================================================
   DATE / TIME HELPERS
========================================================= */

function formatDay(dateString, index) {
  if (index === 0) {
    return "Today";
  }

  if (!dateString) {
    return "--";
  }

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short"
  }).format(date);
}

function formatTime(dateTimeString) {
  if (!dateTimeString) {
    return "--";
  }

  const value = String(dateTimeString);

  /*
    WeatherAPI usually returns:
    YYYY-MM-DD HH:mm

    Extracting the time directly avoids accidentally
    converting another city's local time into the
    browser's timezone.
  */

  const match = value.match(/(\d{1,2}):(\d{2})/);

  if (!match) {
    return value;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return value;
  }

  const date = new Date(2000, 0, 1, hours, minutes);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

/* =========================================================
   API RESPONSE -> FRONTEND DATA
========================================================= */

function transformWeatherData(apiData) {
  const location = apiData?.location || {};
  const current = apiData?.current || {};
  const airQuality = apiData?.airQuality || {};
  const astronomy = apiData?.astronomy || {};

  const hourly = Array.isArray(apiData?.hourly)
    ? apiData.hourly
    : [];

  const daily = Array.isArray(apiData?.daily)
    ? apiData.daily
    : [];

  const alerts = Array.isArray(apiData?.alerts)
    ? apiData.alerts
    : [];

  /*
    Common current icon.
    Prefer API image URL and fall back to emoji.
  */
  const currentIcon =
    current?.icon ||
    getWeatherEmoji(current?.condition);

  /*
    Hourly chart data.
    Keep actual formatted time instead of raw API timestamp.
  */
  const chartData = hourly
    .slice(0, 12)
    .map((item) => ({
      time: formatTime(item?.time),
      temperature:
        Number(item?.temperature) || 0
    }));

  return {
    location: {
      city: location?.name || "Unknown",
      region: location?.region || "",
      country: location?.country || "",
      latitude: Number(location?.latitude) || 0,
      longitude: Number(location?.longitude) || 0,
      localTime: location?.localTime || ""
    },

    current: {
      temperature:
        Number(current?.temperature) || 0,

      feelsLike:
        Number(current?.feelsLike) || 0,

      condition:
        current?.condition || "Unknown",

      icon: currentIcon,

      humidity:
        Number(current?.humidity) || 0,

      wind:
        Number(current?.windSpeed) || 0,

      windDirection:
        current?.windDirection || "--",

      pressure:
        Number(current?.pressure) || 0,

      visibility:
        Number(current?.visibility) || 0,

      uv:
        Number(current?.uvIndex) || 0
    },

    airQuality: {
      aqi:
        Number(airQuality?.aqi) || 0,

      pm25:
        Number(airQuality?.pm25) || 0,

      pm10:
        Number(airQuality?.pm10) || 0,

      co:
        Number(airQuality?.co) || 0,

      no2:
        Number(airQuality?.no2) || 0,

      so2:
        Number(airQuality?.so2) || 0,

      o3:
        Number(airQuality?.o3) || 0
    },

    astronomy: {
      sunrise:
        astronomy?.sunrise || "--",

      sunset:
        astronomy?.sunset || "--",

      moonrise:
        astronomy?.moonrise || "--",

      moonset:
        astronomy?.moonset || "--",

      moonPhase:
        astronomy?.moonPhase || "Unknown"
    },

    hourly: hourly
      .slice(0, 12)
      .map((item) => ({
        time: formatTime(item?.time),

        icon:
          item?.icon ||
          getWeatherEmoji(item?.condition),

        condition:
          item?.condition || "Unknown",

        temp:
          Math.round(
            Number(item?.temperature) || 0
          ),

        humidity:
          Number(item?.humidity) || 0,

        wind:
          Number(item?.windSpeed) || 0,

        rainChance:
          Number(item?.precipitationChance) || 0
      })),

    daily: daily.map((item, index) => ({
      day: formatDay(item?.date, index),

      date:
        item?.date || "",

      icon:
        item?.icon ||
        getWeatherEmoji(item?.condition),

      min:
        Math.round(
          Number(item?.minTemperature) || 0
        ),

      max:
        Math.round(
          Number(item?.maxTemperature) || 0
        ),

      average:
        Math.round(
          Number(item?.averageTemperature) || 0
        ),

      condition:
        item?.condition || "Unknown",

      rainChance:
        Number(item?.precipitationChance) || 0
    })),

    chart: chartData,

    alerts
  };
}

/* =========================================================
   PROVIDER
========================================================= */

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(null);

  const [location, setLocation] =
    useState(DEFAULT_LOCATION);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  /* =======================================================
     FETCH WEATHER
  ======================================================= */

  const fetchWeather = useCallback(
    async (
      locationQuery,
      days = DEFAULT_FORECAST_DAYS
    ) => {
      const query = String(locationQuery || "").trim();

      if (!query) {
        setError("Please enter a location.");
        return null;
      }

      try {
        setLoading(true);
        setError("");

        const apiData = await getWeather(
          query,
          days
        );

        if (!apiData) {
          throw new Error(
            "Weather service returned no data."
          );
        }

        const formattedData =
          transformWeatherData(apiData);

        setWeather(formattedData);

        setLocation(
          formattedData?.location?.city ||
            query
        );

        setLastUpdated(new Date());

        return formattedData;
      } catch (err) {
        console.error(
          "Weather loading error:",
          err
        );

        /*
          Do NOT clear old weather data here.
          This allows the dashboard to keep showing
          the previous valid result if a refresh fails.
        */

        setError(
          err?.message ||
            "Unable to load weather information."
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* =======================================================
     INITIAL WEATHER
  ======================================================= */

  useEffect(() => {
    fetchWeather(DEFAULT_LOCATION);
  }, [fetchWeather]);

  /* =======================================================
     SEARCH WEATHER
  ======================================================= */

  const searchWeather = useCallback(
    async (searchValue) => {
      return fetchWeather(searchValue);
    },
    [fetchWeather]
  );

  /* =======================================================
     REFRESH CURRENT LOCATION
  ======================================================= */

  const refreshWeather = useCallback(
    async () => {
      if (!location?.trim()) {
        return null;
      }

      return fetchWeather(
        location,
        DEFAULT_FORECAST_DAYS
      );
    },
    [location, fetchWeather]
  );

  /* =======================================================
     USE BROWSER LOCATION
  ======================================================= */

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );

      return Promise.resolve(null);
    }

    setError("");
    setLoading(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const {
              latitude,
              longitude
            } = position.coords;

            /*
              WeatherAPI accepts coordinates as:
              latitude,longitude
            */

            const result = await fetchWeather(
              `${latitude},${longitude}`,
              DEFAULT_FORECAST_DAYS
            );

            resolve(result);
          } catch (err) {
            console.error(
              "Current location weather error:",
              err
            );

            setError(
              err?.message ||
                "Unable to fetch weather for your current location."
            );

            setLoading(false);
            resolve(null);
          }
        },

        (geoError) => {
          console.error(
            "Geolocation error:",
            geoError
          );

          let message =
            "Unable to access your location.";

          switch (geoError.code) {
            case 1:
              message =
                "Location permission was denied. Please allow location access and try again.";
              break;

            case 2:
              message =
                "Your current location is unavailable.";
              break;

            case 3:
              message =
                "Location request timed out. Please try again.";
              break;

            default:
              message =
                "Unable to determine your current location.";
          }

          setError(message);
          setLoading(false);

          resolve(null);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }, [fetchWeather]);

  /* =======================================================
     CLEAR ERROR
  ======================================================= */

  const clearError = useCallback(() => {
    setError("");
  }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
    weather,
    location,
    loading,
    error,
    lastUpdated,

    fetchWeather,
    searchWeather,
    refreshWeather,
    useMyLocation,
    clearError
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

/* =========================================================
   CUSTOM HOOK
========================================================= */

export function useWeather() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error(
      "useWeather must be used inside a WeatherProvider."
    );
  }

  return context;
}

export default WeatherContext;