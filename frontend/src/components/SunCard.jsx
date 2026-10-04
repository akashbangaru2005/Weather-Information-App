
function SunCard({
  sunrise = "--",
  sunset = "--"
}) {
  const hasSunrise =
    sunrise &&
    sunrise !== "--";

  const hasSunset =
    sunset &&
    sunset !== "--";

  return (
    <article className="clay-card celestial-card sun-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="celestial-header">

        <div>
          <span className="card-label">
            SUN
          </span>

          <h3>
            Sunrise & sunset
          </h3>
        </div>

        <div
          className="celestial-header-icon"
          aria-hidden="true"
        >
          ☀️
        </div>

      </div>

      {/* =================================================
          SUN VISUAL
      ================================================= */}

      <div className="sun-visual">

        <div className="sun-orbit">

          <div className="sun-glow"></div>

          <div className="sun-disc">
            ☀
          </div>

        </div>

      </div>

      {/* =================================================
          SUN TIMES
      ================================================= */}

      <div className="celestial-times">

        {/* Sunrise */}
        <div className="celestial-time">

          <div className="celestial-time-icon sunrise-icon">
            🌅
          </div>

          <div className="celestial-time-info">
            <span>
              SUNRISE
            </span>

            <strong>
              {hasSunrise
                ? sunrise
                : "--"}
            </strong>
          </div>

        </div>

        {/* Divider */}
        <div className="celestial-divider"></div>

        {/* Sunset */}
        <div className="celestial-time">

          <div className="celestial-time-icon sunset-icon">
            🌇
          </div>

          <div className="celestial-time-info">
            <span>
              SUNSET
            </span>

            <strong>
              {hasSunset
                ? sunset
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
          ☀️ Daylight cycle
        </span>

        <span>
          Local time
        </span>
      </div>

    </article>
  );
}

export default SunCard;
