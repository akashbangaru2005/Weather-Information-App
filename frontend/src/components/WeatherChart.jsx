
function formatTemperature(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.round(number);
}

function WeatherChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data
        .map((item, index) => {
          if (typeof item === "object" && item !== null) {
            return {
              time:
                item.time ||
                `${index + 1}h`,
              temperature:
                formatTemperature(
                  item.temperature
                )
            };
          }

          return {
            time: `${index + 1}h`,
            temperature:
              formatTemperature(item)
          };
        })
        .slice(0, 12)
    : [];

  if (chartData.length === 0) {
    return (
      <article className="clay-card chart-card">
        <div className="no-forecast">
          Temperature chart is currently unavailable.
        </div>
      </article>
    );
  }

  const temperatures =
    chartData.map(
      (item) => item.temperature
    );

  const minimum =
    Math.min(...temperatures);

  const maximum =
    Math.max(...temperatures);

  const average =
    temperatures.reduce(
      (sum, value) => sum + value,
      0
    ) / temperatures.length;

  const chartMin =
    Math.min(...temperatures) - 2;

  const chartMax =
    Math.max(...temperatures) + 2;

  const chartRange = Math.max(
    chartMax - chartMin,
    1
  );

  return (
    <article className="clay-card chart-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="chart-header">

        <div>
          <span className="card-label">
            TEMPERATURE
          </span>

          <h3>
            Hourly temperature
          </h3>
        </div>

        <span className="chart-period">
          Next {chartData.length} hours
        </span>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="chart-summary">

        <div>
          <span>
            LOW
          </span>

          <strong>
            {minimum}°
          </strong>
        </div>

        <div>
          <span>
            AVERAGE
          </span>

          <strong>
            {Math.round(average)}°
          </strong>
        </div>

        <div>
          <span>
            HIGH
          </span>

          <strong>
            {maximum}°
          </strong>
        </div>

      </div>

      {/* =================================================
          CHART
      ================================================= */}

      <div
        className="chart"
        role="img"
        aria-label={`Hourly temperature chart. Low ${minimum} degrees, average ${Math.round(
          average
        )} degrees, high ${maximum} degrees.`}
      >

        {/* Horizontal guide lines */}
        <div className="chart-guides">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Bars */}
        <div className="chart-bars">

          {chartData.map(
            (item, index) => {
              const normalizedHeight =
                ((item.temperature -
                  chartMin) /
                  chartRange) *
                100;

              const safeHeight = Math.max(
                8,
                Math.min(
                  100,
                  normalizedHeight
                )
              );

              return (
                <div
                  className="chart-column"
                  key={`${item.time}-${index}`}
                  title={`${item.time}: ${item.temperature}°C`}
                >

                  <div className="chart-value">
                    {item.temperature}°
                  </div>

                  <div className="chart-bar-area">

                    <div
                      className={`chart-bar ${
                        index === 0
                          ? "chart-bar-active"
                          : ""
                      }`}
                      style={{
                        height: `${safeHeight}%`
                      }}
                    >
                      <span className="chart-bar-dot"></span>
                    </div>

                  </div>

                  <span className="chart-time">
                    {item.time}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="chart-footer">
        <span>
          Live hourly temperature trend
        </span>

        <span>
          °C
        </span>
      </div>

    </article>
  );
}

export default WeatherChart;