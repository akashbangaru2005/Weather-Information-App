
/* =========================================================
   GENERAL FORMATTING UTILITIES
========================================================= */

/**
 * Safely convert a value into a finite number.
 */
export function safeNumber(
  value,
  fallback = 0
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}


/* =========================================================
   NUMBER FORMATTING
========================================================= */

/**
 * Format a number with a fixed number of decimals.
 *
 * Example:
 * 28.456 -> "28.46"
 */
export function formatNumber(
  value,
  decimals = 0
) {
  const number = safeNumber(value);

  return number.toFixed(
    Math.max(0, decimals)
  );
}


/**
 * Format a number using Indian locale.
 *
 * Example:
 * 1234567 -> "12,34,567"
 */
export function formatIndianNumber(
  value,
  decimals = 0
) {
  const number = safeNumber(value);

  return new Intl.NumberFormat(
    "en-IN",
    {
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals
    }
  ).format(number);
}


/* =========================================================
   TEMPERATURE
========================================================= */

/**
 * Format temperature for the UI.
 *
 * Example:
 * 28.6 -> "29°C"
 */
export function formatTemperature(
  value,
  unit = "°C"
) {
  const number = safeNumber(value);

  return `${Math.round(number)}${unit}`;
}


/**
 * Format temperature without unit.
 *
 * Example:
 * 28.6 -> "29"
 */
export function formatTemperatureValue(
  value
) {
  return String(
    Math.round(
      safeNumber(value)
    )
  );
}


/* =========================================================
   PERCENTAGE
========================================================= */

/**
 * Safely format a percentage.
 *
 * Example:
 * 67.4 -> "67%"
 */
export function formatPercentage(
  value,
  decimals = 0
) {
  const number = Math.max(
    0,
    Math.min(
      100,
      safeNumber(value)
    )
  );

  return `${number.toFixed(
    Math.max(0, decimals)
  )}%`;
}


/* =========================================================
   DISTANCE
========================================================= */

/**
 * Format visibility or distance in kilometres.
 *
 * Example:
 * 10 -> "10.0 km"
 */
export function formatKilometers(
  value,
  decimals = 1
) {
  const number = safeNumber(value);

  return `${number.toFixed(
    Math.max(0, decimals)
  )} km`;
}


/* =========================================================
   SPEED
========================================================= */

/**
 * Format wind speed.
 *
 * Example:
 * 15.6 -> "16 km/h"
 */
export function formatWindSpeed(
  value,
  decimals = 0
) {
  const number = safeNumber(value);

  return `${number.toFixed(
    Math.max(0, decimals)
  )} km/h`;
}


/* =========================================================
   PRESSURE
========================================================= */

/**
 * Format atmospheric pressure.
 *
 * Example:
 * 1013.4 -> "1013 hPa"
 */
export function formatPressure(
  value,
  decimals = 0
) {
  const number = safeNumber(value);

  return `${number.toFixed(
    Math.max(0, decimals)
  )} hPa`;
}


/* =========================================================
   AIR QUALITY
========================================================= */

/**
 * Format an air-pollutant concentration.
 *
 * Example:
 * 24.567 -> "24.6 µg/m³"
 */
export function formatPollutant(
  value,
  decimals = 1,
  unit = "µg/m³"
) {
  const number = safeNumber(value);

  return `${number.toFixed(
    Math.max(0, decimals)
  )} ${unit}`;
}


/**
 * Format gas concentration.
 *
 * Example:
 * 0.452 -> "0.45"
 */
export function formatConcentration(
  value,
  decimals = 2
) {
  const number = safeNumber(value);

  return number.toFixed(
    Math.max(0, decimals)
  );
}


/* =========================================================
   UV INDEX
========================================================= */

/**
 * Format UV index.
 *
 * Example:
 * 6.4 -> "6.4"
 */
export function formatUV(
  value,
  decimals = 1
) {
  const number = Math.max(
    0,
    safeNumber(value)
  );

  return number.toFixed(
    Math.max(0, decimals)
  );
}


