
function CurrentWeather({
  temperature = 0,
  feelsLike = 0,
  condition = "Unknown",
  icon = "🌤️"
}) {
  const numericTemperature =
    Number.isFinite(Number(temperature))
      ? Math.round(Number(temperature))
      : 0;

  const numericFeelsLike =
    Number.isFinite(Number(feelsLike))
      ? Math.round(Number(feelsLike))
      : 0;

  const isImageIcon =
    typeof icon === "string" &&
    (icon.startsWith("http://") ||
      icon.startsWith("https://"));

  return (
    <article className="clay-card current-weather-card">

      {/* =================================================
          CARD HEADER
      ================================================= */}

      <div className="weather-card-top">
        <span className="card-label">
          CURRENT WEATHER
        </span>

        <span className="live-badge">
          <span className="live-dot"></span>
          LIVE
        </span>
      </div>

      {/* =================================================
          WEATHER CONTENT
      ================================================= */}

      <div className="current-weather-content">

        {/* Weather icon */}
        <div className="weather-icon-large">
          {isImageIcon ? (
            <img
              src={icon}
              alt={condition || "Current weather"}
              className="weather-api-icon"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";

                const fallback =
                  event.currentTarget
                    .parentElement;

                if (fallback) {
                  fallback.textContent = "🌤️";
                }
              }}
            />
          ) : (
            icon || "🌤️"
          )}
        </div>

        {/* Temperature information */}
        <div className="temperature-wrap">

          <div className="temperature">
            {numericTemperature}
            <span>°C</span>
          </div>

          <div className="condition">
            {condition || "Unknown"}
          </div>

          <div className="feels-like">
            Feels like{" "}
            {numericFeelsLike}°C
          </div>

        </div>

      </div>

    </article>
  );
}

export default CurrentWeather;
