
function getAQIInfo(aqi) {
  const value = Number(aqi) || 0;

  /*
    WeatherAPI air-quality data uses the US EPA
    index rather than a 0–500 AQI scale.
  */

  if (value <= 1) {
    return {
      level: "Good",
      message: "Air quality is satisfactory.",
      className: "aqi-good",
      icon: "✅"
    };
  }

  if (value <= 2) {
    return {
      level: "Moderate",
      message:
        "Air quality is acceptable for most people.",
      className: "aqi-moderate",
      icon: "🟡"
    };
  }

  if (value <= 3) {
    return {
      level: "Unhealthy for sensitive groups",
      message:
        "Sensitive individuals should limit prolonged exposure.",
      className: "aqi-sensitive",
      icon: "⚠️"
    };
  }

  if (value <= 4) {
    return {
      level: "Unhealthy",
      message:
        "Consider reducing prolonged outdoor activity.",
      className: "aqi-unhealthy",
      icon: "⚠️"
    };
  }

  if (value <= 5) {
    return {
      level: "Very unhealthy",
      message:
        "Reduce outdoor exposure where possible.",
      className: "aqi-very-unhealthy",
      icon: "🚨"
    };
  }

  return {
    level: "Hazardous",
    message:
      "Avoid prolonged outdoor exposure.",
    className: "aqi-hazardous",
    icon: "🚨"
  };
}

function formatPollutant(value, decimals = 1) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  if (number === 0) {
    return "0";
  }

  return number.toFixed(decimals);
}

function Pollutant({
  name,
  value,
  unit = "µg/m³"
}) {
  return (
    <div className="pollutant-item">
      <span className="pollutant-name">
        {name}
      </span>

      <strong className="pollutant-value">
        {value}
      </strong>

      <small className="pollutant-unit">
        {unit}
      </small>
    </div>
  );
}

function AirQuality({
  aqi = 0,
  pm25 = 0,
  pm10 = 0,
  co = 0,
  no2 = 0,
  so2 = 0,
  o3 = 0
}) {
  const numericAQI =
    Number(aqi) || 0;

  const aqiInfo =
    getAQIInfo(numericAQI);

  return (
    <article className="clay-card air-quality-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="air-quality-header">

        <div>
          <span className="card-label">
            AIR QUALITY
          </span>

          <h3>
            Atmospheric health
          </h3>
        </div>

        <div
          className={`aqi-badge ${aqiInfo.className}`}
          title="US EPA air quality index"
        >
          <span aria-hidden="true">
            {aqiInfo.icon}
          </span>

          <span>
            {aqiInfo.level}
          </span>
        </div>

      </div>

      {/* =================================================
          AQI MAIN VALUE
      ================================================= */}

      <div className="aqi-main">

        <div className="aqi-score-wrap">

          <span className="aqi-score-label">
            US EPA INDEX
          </span>

          <strong className="aqi-score">
            {numericAQI}
          </strong>

        </div>

        <div className="aqi-description">
          <strong>
            {aqiInfo.level}
          </strong>

          <p>
            {aqiInfo.message}
          </p>
        </div>

      </div>

      {/* =================================================
          POLLUTANTS
      ================================================= */}

      <div className="pollutant-grid">

        <Pollutant
          name="PM2.5"
          value={formatPollutant(pm25)}
        />

        <Pollutant
          name="PM10"
          value={formatPollutant(pm10)}
        />

        <Pollutant
          name="CO"
          value={formatPollutant(co)}
        />

        <Pollutant
          name="NO₂"
          value={formatPollutant(no2)}
        />

        <Pollutant
          name="SO₂"
          value={formatPollutant(so2)}
        />

        <Pollutant
          name="O₃"
          value={formatPollutant(o3)}
        />

      </div>

    </article>
  );
}

export default AirQuality;