/* =========================================================
   COORDINATES
========================================================= */

/**
 * Format latitude.
 */
export function formatLatitude(
  value
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  const direction =
    number >= 0 ? "N" : "S";

  return `${Math.abs(number).toFixed(
    4
  )}° ${direction}`;
}


/**
 * Format longitude.
 */
export function formatLongitude(
  value
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  const direction =
    number >= 0 ? "E" : "W";

  return `${Math.abs(number).toFixed(
    4
  )}° ${direction}`;
}


/* =========================================================
   RANGE / CLAMP
========================================================= */

/**
 * Keep a numeric value inside a range.
 */
export function clamp(
  value,
  minimum,
  maximum
) {
  const number = safeNumber(
    value,
    minimum
  );

  return Math.max(
    minimum,
    Math.min(maximum, number)
  );
}


/**
 * Convert a value into a percentage
 * between a minimum and maximum.
 */
export function toPercentage(
  value,
  minimum,
  maximum
) {
  const number = safeNumber(value);

  if (maximum === minimum) {
    return 0;
  }

  const percentage =
    ((number - minimum) /
      (maximum - minimum)) *
    100;

  return clamp(
    percentage,
    0,
    100
  );
}


/* =========================================================
   WIND DIRECTION
========================================================= */

/**
 * Make sure a wind direction is display-ready.
 */
export function formatWindDirection(
  direction
) {
  const value = String(
    direction || ""
  )
    .trim()
    .toUpperCase();

  return value || "--";
}


/* =========================================================
   MOON PHASE
========================================================= */

/**
 * Clean up a moon phase label.
 */
export function formatMoonPhase(
  phase
) {
  const value = String(
    phase || ""
  ).trim();

  return value || "Unknown";
}


/* =========================================================
   TEXT
========================================================= */

/**
 * Safely return a fallback for missing text.
 */
export function formatText(
  value,
  fallback = "--"
) {
  const text = String(
    value ?? ""
  ).trim();

  return text || fallback;
}


/**
 * Capitalize the first letter of a string.
 */
export function capitalize(
  value
) {
  const text = String(
    value || ""
  ).trim();

  if (!text) {
    return "";
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}


/* =========================================================
   WEATHER CONDITION
========================================================= */

/**
 * Normalize a weather condition for display.
 */
export function formatCondition(
  condition
) {
  const text = formatText(
    condition,
    "Unknown"
  );

  return capitalize(text);
}


/* =========================================================
   AQI INDEX
========================================================= */

/**
 * Format WeatherAPI's categorical US EPA index.
 */
export function formatAQIIndex(
  value
) {
  const number = clamp(
    Math.round(
      safeNumber(value)
    ),
    0,
    6
  );

  return String(number);
}


/* =========================================================
   TIME DURATION
========================================================= */

/**
 * Format minutes into a readable duration.
 *
 * Examples:
 * 45  -> "45 min"
 * 90  -> "1 hr 30 min"
 */
export function formatDuration(
  totalMinutes
) {
  const minutes = Math.max(
    0,
    Math.round(
      safeNumber(totalMinutes)
    )
  );

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${
      hours === 1 ? "" : "s"
    }`;
  }

  return `${hours} hr${
    hours === 1 ? "" : "s"
  } ${remainingMinutes} min`;
}


/* =========================================================
   FILE / DATA SIZE
========================================================= */

/**
 * Generic byte formatter.
 * Kept here for possible future weather export/cache
 * functionality.
 */
export function formatBytes(
  bytes
) {
  const value = safeNumber(bytes);

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 ** 2) {
    return `${(
      value / 1024
    ).toFixed(1)} KB`;
  }

  if (value < 1024 ** 3) {
    return `${(
      value / 1024 ** 2
    ).toFixed(1)} MB`;
  }

  return `${(
    value / 1024 ** 3
  ).toFixed(1)} GB`;
}


/* =========================================================
   EMPTY / FALLBACK DISPLAY
========================================================= */

/**
 * Return a safe display value.
 */
export function displayValue(
  value,
  fallback = "--"
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}
