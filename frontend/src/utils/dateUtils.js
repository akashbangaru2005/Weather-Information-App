
/* =========================================================
   DATE & TIME UTILITIES
========================================================= */

/**
 * Check whether a value is a valid Date object.
 */
export function isValidDate(date) {
  return (
    date instanceof Date &&
    !Number.isNaN(date.getTime())
  );
}


/* =========================================================
   SAFE DATE PARSING
========================================================= */

/**
 * Parse a date safely.
 *
 * Supports:
 * - Date objects
 * - YYYY-MM-DD
 * - YYYY-MM-DD HH:mm
 * - YYYY-MM-DDTHH:mm:ss
 */
export function parseWeatherDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isValidDate(value)
      ? value
      : null;
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  /*
    WeatherAPI commonly returns:
    YYYY-MM-DD HH:mm

    Replace the space with T for consistent
    JavaScript parsing.
  */
  const normalized =
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(
      text
    )
      ? text.replace(" ", "T")
      : text;

  const date = new Date(normalized);

  return isValidDate(date)
    ? date
    : null;
}


/* =========================================================
   WEATHERAPI LOCAL DATE/TIME
========================================================= */

/**
 * Extract the time portion from a WeatherAPI
 * local datetime without applying the browser timezone.
 */
export function extractLocalTime(
  dateTime
) {
  if (!dateTime) {
    return "--";
  }

  const match = String(dateTime).match(
    /(\d{1,2}):(\d{2})/
  );

  if (!match) {
    return "--";
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "--";
  }

  return {
    hours,
    minutes
  };
}


/**
 * Format a local WeatherAPI time as:
 * 08:30 PM
 */
export function formatLocalTime(
  dateTime
) {
  const time = extractLocalTime(
    dateTime
  );

  if (time === "--") {
    return "--";
  }

  const date = new Date(
    2000,
    0,
    1,
    time.hours,
    time.minutes
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
   DATE FORMATTING
========================================================= */

/**
 * Format a date as:
 * Sunday, 4 October 2026
 */
export function formatLongDate(
  value = new Date()
) {
  const date =
    value instanceof Date
      ? value
      : parseWeatherDate(value);

  if (!isValidDate(date)) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(date);
}


/**
 * Format a date as:
 * Sun
 */
export function formatShortDay(
  value
) {
  const date = parseWeatherDate(value);

  if (!isValidDate(date)) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "short"
    }
  ).format(date);
}


/**
 * Format a date as:
 * 4 Oct
 */
export function formatDayMonth(
  value
) {
  const date = parseWeatherDate(value);

  if (!isValidDate(date)) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short"
    }
  ).format(date);
}


/**
 * Format a date as:
 * 04/10/2026
 */
export function formatNumericDate(
  value
) {
  const date = parseWeatherDate(value);

  if (!isValidDate(date)) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  ).format(date);
}


/* =========================================================
   FORECAST DAY LABEL
========================================================= */

/**
 * Return:
 * Today
 * Tomorrow
 * Mon
 * Tue
 * etc.
 */
export function formatForecastDay(
  dateString,
  index = 0
) {
  if (index === 0) {
    return "Today";
  }

  if (index === 1) {
    return "Tomorrow";
  }

  const date = parseWeatherDate(
    dateString
  );

  if (!isValidDate(date)) {
    return "--";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      weekday: "short"
    }
  ).format(date);
}


/* =========================================================
   TIME COMPARISON
========================================================= */

/**
 * Convert a HH:mm time into minutes from midnight.
 */
export function timeToMinutes(
  time
) {
  if (!time) {
    return null;
  }

  const match = String(time).match(
    /^(\d{1,2}):(\d{2})/
  );

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}


/**
 * Check whether the current time is between
 * two local times.
 */
export function isTimeBetween(
  currentTime,
  startTime,
  endTime
) {
  const current =
    timeToMinutes(currentTime);

  const start =
    timeToMinutes(startTime);

  const end =
    timeToMinutes(endTime);

  if (
    current === null ||
    start === null ||
    end === null
  ) {
    return false;
  }

  /*
    Normal range:
      08:00 → 18:00
  */
  if (start <= end) {
    return (
      current >= start &&
      current <= end
    );
  }

  /*
    Overnight range:
      18:00 → 06:00
  */
  return (
    current >= start ||
    current <= end
  );
}


/* =========================================================
   SUN / MOON
========================================================= */

/**
 * Determine whether it is approximately daytime.
 */
export function isDaytime(
  currentTime,
  sunrise,
  sunset
) {
  return isTimeBetween(
    currentTime,
    sunrise,
    sunset
  );
}


/**
 * Determine whether it is approximately nighttime.
 */
export function isNighttime(
  currentTime,
  sunrise,
  sunset
) {
  return !isDaytime(
    currentTime,
    sunrise,
    sunset
  );
}


/* =========================================================
   RELATIVE TIME
========================================================= */

/**
 * Return a simple relative time string.
 *
 * Examples:
 * Just now
 * 5 minutes ago
 * 2 hours ago
 * 3 days ago
 */
export function getRelativeTime(
  value
) {
  const date =
    value instanceof Date
      ? value
      : parseWeatherDate(value);

  if (!isValidDate(date)) {
    return "--";
  }

  const difference =
    Date.now() - date.getTime();

  if (difference < 0) {
    return "Just now";
  }

  const seconds =
    Math.floor(
      difference / 1000
    );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  return `${days} day${
    days === 1 ? "" : "s"
  } ago`;
}


/* =========================================================
   CURRENT TIME
========================================================= */

/**
 * Get current local time formatted as:
 * 08:30 PM
 */
export function getCurrentTime() {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  ).format(new Date());
}


/**
 * Get today's date formatted as:
 * Sunday, 4 October 2026
 */
export function getTodayLongDate() {
  return formatLongDate(
    new Date()
  );
}


/* =========================================================
   TIMESTAMP
========================================================= */

/**
 * Return a timestamp useful for logging
 * or displaying the last successful update.
 */
export function getTimestamp() {
  return new Date().toISOString();
}
