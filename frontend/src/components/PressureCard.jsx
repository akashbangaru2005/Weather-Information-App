
function getPressureInfo(pressure) {
  const value = Number(pressure) || 0;

  if (value === 0) {
    return {
      status: "Unavailable",
      description: "Pressure data unavailable",
      percentage: 50
    };
  }

  if (value < 1000) {
    return {
      status: "Low",
      description: "Lower atmospheric pressure",
      percentage: 30
    };
  }

  if (value < 1020) {
    return {
      status: "Normal",
      description: "Typical atmospheric pressure",
      percentage: 50
    };
  }

  if (value < 1030) {
    return {
      status: "High",
      description: "Higher atmospheric pressure",
      percentage: 70
    };
  }

  return {
    status: "Very high",
    description: "Strong atmospheric pressure",
    percentage: 90
  };
}

function PressureCard({ pressure = 0 }) {
  const numericPressure =
    Number(pressure) || 0;

  const pressureInfo =
    getPressureInfo(numericPressure);

  /*
    WeatherAPI returns atmospheric pressure
    in millibars / hPa.
  */

  const displayPressure =
    numericPressure > 0
      ? Math.round(numericPressure)
      : "--";

  return (
    <article className="clay-card detail-card pressure-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="detail-header">

        <div>
          <span className="card-label">
            PRESSURE
          </span>

          <h3>
            Atmospheric pressure
          </h3>
        </div>

        <div
          className="detail-header-icon"
          aria-hidden="true"
        >
          🌡️
        </div>

      </div>

      {/* =================================================
          MAIN VALUE
      ================================================= */}

      <div className="pressure-main">

        <div className="pressure-value-wrap">

          <span className="pressure-value">
            {displayPressure}
          </span>

          <span className="pressure-unit">
            hPa
          </span>

        </div>

        <div className="pressure-status">
          <span>
            {pressureInfo.status}
          </span>

          <small>
            {pressureInfo.description}
          </small>
        </div>

      </div>

      {/* =================================================
          PRESSURE GAUGE
      ================================================= */}

      <div className="pressure-gauge">

        <div className="pressure-gauge-header">
          <span>
            PRESSURE LEVEL
          </span>

          <strong>
            {numericPressure > 0
              ? `${numericPressure.toFixed(0)} hPa`
              : "--"}
          </strong>
        </div>

        <div className="pressure-gauge-track">

          <div
            className="pressure-gauge-fill"
            style={{
              width: `${pressureInfo.percentage}%`
            }}
          ></div>

        </div>

        <div className="pressure-scale">
          <span>LOW</span>
          <span>NORMAL</span>
          <span>HIGH</span>
        </div>

      </div>

      {/* =================================================
          WEATHER INDICATOR
      ================================================= */}

      <div className="pressure-note">
        <span aria-hidden="true">
          ℹ️
        </span>

        <span>
          Atmospheric pressure can influence
          changing weather conditions.
        </span>
      </div>

    </article>
  );
}

export default PressureCard;
