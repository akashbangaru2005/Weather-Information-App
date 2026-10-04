
function isImageIcon(icon) {
  return (
    typeof icon === "string" &&
    (icon.startsWith("http://") ||
      icon.startsWith("https://"))
  );
}

function formatHourLabel(time, index) {
  if (index === 0) {
    return "Now";
  }

  return time || "--";
}

function HourlyForecast({ data = [] }) {
  const forecast =
    Array.isArray(data) ? data : [];

  if (forecast.length === 0) {
    return (
      <article className="clay-card forecast-card hourly-card">
        <div className="no-forecast">
          Hourly forecast is currently unavailable.
        </div>
      </article>
    );
  }

  return (
    <article className="clay-card forecast-card hourly-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="forecast-card-header">

        <div>
          <span className="card-label">
            HOURLY
          </span>

          <h3>
            Next hours
          </h3>
        </div>

        <span
          className="forecast-count"
          title="Number of displayed hourly forecasts"
        >
          {forecast.length} hrs
        </span>

      </div>

      {/* =================================================
          HORIZONTAL FORECAST
      ================================================= */}

      <div
        className="hourly-scroll"
        role="list"
        aria-label="Hourly weather forecast"
      >
        {forecast.map((item, index) => {
          const temperature =
            Math.round(
              Number(item?.temp) || 0
            );

          const humidity =
            Math.round(
              Number(item?.humidity) || 0
            );

          const wind =
            Math.round(
              Number(item?.wind) || 0
            );

          const rainChance =
            Math.round(
              Number(item?.rainChance) || 0
            );

          const hasRainData =
            item?.rainChance !== undefined &&
            item?.rainChance !== null;

          const hasWindData =
            item?.wind !== undefined &&
            item?.wind !== null;

          return (
            <div
              className={`hour-item ${
                index === 0
                  ? "hour-item-active"
                  : ""
              }`}
              key={`${
                item?.time || "hour"
              }-${index}`}
              role="listitem"
            >

              {/* Time */}
              <span className="hour-time">
                {formatHourLabel(
                  item?.time,
                  index
                )}
              </span>

              {/* Weather icon */}
              <span
                className="hour-icon"
                aria-hidden={
                  isImageIcon(item?.icon)
                    ? undefined
                    : "true"
                }
              >
                {isImageIcon(item?.icon) ? (
                  <img
                    src={item.icon}
                    alt={
                      item?.condition ||
                      "Weather"
                    }
                    className="hour-api-icon"
                    loading="lazy"
                    onError={(
                      event
                    ) => {
                      event.currentTarget.style.display =
                        "none";

                      const parent =
                        event.currentTarget
                          .parentElement;

                      if (parent) {
                        parent.textContent =
                          "🌤️";
                      }
                    }}
                  />
                ) : (
                  item?.icon || "🌤️"
                )}
              </span>

              {/* Temperature */}
              <strong className="hour-temperature">
                {temperature}°
              </strong>

              {/* Condition */}
              <span className="hour-condition">
                {item?.condition ||
                  "Unknown"}
              </span>

              {/* Rain chance */}
              {hasRainData && (
                <span className="hour-rain">
                  <span aria-hidden="true">
                    💧
                  </span>
                  {rainChance}%
                </span>
              )}

              {/* Wind */}
              {hasWindData && (
                <span className="hour-wind">
                  <span aria-hidden="true">
                    💨
                  </span>
                  {wind} km/h
                </span>
              )}

              {/* Humidity */}
              <span className="hour-humidity">
                <span aria-hidden="true">
                  •
                </span>
                {humidity}% humidity
              </span>

            </div>
          );
        })}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="forecast-footer">
        <span>
          Swipe horizontally to view more
        </span>

        <span>
          12-hour outlook
        </span>
      </div>

    </article>
  );
}

export default HourlyForecast;