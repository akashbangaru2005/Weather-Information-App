
import { useCallback, useEffect, useState } from "react";

import {
  getSavedLocations,
  saveLocation,
  deleteSavedLocation
} from "../services/locationService";

function SavedLocations({
  currentLocation = null,
  onSelectLocation
}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState(null);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD SAVED LOCATIONS
  ===================================================== */

  const loadLocations = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const saved =
          await getSavedLocations();

        setLocations(
          Array.isArray(saved)
            ? saved
            : []
        );
      } catch (err) {
        console.error(
          "Saved locations loading error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load saved locations."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  /* =====================================================
     SAVE CURRENT LOCATION
  ===================================================== */

  const handleSave = async () => {
    if (!currentLocation) {
      setError(
        "No current location is available to save."
      );
      return;
    }

    const name =
      String(
        currentLocation.name || ""
      ).trim();

    if (!name) {
      setError(
        "A valid location name is required."
      );
      return;
    }

    const alreadySaved =
      locations.some(
        (location) =>
          Number(location.latitude) ===
            Number(currentLocation.latitude) &&
          Number(location.longitude) ===
            Number(currentLocation.longitude)
      );

    if (alreadySaved) {
      setError(
        `${name} is already saved.`
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const saved =
        await saveLocation(
          currentLocation
        );

      if (saved) {
        setLocations(
          (previous) => [
            ...previous,
            saved
          ]
        );
      } else {
        await loadLocations();
      }
    } catch (err) {
      console.error(
        "Save location error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save this location."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE LOCATION
  ===================================================== */

  const handleDelete = async (
    event,
    id
  ) => {
    event.stopPropagation();

    if (
      id === null ||
      id === undefined
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteSavedLocation(id);

      setLocations(
        (previous) =>
          previous.filter(
            (location) =>
              location.id !== id
          )
      );
    } catch (err) {
      console.error(
        "Delete location error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete the saved location."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     SELECT LOCATION
  ===================================================== */

  const handleSelect = (
    location
  ) => {
    if (!location) {
      return;
    }

    onSelectLocation?.(
      location.name
    );
  };

  /* =====================================================
     CURRENT LOCATION MATCH
  ===================================================== */

  const isCurrentLocation = (
    savedLocation
  ) => {
    if (
      !currentLocation ||
      !savedLocation
    ) {
      return false;
    }

    const currentLat =
      Number(
        currentLocation.latitude
      );

    const currentLon =
      Number(
        currentLocation.longitude
      );

    const savedLat =
      Number(
        savedLocation.latitude
      );

    const savedLon =
      Number(
        savedLocation.longitude
      );

    if (
      !Number.isFinite(currentLat) ||
      !Number.isFinite(currentLon) ||
      !Number.isFinite(savedLat) ||
      !Number.isFinite(savedLon)
    ) {
      return false;
    }

    return (
      Math.abs(
        currentLat - savedLat
      ) < 0.0001 &&
      Math.abs(
        currentLon - savedLon
      ) < 0.0001
    );
  };

  const canSaveCurrent =
    Boolean(currentLocation?.name);

  return (
    <section className="saved-locations-section">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="saved-locations-header">

        <div>
          <span className="section-kicker">
            FAVORITES
          </span>

          <h2>
            Saved locations
          </h2>

          <p>
            Quickly switch between your
            favorite places.
          </p>
        </div>

        <button
          type="button"
          className="clay-button saved-location-add"
          onClick={handleSave}
          disabled={
            saving ||
            !canSaveCurrent
          }
          title={
            canSaveCurrent
              ? "Save current location"
              : "Current location is unavailable"
          }
        >
          {saving
            ? "Saving..."
            : "＋ Save current"}
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="saved-locations-error">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            aria-label="Dismiss saved location error"
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="clay-card saved-locations-loading">
          <span className="mini-spinner"></span>
          <span>
            Loading saved locations...
          </span>
        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        locations.length === 0 && (
          <div className="clay-card saved-locations-empty">

            <div className="saved-empty-icon">
              ⭐
            </div>

            <strong>
              No saved locations yet
            </strong>

            <p>
              Search for a city and save it
              for quick access later.
            </p>

          </div>
        )}

      {/* =================================================
          LOCATION LIST
      ================================================= */}

      {!loading &&
        locations.length > 0 && (
          <div
            className="saved-locations-list"
            role="list"
          >
            {locations.map(
              (location) => (
                <button
                  type="button"
                  className={`clay-card saved-location-item ${
                    isCurrentLocation(
                      location
                    )
                      ? "saved-location-active"
                      : ""
                  }`}
                  key={location.id}
                  onClick={() =>
                    handleSelect(
                      location
                    )
                  }
                  role="listitem"
                >

                  <span
                    className="saved-location-icon"
                    aria-hidden="true"
                  >
                    📍
                  </span>

                  <span className="saved-location-info">

                    <strong>
                      {location.name ||
                        "Unknown"}
                    </strong>

                    <small>
                      {location.region
                        ? `${location.region}, `
                        : ""}
                      {location.country ||
                        ""}
                    </small>

                    {isCurrentLocation(
                      location
                    ) && (
                      <span className="saved-current-label">
                        CURRENT
                      </span>
                    )}

                  </span>

                  <span
                    className="saved-location-delete"
                    role="button"
                    tabIndex={0}
                    onClick={(
                      event
                    ) =>
                      handleDelete(
                        event,
                        location.id
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        event.preventDefault();

                        handleDelete(
                          event,
                          location.id
                        );
                      }
                    }}
                    aria-label={`Delete ${location.name || "saved location"}`}
                    title="Delete saved location"
                  >
                    {deletingId ===
                    location.id ? (
                      <span className="mini-spinner"></span>
                    ) : (
                      "×"
                    )}
                  </span>

                </button>
              )
            )}
          </div>
        )}

    </section>
  );
}

export default SavedLocations;
