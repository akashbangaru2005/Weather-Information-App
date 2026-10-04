
function isImageIcon(icon) {
  return (
    typeof icon === "string" &&
    (icon.startsWith("http://") ||
      icon.startsWith("https://"))
  );
}

function formatRainChance(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(number))
  );
}

function DailyForecast({ data = [] }) {
  const forecast =
    Array.isArray(data) ? data : [];

  if (forecast.length === 0) {
    return (
      <article className="clay-card forecast-card daily-card">
        <div className="no-forecast">
          Daily forecast is currently unavailable.
        </div>
      </article>
    );
  }

  /*
    Calculate one shared temperature scale so the
    range bars are visually proportional across days.
  */
  const allMinimums = forecast.map(
    (item) => Number(item?.min) || 0
  );

  const allMaximums = forecast.map(
    (item) => Number(item?.max) || 0
  );

  const lowestTemperature = Math.min(
    ...allMinimums
  );

  const highestTemperature = Math.max(
    ...allMaximums
  );

  const temperatureSpan = Math.max(
    highestTemperature - lowestTemperature,
    1
  );

  return (
    <article className="clay-card forecast-card daily-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="forecast-card-header">

        <div>
          <span className="card-label">
            DAILY
          </span>

          <h3>
            Upcoming days
          </h3>
        </div>

        <span className="forecast-count">
          {forecast.length} days
        </span>

      </div>

      {/* =================================================
          DAILY ROWS
      ================================================= */}

      <div
        className="daily-forecast-list"
        role="list"
        aria-label="Daily weather forecast"
      >

        {forecast.map((item, index) => {
          const minimum =
            Number(item?.min) || 0;

          const maximum =
            Number(item?.max) || 0;

          const average =
            Number(item?.average) || 0;

          const rainChance =
            formatRainChance(
              item?.rainChance
            );

          /*
            Position of minimum and maximum values
            relative to the complete forecast scale.
          */
          const startPosition =
            ((minimum -
              lowestTemperature) /
              temperatureSpan) *
            100;

          const endPosition =
            ((maximum -
              lowestTemperature) /
              temperatureSpan) *
            100;

          const width =
            Math.max(
              endPosition -
                startPosition,
              8
            );

          return (
            <div
              className={`day-row ${
                index === 0
                  ? "day-row-active"
                  : ""
              }`}
              key={`${
                item?.date ||
                item?.day ||
                "day"
              }-${index}`}
              role="listitem"
            >

              {/* =========================================
                  DAY
              ========================================= */}

              <div className="day-name-wrap">

                <div className="day-name">
                  {item?.day || "--"}
                </div>

                {index === 0 && (
                  <span className="day-today-badge">
                    TODAY
                  </span>
                )}

              </div>

              {/* =========================================
                  WEATHER ICON
              ========================================= */}

              <div className="day-weather">

                {isImageIcon(item?.icon) ? (
                  <img
                    src={item.icon}
                    alt={
                      item?.condition ||
                      "Weather"
                    }
                    className="day-api-icon"
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
                  <span aria-hidden="true">
                    {item?.icon || "🌤️"}
                  </span>
                )}

              </div>

              {/* =========================================
                  TEMPERATURE RANGE
              ========================================= */}

              <div className="temperature-range">

                <span className="day-min">
                  {minimum}°
                </span>

                <div
                  className="range-bar"
                  aria-label={`Temperature range from ${minimum} to ${maximum} degrees`}
                >
                  <div
                    className="range-fill"
                    style={{
                      marginLeft: `${Math.max(
                        0,
                        Math.min(
                          startPosition,
                          92
                        )
                      )}%`,
                      width: `${Math.min(
                        width,
                        100 -
                          Math.max(
                            0,
                            Math.min(
                              startPosition,
                              92
                            )
                          )
                      )}%`
                    }}
                  ></div>
                </div>

                <strong className="day-max">
                  {maximum}°
                </strong>

              </div>

              {/* =========================================
                  EXTRA INFORMATION
              ========================================= */}

              <div className="day-extra">

                <span className="day-condition">
                  {item?.condition ||
                    "Unknown"}
                </span>

                <span className="day-average">
                  Avg{" "}
                  {Math.round(
                    average
                  )}°
                </span>

                <small className="day-rain">
                  💧 {rainChance}%
                </small>

              </div>

            </div>
          );
        })}

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="forecast-footer">
        <span>
          Daily temperature range
        </span>

        <span>
          Rain probability included
        </span>
      </div>

    </article>
  );
}

export default DailyForecast;