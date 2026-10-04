
function getHumidityInfo(humidity) {
  const value = Number(humidity) || 0;

  if (value < 30) {
    return {
      label: "Dry",
      description: "Low moisture"
    };
  }

  if (value < 60) {
    return {
      label: "Comfortable",
      description: "Pleasant air"
    };
  }

  if (value < 75) {
    return {
      label: "Humid",
      description: "Higher moisture"
    };
  }

  return {
    label: "Very humid",
    description: "High moisture"
  };
}

function getVisibilityInfo(visibility) {
  const value = Number(visibility) || 0;

  if (value >= 10) {
    return {
      label: "Excellent",
      description: "Very clear"
    };
  }

  if (value >= 5) {
    return {
      label: "Good",
      description: "Clear conditions"
    };
  }

  if (value >= 2) {
    return {
      label: "Moderate",
      description: "Reduced clarity"
    };
  }

  return {
    label: "Low",
    description: "Poor visibility"
  };
}

function getUVInfo(uv) {
  const value = Number(uv) || 0;

  if (value <= 2) {
    return {
      label: "Low",
      description: "Minimal risk"
    };
  }

  if (value <= 5) {
    return {
      label: "Moderate",
      description: "Some protection"
    };
  }

  if (value <= 7) {
    return {
      label: "High",
      description: "Protection needed"
    };
  }

  if (value <= 10) {
    return {
      label: "Very high",
      description: "Extra protection"
    };
  }

  return {
    label: "Extreme",
    description: "Avoid direct exposure"
  };
}

function WeatherStatCard({
  icon,
  label,
  value,
  unit,
  status,
  description
}) {
  return (
    <article className="clay-card detail-card weather-stat-card">

      <div className="detail-icon" aria-hidden="true">
        {icon}
      </div>

      <div className="detail-content">

        <span className="card-label">
          {label}
        </span>

        <div className="detail-value">
          {value}
          {unit && (
            <span className="detail-unit">
              {unit}
            </span>
          )}
        </div>

        <div className="detail-status">
          {status}
        </div>

        <small className="detail-description">
          {description}
        </small>

      </div>
    </article>
  );
}

function WeatherStats({
  humidity = 0,
  visibility = 0,
  uv = 0
}) {
  const humidityValue =
    Math.round(Number(humidity) || 0);

  const visibilityValue =
    Number(visibility) || 0;

  const uvValue =
    Number(uv) || 0;

  const humidityInfo =
    getHumidityInfo(humidityValue);

  const visibilityInfo =
    getVisibilityInfo(visibilityValue);

  const uvInfo =
    getUVInfo(uvValue);

  return (
    <div className="stats-grid">

      {/* =================================================
          HUMIDITY
      ================================================= */}

      <WeatherStatCard
        icon="💧"
        label="HUMIDITY"
        value={humidityValue}
        unit="%"
        status={humidityInfo.label}
        description={humidityInfo.description}
      />

      {/* =================================================
          VISIBILITY
      ================================================= */}

      <WeatherStatCard
        icon="👁️"
        label="VISIBILITY"
        value={
          visibilityValue > 0
            ? visibilityValue.toFixed(1)
            : "0.0"
        }
        unit="km"
        status={visibilityInfo.label}
        description={visibilityInfo.description}
      />

      {/* =================================================
          UV INDEX
      ================================================= */}

      <WeatherStatCard
        icon="☀️"
        label="UV INDEX"
        value={
          Number.isInteger(uvValue)
            ? uvValue
            : uvValue.toFixed(1)
        }
        status={uvInfo.label}
        description={uvInfo.description}
      />

    </div>
  );
}

export default WeatherStats;
