
function getMoonPhaseIcon(phase = "") {
  const text = String(phase).toLowerCase();

  if (text.includes("new moon")) {
    return "🌑";
  }

  if (
    text.includes("waxing crescent")
  ) {
    return "🌒";
  }

  if (
    text.includes("first quarter")
  ) {
    return "🌓";
  }

  if (
    text.includes("waxing gibbous")
  ) {
    return "🌔";
  }

  if (text.includes("full moon")) {
    return "🌕";
  }

  if (
    text.includes("waning gibbous")
  ) {
    return "🌖";
  }

  if (
    text.includes("last quarter") ||
    text.includes("third quarter")
  ) {
    return "🌗";
  }

  if (
    text.includes("waning crescent")
  ) {
    return "🌘";
  }

  return "🌙";
}

function getMoonPhaseDescription(phase = "") {
  const text = String(phase).toLowerCase();

  if (text.includes("new moon")) {
    return "Moon is between Earth and Sun";
  }

  if (text.includes("waxing crescent")) {
    return "Illuminated area is increasing";
  }

  if (text.includes("first quarter")) {
    return "Half of the Moon is illuminated";
  }

  if (text.includes("waxing gibbous")) {
    return "More than half is illuminated";
  }

  if (text.includes("full moon")) {
    return "The Moon is fully illuminated";
  }

  if (text.includes("waning gibbous")) {
    return "Illuminated area is decreasing";
  }

  if (
    text.includes("last quarter") ||
    text.includes("third quarter")
  ) {
    return "Half of the Moon is illuminated";
  }

  if (text.includes("waning crescent")) {
    return "Only a small part is illuminated";
  }

  return "Current lunar phase";
}

function MoonCard({
  moonrise = "--",
  moonset = "--",
  moonPhase = "Unknown"
}) {
  const phaseIcon =
    getMoonPhaseIcon(moonPhase);

  const phaseDescription =
    getMoonPhaseDescription(moonPhase);

  const hasMoonrise =
    moonrise && moonrise !== "--";

  const hasMoonset =
    moonset && moonset !== "--";

  return (
    <article className="clay-card celestial-card moon-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="celestial-header">

        <div>
          <span className="card-label">
            MOON
          </span>

          <h3>
            Moonrise & moonset
          </h3>
        </div>

        <div
          className="celestial-header-icon moon-header-icon"
          aria-hidden="true"
        >
          {phaseIcon}
        </div>

      </div>

      {/* =================================================
          MOON VISUAL
      ================================================= */}

      <div className="moon-visual">

        <div className="moon-orbit">

          <div className="moon-glow"></div>

          <div className="moon-disc">
            <span
              role="img"
              aria-label={moonPhase}
            >
              {phaseIcon}
            </span>
          </div>

          <div className="moon-stars">
            <span>✦</span>
            <span>·</span>
            <span>✧</span>
          </div>

        </div>

      </div>

      {/* =================================================
          MOON PHASE
      ================================================= */}

      <div className="moon-phase-info">

        <span className="moon-phase-label">
          CURRENT PHASE
        </span>

        <strong className="moon-phase-name">
          {moonPhase}
        </strong>

        <p>
          {phaseDescription}
        </p>

      </div>

      {/* =================================================
          MOON TIMES
      ================================================= */}

      <div className="celestial-times">

        {/* Moonrise */}
        <div className="celestial-time">

          <div className="celestial-time-icon moonrise-icon">
            🌙
          </div>

          <div className="celestial-time-info">
            <span>
              MOONRISE
            </span>

            <strong>
              {hasMoonrise
                ? moonrise
                : "--"}
            </strong>
          </div>

        </div>

        {/* Divider */}
        <div className="celestial-divider"></div>

        {/* Moonset */}
        <div className="celestial-time">

          <div className="celestial-time-icon moonset-icon">
            🌘
          </div>

          <div className="celestial-time-info">
            <span>
              MOONSET
            </span>

            <strong>
              {hasMoonset
                ? moonset
                : "--"}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="celestial-footer">
        <span>
          {phaseIcon} Lunar cycle
        </span>

        <span>
          Local time
        </span>
      </div>

    </article>
  );
}

export default MoonCard;
