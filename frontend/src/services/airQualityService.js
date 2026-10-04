
/* =========================================================
   AIR QUALITY API SERVICE
   Frontend → Spring Boot Backend
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/* =========================================================
   REQUEST HELPER
========================================================= */

async function request(url) {
  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });
  } catch (error) {
    console.error(
      "Air quality network error:",
      error
    );

    throw new Error(
      "Unable to connect to the weather server. Please make sure the Spring Boot backend is running."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Server returned no JSON body.
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Air quality request failed (${response.status}).`
    );
  }

  return data;
}


/* =========================================================
   DEFAULT RESPONSE
========================================================= */

function emptyAirQuality() {
  return {
    aqi: 0,
    pm25: 0,
    pm10: 0,
    co: 0,
    no2: 0,
    so2: 0,
    o3: 0
  };
}


/* =========================================================
   GET AIR QUALITY
========================================================= */

/**
 * Fetch air-quality information for a location.
 *
 * Example:
 * getAirQuality("Hyderabad")
 */
export async function getAirQuality(
  location
) {
  const query = String(
    location || ""
  ).trim();

  if (!query) {
    throw new Error(
      "Location is required."
    );
  }

  const params =
    new URLSearchParams();

  params.set(
    "location",
    query
  );

  const url =
    `${API_BASE_URL}/air-quality?${params.toString()}`;

  const data = await request(url);

  /*
    Return only the normalized air-quality
    object expected by the frontend.
  */
  const source =
    data?.airQuality ||
    data ||
    {};

  return {
    aqi:
      Number(source?.aqi) || 0,

    pm25:
      Number(source?.pm25) || 0,

    pm10:
      Number(source?.pm10) || 0,

    co:
      Number(source?.co) || 0,

    no2:
      Number(source?.no2) || 0,

    so2:
      Number(source?.so2) || 0,

    o3:
      Number(source?.o3) || 0
  };
}


/* =========================================================
   SAFE AIR QUALITY REQUEST
========================================================= */

/**
 * Returns an empty structure instead of throwing.
 *
 * Useful for optional air-quality sections where the
 * weather dashboard should continue working even if
 * air-quality data is unavailable.
 */
export async function getAirQualitySafe(
  location
) {
  try {
    return await getAirQuality(
      location
    );
  } catch (error) {
    console.error(
      "Air quality loading error:",
      error
    );

    return emptyAirQuality();
  }
}


/* =========================================================
   AIR QUALITY STATUS
========================================================= */

/**
 * WeatherAPI uses the US EPA categorical index.
 */
export function getAirQualityStatus(
  aqi
) {
  const value = Number(aqi) || 0;

  if (value <= 1) {
    return "Good";
  }

  if (value <= 2) {
    return "Moderate";
  }

  if (value <= 3) {
    return "Unhealthy for sensitive groups";
  }

  if (value <= 4) {
    return "Unhealthy";
  }

  if (value <= 5) {
    return "Very unhealthy";
  }

  return "Hazardous";
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const airQualityService = {
  getAirQuality,
  getAirQualitySafe,
  getAirQualityStatus
};

export default airQualityService;