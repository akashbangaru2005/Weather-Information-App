
function Loading({
  message = "Loading live weather information...",
  compact = false
}) {
  return (
    <div
      className={`loading-wrapper ${
        compact ? "loading-wrapper-compact" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className={`loading-card ${
          compact ? "loading-card-compact" : ""
        }`}
      >

        {/* =================================================
            WEATHER LOADING VISUAL
        ================================================= */}

        <div className="weather-loader">

          <div className="loader-cloud">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="loader-sun"></div>

          <div className="loader-rays">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

        {/* =================================================
            SPINNER
        ================================================= */}

        <div
          className="loading-spinner"
          aria-hidden="true"
        ></div>

        {/* =================================================
            MESSAGE
        ================================================= */}

        <p className="loading-message">
          {message}
        </p>

        {!compact && (
          <small className="loading-subtext">
            Getting the latest weather conditions...
          </small>
        )}

      </div>
    </div>
  );
}

export default Loading;
