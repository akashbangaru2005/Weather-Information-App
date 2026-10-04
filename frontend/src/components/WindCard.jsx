
function getWindInfo(speed) {
  const value = Number(speed) || 0;

  if (value < 5) {
    return {
      level: "Calm",
      description: "Very light wind",
      percentage: 8
    };
  }

  if (value < 12) {
    return {
      level: "Light",
      description: "Gentle breeze",
      percentage: 25
    };
  }

  if (value < 20) {
    return {
      level: "Moderate",
      description: "Steady breeze",
      percentage: 45
    };
  }

  if (value < 30) {
    return {
      level: "Fresh",
      description: "Noticeable wind",
      percentage: 65
    };
  }

  if (value < 40) {
    return {
      level: "Strong",
      description: "Strong winds",
      percentage: 82
    };
  }

  return {
    level: "Very strong",
    description: "High wind speed",
    percentage: 100
  };
}

function getDirectionDegrees(direction) {
  const text = String(direction || "")
    .trim()
    .toUpperCase();

  const directionMap = {
    N: 0,
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    ESE: 112.5,
    SE: 135,
    SSE: 157.5,
    S: 180,
    SSW: 202.5,
    SW: 225,
    WSW: 247.5,
    W: 270,
    WNW: 292.5,
    NW: 315,
    NNW: 337.5
  };

  return directionMap[text] ?? 0;
}

function WindCard({
  wind = 0,
  direction = "--"
}) {
  const speed = Number(wind) || 0;

  const windInfo = getWindInfo(speed);

  const degrees = getDirectionDegrees(direction);

  return (
    <article className="clay-card detail-card wind-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="detail-header">

        <div>
          <span className="card-label">
            WIND
          </span>

          <h3>
            Wind conditions
          </h3>
        </div>

        <div
          className="detail-header-icon"
          aria-hidden="true"
        >
          💨
        </div>

      </div>

      {/* =================================================
          MAIN WIND AREA
      ================================================= */}

      <div className="wind-main">

        {/* Compass */}
        <div className="compass-wrap">

          <div className="compass-ring">

            <span className="compass-label compass-n">
              N
            </span>

            <span className="compass-label compass-e">
              E
            </span>

            <span className="compass-label compass-s">
              S
            </span>

            <span className="compass-label compass-w">
              W
            </span>

            <div
              className="compass-pointer"
              style={{
                transform: `rotate(${degrees}deg)`
              }}
              aria-hidden="true"
            >
              <span className="pointer-tip"></span>
            </div>

            <div className="compass-center">
              <span></span>
            </div>

          </div>

        </div>

        {/* Speed */}
        <div className="wind-speed-wrap">

          <span className="detail-value-label">
            SPEED
          </span>

          <div className="wind-speed">
            {speed.toFixed(1)}
            <span>km/h</span>
          </div>

          <div className="wind-direction">
            {direction || "--"}
          </div>

          <div className="wind-status">
            {windInfo.level}
          </div>

        </div>

      </div>

      {/* =================================================
          WIND METER
      ================================================= */}

      <div className="wind-meter">

        <div className="wind-meter-top">
          <span>
            WIND INTENSITY
          </span>

          <strong>
            {windInfo.description}
          </strong>
        </div>

        <div className="wind-meter-track">
          <div
            className="wind-meter-fill"
            style={{
              width: `${windInfo.percentage}%`
            }}
          ></div>
        </div>

        <div className="wind-scale">
          <span>0</span>
          <span>10</span>
          <span>20</span>
          <span>30</span>
          <span>40+</span>
        </div>

      </div>

    </article>
  );
}

export default WindCard;