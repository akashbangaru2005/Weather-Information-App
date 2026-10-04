
/* =========================================================
   LOCATION API SERVICE
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
    response = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers
      }
    });
  } catch (error) {
    console.error(
      "Location service network error:",
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
    // Response does not contain JSON.
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Location request failed (${response.status}).`
    );
  }

  return data;
}


/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLocation(
  location,
  index = 0
) {
  if (!location) {
    return null;
  }

  return {
    id:
      location.id ??
      location.place_id ??
      `location-${index}`,

    name:
      location.name ||
      location.city ||
      "Unknown location",

    region:
      location.region ||
      location.state ||
      "",

    country:
      location.country ||
      "",

    latitude:
      Number(
        location.latitude ??
          location.lat
      ) || 0,

    longitude:
      Number(
        location.longitude ??
          location.lon
      ) || 0
  };
}


/* =========================================================
   SEARCH LOCATIONS
========================================================= */

/**
 * Search cities, regions and countries.
 *
 * Example:
 * searchLocations("Hyderabad")
 */
export async function searchLocations(
  query
) {
  const value = String(
    query || ""
  ).trim();

  if (!value) {
    return [];
  }

  const params =
    new URLSearchParams();

  params.set(
    "q",
    value
  );

  const url =
    `${API_BASE_URL}/location/search?${params.toString()}`;

  const data =
    await request(url);

  /*
    Backend may return either:
      [...]
    or:
      { locations: [...] }
  */
  const locations =
    Array.isArray(data)
      ? data
      : Array.isArray(
          data?.locations
        )
      ? data.locations
      : [];

  return locations
    .map(
      (location, index) =>
        normalizeLocation(
          location,
          index
        )
    )
    .filter(Boolean)
    .slice(0, 10);
}


/* =========================================================
   GET SAVED LOCATIONS
========================================================= */

export async function getSavedLocations() {
  const data =
    await request(
      `${API_BASE_URL}/location/saved`
    );

  const locations =
    Array.isArray(data)
      ? data
      : Array.isArray(
          data?.locations
        )
      ? data.locations
      : [];

  return locations
    .map(
      (location, index) =>
        normalizeLocation(
          location,
          index
        )
    )
    .filter(Boolean);
}


/* =========================================================
   SAVE LOCATION
========================================================= */

/**
 * Save a location in the backend database.
 *
 * Expected input:
 * {
 *   name,
 *   region,
 *   country,
 *   latitude,
 *   longitude
 * }
 */
export async function saveLocation(
  location
) {
  if (!location) {
    throw new Error(
      "Location data is required."
    );
  }

  const name =
    String(
      location.name || ""
    ).trim();

  if (!name) {
    throw new Error(
      "Location name is required."
    );
  }

  const params =
    new URLSearchParams();

  params.set(
    "name",
    name
  );

  params.set(
    "region",
    String(
      location.region || ""
    )
  );

  params.set(
    "country",
    String(
      location.country || ""
    )
  );

  params.set(
    "latitude",
    String(
      Number(
        location.latitude
      ) || 0
    )
  );

  params.set(
    "longitude",
    String(
      Number(
        location.longitude
      ) || 0
    )
  );

  const data =
    await request(
      `${API_BASE_URL}/location/saved?${params.toString()}`,
      {
        method: "POST"
      }
    );

  return normalizeLocation(
    data
  );
}


/* =========================================================
   DELETE SAVED LOCATION
========================================================= */

export async function deleteSavedLocation(
  id
) {
  if (
    id === null ||
    id === undefined ||
    id === ""
  ) {
    throw new Error(
      "Location ID is required."
    );
  }

  const encodedId =
    encodeURIComponent(
      String(id)
    );

  await request(
    `${API_BASE_URL}/location/saved/${encodedId}`,
    {
      method: "DELETE"
    }
  );

  return true;
}


/* =========================================================
   LOCATION WEATHER QUERY
========================================================= */

/**
 * Convert a location object to a query accepted
 * by WeatherAPI.
 *
 * Example:
 * {
 *   latitude: 17.385,
 *   longitude: 78.486
 * }
 *
 * returns:
 * "17.385,78.486"
 */
export function locationToQuery(
  location
) {
  if (!location) {
    return "";
  }

  const latitude =
    Number(
      location.latitude
    );

  const longitude =
    Number(
      location.longitude
    );

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    return `${latitude},${longitude}`;
  }

  return String(
    location.name || ""
  ).trim();
}


/* =========================================================
   LOCATION LABEL
========================================================= */

/**
 * Create a readable location label.
 *
 * Example:
 * Hyderabad, Telangana, India
 */
export function formatLocationLabel(
  location
) {
  if (!location) {
    return "Unknown location";
  }

  const parts = [
    location.name,
    location.region,
    location.country
  ].filter(
    (part) =>
      String(
        part || ""
      ).trim()
  );

  return (
    parts.join(", ") ||
    "Unknown location"
  );
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

const locationService = {
  searchLocations,
  getSavedLocations,
  saveLocation,
  deleteSavedLocation,
  locationToQuery,
  formatLocationLabel
};

export default locationService;
