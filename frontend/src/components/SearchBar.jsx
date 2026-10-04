
import { useEffect, useRef, useState } from "react";
import { searchLocations } from "../services/locationService";

function SearchBar({
  onSearch,
  onLocation
}) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  /* =======================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(
          event.target
        )
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =======================================================
     CLEANUP SEARCH TIMER
  ======================================================= */

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /* =======================================================
     LIVE LOCATION SEARCH
  ======================================================= */

  useEffect(() => {
    const query = value.trim();

    if (!query) {
      setResults([]);
      setShowResults(false);
      setSearching(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(
      async () => {
        try {
          setSearching(true);

          const locations =
            await searchLocations(query);

          const safeResults =
            Array.isArray(locations)
              ? locations.slice(0, 6)
              : [];

          setResults(safeResults);
          setShowResults(true);
        } catch (error) {
          console.error(
            "Location search error:",
            error
          );

          setResults([]);
          setShowResults(true);
        } finally {
          setSearching(false);
        }
      },
      350
    );

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(
          searchTimeoutRef.current
        );
      }
    };
  }, [value]);

  /* =======================================================
     SUBMIT SEARCH
  ======================================================= */

  const submitSearch = (locationName) => {
    const query = String(
      locationName || ""
    ).trim();

    if (!query) {
      return;
    }

    setShowResults(false);
    setResults([]);
    setValue("");

    onSearch?.(query);
  };

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    submitSearch(value);
  };

  /* =======================================================
     SELECT LOCATION FROM DROPDOWN
  ======================================================= */

  const handleSelectLocation = (location) => {
    if (!location) {
      return;
    }

    const locationName =
      location.name ||
      location.region ||
      `${location.latitude},${location.longitude}`;

    submitSearch(locationName);
  };

  /* =======================================================
     INPUT FOCUS
  ======================================================= */

  const handleFocus = () => {
    if (
      value.trim() &&
      (results.length > 0 || searching)
    ) {
      setShowResults(true);
    }
  };

  /* =======================================================
     CLEAR SEARCH
  ======================================================= */

  const handleClear = () => {
    setValue("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="search-area">

      {/* ===================================================
          SEARCH WRAPPER
      =================================================== */}

      <div
        className="search-wrapper"
        ref={searchContainerRef}
      >
        <form
          className="search-box clay-inset"
          onSubmit={handleSubmit}
        >
          {/* Search icon */}
          <span
            className="search-icon"
            aria-hidden="true"
          >
            ⌕
          </span>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
            onFocus={handleFocus}
            placeholder="Search city, region or country..."
            aria-label="Search location"
            aria-autocomplete="list"
            aria-expanded={showResults}
            autoComplete="off"
          />

          {/* Loading indicator */}
          {searching && (
            <span
              className="search-loading"
              aria-label="Searching"
            >
              <span className="mini-spinner"></span>
            </span>
          )}

          {/* Clear button */}
          {!searching && value.trim() && (
            <button
              type="button"
              className="search-clear"
              onClick={handleClear}
              aria-label="Clear search"
              title="Clear search"
            >
              ×
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="search-submit"
            disabled={!value.trim()}
          >
            Search
          </button>
        </form>

        {/* =================================================
            SEARCH RESULTS
        ================================================= */}

        {showResults &&
          searching === false &&
          results.length > 0 && (
            <div
              className="search-results clay-card"
              role="listbox"
              aria-label="Location results"
            >
              <div className="results-title">
                LOCATION RESULTS
              </div>

              {results.map(
                (location, index) => (
                  <button
                    type="button"
                    className="search-result-item"
                    key={
                      location.id ||
                      `${location.name || "location"}-${location.latitude || 0}-${location.longitude || 0}-${index}`
                    }
                    onClick={() =>
                      handleSelectLocation(
                        location
                      )
                    }
                    role="option"
                  >
                    <span
                      className="result-icon"
                      aria-hidden="true"
                    >
                      📍
                    </span>

                    <span className="result-info">
                      <strong>
                        {location.name ||
                          "Unknown location"}
                      </strong>

                      <small>
                        {location.region
                          ? `${location.region}, `
                          : ""}
                        {location.country ||
                          ""}
                      </small>
                    </span>
                  </button>
                )
              )}
            </div>
          )}

        {/* =================================================
            NO RESULTS
        ================================================= */}

        {showResults &&
          !searching &&
          value.trim() &&
          results.length === 0 && (
            <div className="search-results clay-card">
              <div className="no-results">
                No matching locations found.
              </div>
            </div>
          )}
      </div>

      {/* ===================================================
          CURRENT LOCATION
      =================================================== */}

      <button
        type="button"
        className="location-button clay-button"
        onClick={onLocation}
      >
        <span aria-hidden="true">
          📍
        </span>

        <span>
          Use my location
        </span>
      </button>

    </div>
  );
}

export default SearchBar;
