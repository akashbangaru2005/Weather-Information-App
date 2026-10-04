
/* =========================================================
   WEATHER UTILITY FUNCTIONS
========================================================= */

/**
 * Convert a weather condition into an emoji fallback.
 * WeatherAPI image URLs should still be preferred whenever
 * they are available.
 */
export function getWeatherEmoji(condition = "") {
  const text = String(condition).toLowerCase().trim();

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
   ICON HELPERS
========================================================= */

/**
 * Check whether a value is a valid remote image URL.
 */
export function isWeatherImageIcon(icon) {
  return (
    typeof icon === "string" &&
    (
      icon.startsWith("http://") ||
      icon.startsWith("https://")
    )
  );
}


/**
 * Return the API icon when available,
 * otherwise return an emoji fallback.
 */
export function getWeatherIcon(
  icon,
  condition = ""
) {
  if (isWeatherImageIcon(icon)) {
    return icon;
  }

  return getWeatherEmoji(condition);
}


/* =========================================================
   NUMBER HELPERS
========================================================= */

/**
 * Safely convert a value into a number.
 */
export function toNumber(
  value,
  fallback = 0
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


/**
 * Safely round a numeric value.
 */
export function roundValue(
  value,
  decimals = 0
) {
  const number = toNumber(value);

  if (decimals <= 0) {
    return Math.round(number);
  }

  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      number * multiplier
    ) / multiplier
  );
}


/* =========================================================
   TEMPERATURE
========================================================= */

/**
 * Format temperature for display.
 */
export function formatTemperature(
  value,
  unit = "°C"
) {
  const number = toNumber(value);

  return `${Math.round(number)}${unit}`;
}


/* =========================================================
   WIND
========================================================= */

/**
 * Convert wind direction to degrees.
 */
export function getWindDirectionDegrees(
  direction
) {
  const text = String(
    direction || ""
  )
    .trim()
    .toUpperCase();

  const directions = {
    N: 0,
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    ESE: 112.5,
    SE: 135,
    SSE: 157.5,
    S: 180,
    SSW: 202.5,
    SW: 225,
    WSW: 247.5,
    W: 270,
    WNW: 292.5,
    NW: 315,
    NNW: 337.5
  };

  return directions[text] ?? 0;
}


/**
 * Return a readable wind intensity.
 */
export function getWindIntensity(
  speed
) {
  const value = toNumber(speed);

  if (value < 5) {
    return "Calm";
  }

  if (value < 12) {
    return "Light";
  }

  if (value < 20) {
    return "Moderate";
  }

  if (value < 30) {
    return "Fresh";
  }

  if (value < 40) {
    return "Strong";
  }

  return "Very strong";
}


/* =========================================================
   HUMIDITY
========================================================= */

export function getHumidityStatus(
  humidity
) {
  const value = toNumber(humidity);

  if (value < 30) {
    return "Dry";
  }

  if (value < 60) {
    return "Comfortable";
  }

  if (value < 75) {
    return "Humid";
  }

  return "Very humid";
}


/* =========================================================
   VISIBILITY
========================================================= */

export function getVisibilityStatus(
  visibility
) {
  const value = toNumber(visibility);

  if (value >= 10) {
    return "Excellent";
  }

  if (value >= 5) {
    return "Good";
  }

  if (value >= 2) {
    return "Moderate";
  }

  return "Low";
}


/* =========================================================
   UV INDEX
========================================================= */

export function getUVStatus(
  uv
) {
  const value = toNumber(uv);

  if (value <= 2) {
    return "Low";
  }

  if (value <= 5) {
    return "Moderate";
  }

  if (value <= 7) {
    return "High";
  }

  if (value <= 10) {
    return "Very high";
  }

  return "Extreme";
}


/* =========================================================
   AIR QUALITY
========================================================= */

export function getAQIStatus(
  aqi
) {
  const value = toNumber(aqi);

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
   PRESSURE
========================================================= */

export function getPressureStatus(
  pressure
) {
  const value = toNumber(pressure);

  if (value === 0) {
    return "Unavailable";
  }

  if (value < 1000) {
    return "Low";
  }

  if (value < 1020) {
    return "Normal";
  }

  if (value < 1030) {
    return "High";
  }

  return "Very high";
}


/* =========================================================
   MOON PHASE
========================================================= */

export function getMoonPhaseIcon(
  phase = ""
) {
  const text = String(
    phase
  ).toLowerCase();

  if (text.includes("new moon")) {
    return "🌑";
  }

  if (text.includes("waxing crescent")) {
    return "🌒";
  }

  if (text.includes("first quarter")) {
    return "🌓";
  }

  if (text.includes("waxing gibbous")) {
    return "🌔";
  }

  if (text.includes("full moon")) {
    return "🌕";
  }

  if (text.includes("waning gibbous")) {
    return "🌖";
  }

  if (
    text.includes("last quarter") ||
    text.includes("third quarter")
  ) {
    return "🌗";
  }

  if (text.includes("waning crescent")) {
    return "🌘";
  }

  return "🌙";
}


/* =========================================================
   DATE / TIME
========================================================= */

/**
 * Format YYYY-MM-DD into a readable weekday.
 */
export function formatWeatherDay(
  dateString,
  index = 0
) {
  if (index === 0) {
    return "Today";
  }

  if (!dateString) {
    return "--";
  }

  const date = new Date(
    `${dateString}T12:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "short"
    }
  ).format(date);
}


/**
 * Format WeatherAPI local datetime without
 * accidentally converting it to another timezone.
 */
export function formatWeatherTime(
  dateTimeString
) {
  if (!dateTimeString) {
    return "--";
  }

  const value = String(
    dateTimeString
  );

  const match =
    value.match(
      /(\d{1,2}):(\d{2})/
    );

  if (!match) {
    return value;
  }

  const hours =
    Number(match[1]);

  const minutes =
    Number(match[2]);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return value;
  }

  const date = new Date(
    2000,
    0,
    1,
    hours,
    minutes
  );

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  ).format(date);
}


/* =========================================================
   LOCATION
========================================================= */

/**
 * Format latitude / longitude for display.
 */
export function formatCoordinate(
  value,
  positiveDirection,
  negativeDirection
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  const direction =
    number >= 0
      ? positiveDirection
      : negativeDirection;

  return `${Math.abs(number).toFixed(
    4
  )}° ${direction}`;
}


/* =========================================================
   PRECIPITATION
========================================================= */

export function formatRainChance(
  value
) {
  const number = toNumber(value);

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(number)
    )
  );
}
