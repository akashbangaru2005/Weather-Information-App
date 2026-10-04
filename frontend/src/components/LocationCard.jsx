
function formatCoordinate(value, positive, negative) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "--";
  }

  const direction =
    number >= 0 ? positive : negative;

  return `${Math.abs(number).toFixed(4)}° ${direction}`;
}

function LocationCard({
  city = "Unknown",
  region = "",
  country = "",
  latitude = 0,
  longitude = 0,
  date = ""
}) {
  const latitudeText = formatCoordinate(
    latitude,
    "N",
    "S"
  );

  const longitudeText = formatCoordinate(
    longitude,
    "E",
    "W"
  );

  const locationParts = [
    region,
    country
  ].filter(Boolean);

  return (
    <article className="clay-card location-card">

      {/* =================================================
          CARD HEADER
      ================================================= */}

      <div className="location-card-header">

        <span className="card-label">
          CURRENT LOCATION
        </span>

        <span
          className="location-live-indicator"
          title="Live location weather"
        >
          <span className="location-live-dot"></span>
          LIVE
        </span>

      </div>

      {/* =================================================
          LOCATION ICON
      ================================================= */}

      <div className="location-main">

        <div
          className="location-icon"
          aria-hidden="true"
        >
          📍
        </div>

        <div className="location-details">

          <h2 className="location-city">
            {city}
          </h2>

          {locationParts.length > 0 && (
            <p className="location-region">
              {locationParts.join(", ")}
            </p>
          )}

          {date && (
            <p className="location-date">
              {date}
            </p>
          )}

        </div>

      </div>

      {/* =================================================
          COORDINATES
      ================================================= */}

      <div className="location-coordinates">

        <div className="coordinate-item">
          <span className="coordinate-label">
            LATITUDE
          </span>

          <strong>
            {latitudeText}
          </strong>
        </div>

        <div className="coordinate-divider"></div>

        <div className="coordinate-item">
          <span className="coordinate-label">
            LONGITUDE
          </span>

          <strong>
            {longitudeText}
          </strong>
        </div>

      </div>

    </article>
  );
}

export default LocationCard;