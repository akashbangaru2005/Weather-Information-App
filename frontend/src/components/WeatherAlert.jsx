
function getAQIInfo(aqi) {
  const value = Number(aqi) || 0;

  /*
    WeatherAPI air quality uses the US EPA index:
    1 = Good
    2 = Moderate
    3 = Unhealthy for sensitive groups
    4 = Unhealthy
    5 = Very unhealthy
    6 = Hazardous
  */

  if (value <= 1) {
    return {
      title: "Air quality is good",
      message:
        "Air quality is satisfactory and poses little or no risk for most people.",
      icon: "✅",
      className: "alert-good"
    };
  }

  if (value <= 2) {
    return {
      title: "Air quality is moderate",
      message:
        "Air quality is acceptable for most people, although sensitive individuals may want to limit prolonged exposure.",
      icon: "🟡",
      className: "alert-moderate"
    };
  }

  if (value <= 3) {
    return {
      title: "Air quality needs attention",
      message:
        "Sensitive individuals should consider reducing prolonged or heavy outdoor activity.",
      icon: "⚠️",
      className: "alert-sensitive"
    };
  }

  if (value <= 4) {
    return {
      title: "Unhealthy air quality",
      message:
        "Consider reducing prolonged or heavy outdoor activity, especially if you are sensitive to air pollution.",
      icon: "⚠️",
      className: "alert-unhealthy"
    };
  }

  if (value <= 5) {
    return {
      title: "Very unhealthy air quality",
      message:
        "Reduce outdoor exposure where possible and take additional precautions.",
      icon: "🚨",
      className: "alert-very-unhealthy"
    };
  }

  return {
    title: "Hazardous air quality",
    message:
      "Avoid prolonged outdoor exposure and follow local health guidance.",
    icon: "🚨",
    className: "alert-hazardous"
  };
}

function getSeverityClass(severity) {
  const value = String(severity || "")
    .toLowerCase();

  if (
    value.includes("extreme") ||
    value.includes("severe")
  ) {
    return "severity-critical";
  }

  if (
    value.includes("moderate") ||
    value.includes("medium")
  ) {
    return "severity-moderate";
  }

  if (
    value.includes("minor") ||
    value.includes("low")
  ) {
    return "severity-low";
  }

  return "severity-default";
}

function getAlertIcon(severity) {
  const value = String(severity || "")
    .toLowerCase();

  if (
    value.includes("extreme") ||
    value.includes("severe")
  ) {
    return "🚨";
  }

  if (
    value.includes("moderate") ||
    value.includes("medium")
  ) {
    return "⚠️";
  }

  return "📢";
}

function WeatherAlert({
  aqi = 0,
  alerts = []
}) {
  const validAlerts = Array.isArray(alerts)
    ? alerts.filter(
        (alert) =>
          alert &&
          (
            alert.headline ||
            alert.description ||
            alert.title
          )
      )
    : [];

  /* =====================================================
     REAL WEATHER ALERT
  ===================================================== */

  if (validAlerts.length > 0) {
    const alert = validAlerts[0];

    const headline =
      alert.headline ||
      alert.title ||
      "Weather advisory";

    const description =
      alert.description ||
      alert.instruction ||
      "An active weather alert has been issued for this location.";

    const severity =
      alert.severity ||
      alert.level ||
      "Advisory";

    const severityClass =
      getSeverityClass(severity);

    const icon =
      getAlertIcon(severity);

    return (
      <article
        className={`clay-card alert-card real-alert-card ${severityClass}`}
      >

        {/* ===============================================
            ICON
        =============================================== */}

        <div className="alert-icon">
          {icon}
        </div>

        {/* ===============================================
            CONTENT
        =============================================== */}

        <div className="alert-content">

          <div className="alert-top-line">

            <span className="card-label">
              WEATHER ALERT
            </span>

            <span
              className={`alert-severity ${severityClass}`}
            >
              {severity}
            </span>

          </div>

          <h3>
            {headline}
          </h3>

          <p>
            {description}
          </p>

          {/* =========================================
              OPTIONAL ALERT DETAILS
          ========================================= */}

          {(alert.effective ||
            alert.expires) && (
            <div className="alert-meta">

              {alert.effective && (
                <span>
                  <strong>
                    Starts:
                  </strong>{" "}
                  {alert.effective}
                </span>
              )}

              {alert.expires && (
                <span>
                  <strong>
                    Ends:
                  </strong>{" "}
                  {alert.expires}
                </span>
              )}

            </div>
          )}

          {/* =========================================
              ADDITIONAL ALERT COUNT
          ========================================= */}

          {validAlerts.length > 1 && (
            <div className="alert-count">
              +
              {validAlerts.length - 1}{" "}
              more active alert
              {validAlerts.length - 1 > 1
                ? "s"
                : ""}
            </div>
          )}

        </div>

      </article>
    );
  }

  /* =====================================================
     AIR QUALITY NOTE WHEN NO WEATHER ALERT EXISTS
  ===================================================== */

  const aqiInfo =
    getAQIInfo(aqi);

  return (
    <article
      className={`clay-card alert-card ${aqiInfo.className}`}
    >

      {/* ===============================================
          ICON
      =============================================== */}

      <div className="alert-icon">
        {aqiInfo.icon}
      </div>

      {/* ===============================================
          CONTENT
      =============================================== */}

      <div className="alert-content">

        <div className="alert-top-line">
          <span className="card-label">
            WEATHER NOTE
          </span>

          <span className="alert-mini-label">
            AIR QUALITY
          </span>
        </div>

        <h3>
          {aqiInfo.title}
        </h3>

        <p>
          {aqiInfo.message}
        </p>

        <div className="alert-aqi-value">
          <span>
            US EPA INDEX
          </span>

          <strong>
            {Number(aqi) || 0}
          </strong>
        </div>

      </div>

    </article>
  );
}

export default WeatherAlert;
