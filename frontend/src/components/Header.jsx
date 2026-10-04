function Header({ city, theme, onThemeToggle }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">🌦️</div>

        <div>
          <div className="brand-name">SkyCast</div>
          <div className="brand-subtitle">Weather Intelligence</div>
        </div>
      </div>

      <div className="header-right">
        <div className="current-location-pill">
          <span>📍</span>
          <span>{city}</span>
        </div>

        <button
          className="theme-button clay-button"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}

export default Header;