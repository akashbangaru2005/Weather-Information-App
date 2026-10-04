
/* =========================================================
   WEATHER API SERVICE
   Frontend → Spring Boot Backend
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/* =========================================================
   REQUEST HELPER
========================================================= */

async function request(
  url,
  options = {}
) {
  let response;

  try {
    response = await fetch(
      url,
      {
        ...options,
        headers: {
          Accept: "application/json",
          ...options.headers
        }
      }
    );
  } catch (error) {
    console.error(
      "Weather API network error:",
      error
    );

    throw new Error(
      "Unable to connect to the weather server. Please make sure the Spring Boot backend is running."
    );
  }

  /*
    Try to read JSON even when the server
    returns an error response.
  */
  let data = null;

  try {
    data = await response.json();
  } catch {
    /*
      Some server errors may not contain JSON.
    */
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Weather request failed (${response.status}).`;

    throw new Error(message);
  }

  return data;
}


/* =========================================================
   GET WEATHER
========================================================= */

/**
 * Fetch complete weather information for a location.
 *
 * Example:
 * getWeather("Hyderabad", 7)
 *
 * The location can also be:
 * "17.3850,78.4867"
 */
export async function getWeather(
  location,
  days = 7
) {
  const query = String(
    location || ""
  ).trim();

  if (!query) {
    throw new Error(
      "Location is required."
    );
  }

  const requestedDays =
    Number(days);

  const forecastDays =
    Number.isFinite(requestedDays) &&
    requestedDays > 0
      ? Math.min(
          Math.round(requestedDays),
          10
        )
      : 7;

  const params =
    new URLSearchParams();

  params.set(
    "location",
    query
  );

  params.set(
    "days",
    String(forecastDays)
  );

  const url =
    `${API_BASE_URL}/weather?${params.toString()}`;

  return request(url);
}


/* =========================================================
   REFRESH WEATHER
========================================================= */

/**
 * Convenience method for refreshing a location.
 */
export async function refreshWeather(
  location,
  days = 7
) {
  return getWeather(
    location,
    days
  );
}


/* =========================================================
   GET CURRENT WEATHER
========================================================= */

/**
 * Fetch only the current weather section
 * when needed by future components.
 *
 * The backend currently returns the complete
 * weather response, so this extracts current data.
 */
export async function getCurrentWeather(
  location
) {
  const data =
    await getWeather(
      location,
      1
    );

  return data?.current || null;
}


/* =========================================================
   GET FORECAST
========================================================= */

/**
 * Fetch forecast information.
 *
 * Returns the complete backend response because
 * forecast data is already included by /api/weather.
 */
export async function getForecast(
  location,
  days = 7
) {
  const data =
    await getWeather(
      location,
      days
    );

  return {
    hourly: Array.isArray(
      data?.hourly
    )
      ? data.hourly
      : [],

    daily: Array.isArray(
      data?.daily
    )
      ? data.daily
      : []
  };
}


/* =========================================================
   GET AIR QUALITY
========================================================= */

/**
 * Get air-quality information from the
 * complete weather response.
 */
export async function getAirQuality(
  location
) {
  const data =
    await getWeather(
      location,
      1
    );

  return (
    data?.airQuality || {
      aqi: 0,
      pm25: 0,
      pm10: 0,
      co: 0,
      no2: 0,
      so2: 0,
      o3: 0
    }
  );
}


/* =========================================================
   GET ASTRONOMY
========================================================= */

/**
 * Get sunrise, sunset, moonrise, moonset
 * and moon phase.
 */
export async function getAstronomy(
  location
) {
  const data =
    await getWeather(
      location,
      1
    );

  return (
    data?.astronomy || {
      sunrise: "--",
      sunset: "--",
      moonrise: "--",
      moonset: "--",
      moonPhase: "Unknown"
    }
  );
}


/* =========================================================
   HEALTH CHECK
========================================================= */

/**
 * Check whether the backend is reachable.
 *
 * Uses the weather endpoint with a small
 * normal request because there may not be
 * a dedicated frontend health endpoint.
 */
export async function checkWeatherServer(
  location = "Hyderabad"
) {
  try {
    await getWeather(
      location,
      1
    );

    return true;
  } catch (error) {
    console.error(
      "Weather server check failed:",
      error
    );

    return false;
  }
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const weatherService = {
  getWeather,
  refreshWeather,
  getCurrentWeather,
  getForecast,
  getAirQuality,
  getAstronomy,
  checkWeatherServer
};

export default weatherService;
