
import useScrollFloat from "../hooks/useScrollFloat";

import Loading from "../components/Loading";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import SavedLocations from "../components/SavedLocations";
import LocationCard from "../components/LocationCard";
import CurrentWeather from "../components/CurrentWeather";
import WeatherStats from "../components/WeatherStats";
import AirQuality from "../components/AirQuality";
import WindCard from "../components/WindCard";
import PressureCard from "../components/PressureCard";
import SunCard from "../components/SunCard";
import MoonCard from "../components/MoonCard";
import HourlyForecast from "../components/HourlyForecast";
import DailyForecast from "../components/DailyForecast";
import WeatherChart from "../components/WeatherChart";
import WeatherAlert from "../components/WeatherAlert";

import { useTheme } from "../context/ThemeContext";
import { useWeather } from "../context/WeatherContext";

import { formatLongDate } from "../utils/dateUtils";

function Dashboard() {
  /* =====================================================
     SCROLL FLOAT ANIMATION
  ===================================================== */

  useScrollFloat();

  /* =====================================================
     THEME
  ===================================================== */

  const {
    theme,
    toggleTheme
  } = useTheme();

  /* =====================================================
     WEATHER CONTEXT
  ===================================================== */

  const {
    weather,
    location,
    loading,
    error,
    lastUpdated,
    searchWeather,
    useMyLocation,
    refreshWeather,
    clearError
  } = useWeather();

  /* =====================================================
     DATE
  ===================================================== */

  const displayDate =
    formatLongDate(new Date());

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = async (value) => {
    const searchValue =
      String(value || "").trim();

    if (!searchValue) {
      return;
    }

    await searchWeather(
      searchValue
    );
  };

  /* =====================================================
     SAVED LOCATION SELECT
  ===================================================== */

  const handleSavedLocationSelect =
    async (locationName) => {
      const value =
        String(
          locationName || ""
        ).trim();

      if (!value) {
        return;
      }

      await searchWeather(value);

      /*
        Bring the user back to the weather
        dashboard after selecting a saved city.
      */
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    await refreshWeather();
  };

  /* =====================================================
     CURRENT LOCATION OBJECT
     Used by SavedLocations.jsx
  ===================================================== */

  const currentLocation =
    weather?.location
      ? {
          name:
            weather.location.city ||
            "",

          region:
            weather.location.region ||
            "",

          country:
            weather.location.country ||
            "",

          latitude:
            weather.location.latitude ??
            0,

          longitude:
            weather.location.longitude ??
            0
        }
      : null;

  /* =====================================================
     APP
  ===================================================== */

  return (
    <div
      className={`app-shell ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        city={
          weather?.location?.city ||
          location ||
          "Hyderabad"
        }

        theme={theme}

        onThemeToggle={
          toggleTheme
        }
      />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-container">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero-section">

          <div>
            <span className="eyebrow">
              REAL-TIME WEATHER
            </span>

            <h1>
              Weather Information
            </h1>

            <p className="hero-subtitle">
              Understand the sky. Plan your day
              with confidence.
            </p>
          </div>

          <SearchBar
            onSearch={
              handleSearch
            }
            onLocation={
              useMyLocation
            }
          />

        </section>

        {/* =================================================
            SAVED LOCATIONS
        ================================================= */}

        <SavedLocations
          currentLocation={
            currentLocation
          }

          onSelectLocation={
            handleSavedLocationSelect
          }
        />

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="clay-card"
            style={{
              padding: "18px 22px",
              marginTop: "22px",
              marginBottom: "22px",
              color: "#c54b4b"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: "15px"
              }}
            >

              <div>
                <strong>
                  Unable to update weather
                </strong>

                <p
                  style={{
                    margin: "7px 0 0"
                  }}
                >
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={clearError}
                aria-label="Dismiss error"
                title="Dismiss error"
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "20px",
                  lineHeight: 1,
                  opacity: 0.7
                }}
              >
                ×
              </button>

            </div>
          </div>
        )}

        {/* =================================================
            INITIAL LOADING
        ================================================= */}

        {loading && !weather && (
          <Loading />
        )}

        {/* =================================================
            BACKGROUND UPDATE INDICATOR
        ================================================= */}

        {loading && weather && (
          <div
            className="clay-inset"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",
              width: "fit-content",
              maxWidth: "100%",
              margin:
                "0 auto 20px",
              padding:
                "9px 14px",
              borderRadius: "14px",
              color:
                "var(--muted)",
              fontSize: "9px",
              fontWeight: 700
            }}
          >
            <span
              className="mini-spinner"
              aria-hidden="true"
            ></span>

            Updating live weather...
          </div>
        )}

        {/* =================================================
            WEATHER DASHBOARD
        ================================================= */}

        {weather && (
          <>

            {/* =============================================
                CURRENT WEATHER
            ============================================= */}

            <section className="top-grid">

              <LocationCard
                city={
                  weather?.location?.city ||
                  "Unknown"
                }

                region={
                  weather?.location?.region ||
                  ""
                }

                country={
                  weather?.location?.country ||
                  ""
                }

                latitude={
                  weather?.location?.latitude ??
                  0
                }

                longitude={
                  weather?.location?.longitude ??
                  0
                }

                date={displayDate}
              />

              <CurrentWeather
                temperature={
                  weather?.current?.temperature ??
                  0
                }

                feelsLike={
                  weather?.current?.feelsLike ??
                  0
                }

                condition={
                  weather?.current?.condition ||
                  "Unknown"
                }

                icon={
                  weather?.current?.icon ||
                  "🌤️"
                }
              />

            </section>

            {/* =============================================
                WEATHER CONDITIONS
            ============================================= */}

            <section className="section-block">

              <div className="section-heading">

                <div>
                  <span className="section-kicker">
                    ATMOSPHERE
                  </span>

                  <h2>
                    Weather conditions
                  </h2>
                </div>

                {lastUpdated && (
                  <div
                    style={{
                      color:
                        "var(--muted)",
                      fontSize:
                        "10px",
                      textAlign:
                        "right",
                      whiteSpace:
                        "nowrap"
                    }}
                  >
                    Updated{" "}
                    {new Intl.DateTimeFormat(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      }
                    ).format(
                      new Date(
                        lastUpdated
                      )
                    )}
                  </div>
                )}

              </div>

              <WeatherStats
                humidity={
                  weather?.current?.humidity ??
                  0
                }

                visibility={
                  weather?.current?.visibility ??
                  0
                }

                uv={
                  weather?.current?.uv ??
                  0
                }
              />

              <div className="info-grid">

                <WindCard
                  wind={
                    weather?.current?.wind ??
                    0
                  }

                  direction={
                    weather?.current
                      ?.windDirection ||
                    "--"
                  }
                />

                <PressureCard
                  pressure={
                    weather?.current?.pressure ??
                    0
                  }
                />

                <AirQuality
                  aqi={
                    weather?.airQuality?.aqi ??
                    0
                  }

                  pm25={
                    weather?.airQuality?.pm25 ??
                    0
                  }

                  pm10={
                    weather?.airQuality?.pm10 ??
                    0
                  }

                  co={
                    weather?.airQuality?.co ??
                    0
                  }

                  no2={
                    weather?.airQuality?.no2 ??
                    0
                  }

                  so2={
                    weather?.airQuality?.so2 ??
                    0
                  }

                  o3={
                    weather?.airQuality?.o3 ??
                    0
                  }
                />

              </div>

            </section>

            {/* =============================================
                SUN & MOON
            ============================================= */}

            <section className="section-block">

              <div className="section-heading">

                <div>
                  <span className="section-kicker">
                    DAY & NIGHT
                  </span>

                  <h2>
                    Sun and moon
                  </h2>
                </div>

              </div>

              <div className="sun-moon-grid">

                <SunCard
                  sunrise={
                    weather?.astronomy?.sunrise ||
                    "--"
                  }

                  sunset={
                    weather?.astronomy?.sunset ||
                    "--"
                  }
                />

                <MoonCard
                  moonrise={
                    weather?.astronomy?.moonrise ||
                    "--"
                  }

                  moonset={
                    weather?.astronomy?.moonset ||
                    "--"
                  }

                  moonPhase={
                    weather?.astronomy?.moonPhase ||
                    "Unknown"
                  }
                />

              </div>

            </section>

            {/* =============================================
                HOURLY FORECAST
            ============================================= */}

            <section className="section-block">

              <div className="section-heading">

                <div>
                  <span className="section-kicker">
                    NEXT HOURS
                  </span>

                  <h2>
                    Hourly forecast
                  </h2>
                </div>

              </div>

              <HourlyForecast
                data={
                  Array.isArray(
                    weather?.hourly
                  )
                    ? weather.hourly
                    : []
                }
              />

            </section>

            {/* =============================================
                DAILY FORECAST
            ============================================= */}

            <section className="section-block">

              <div className="section-heading">

                <div>
                  <span className="section-kicker">
                    UPCOMING DAYS
                  </span>

                  <h2>
                    Forecast
                  </h2>
                </div>

              </div>

              <DailyForecast
                data={
                  Array.isArray(
                    weather?.daily
                  )
                    ? weather.daily
                    : []
                }
              />

            </section>

            {/* =============================================
                CHART + ALERT
            ============================================= */}

            <section className="bottom-grid">

              <WeatherChart
                data={
                  Array.isArray(
                    weather?.chart
                  )
                    ? weather.chart
                    : []
                }
              />

              <WeatherAlert
                aqi={
                  weather?.airQuality?.aqi ??
                  0
                }

                alerts={
                  Array.isArray(
                    weather?.alerts
                  )
                    ? weather.alerts
                    : []
                }
              />

            </section>

            {/* =============================================
                REFRESH
            ============================================= */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginTop: "24px"
              }}
            >
              <button
                type="button"
                className="clay-button"
                onClick={
                  handleRefresh
                }
                disabled={loading}
                aria-label={
                  "Refresh weather"
                }
                style={{
                  minWidth: "160px",
                  opacity: loading
                    ? 0.65
                    : 1
                }}
              >
                {loading
                  ? "Updating..."
                  : "↻ Refresh weather"}
              </button>
            </div>

          </>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="app-footer">

          <span>
            Weather Information App
          </span>

          <span>
            React • Spring Boot • WeatherAPI
          </span>

        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
