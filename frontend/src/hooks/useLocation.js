
import { useCallback, useEffect, useState } from "react";

function useLocation() {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSupported =
    typeof navigator !== "undefined" &&
    "geolocation" in navigator;

  const getLocation = useCallback(() => {
    if (!isSupported) {
      setError(
        "Geolocation is not supported by your browser."
      );

      return Promise.resolve(null);
    }

    setLoading(true);
    setError("");

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          setCoordinates(result);
          setLoading(false);

          resolve(result);
        },

        (geoError) => {
          let message =
            "Unable to determine your current location.";

          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              message =
                "Location permission was denied. Please allow location access in your browser.";
              break;

            case geoError.POSITION_UNAVAILABLE:
              message =
                "Your current location is unavailable.";
              break;

            case geoError.TIMEOUT:
              message =
                "The location request timed out. Please try again.";
              break;

            default:
              message =
                "Unable to determine your current location.";
          }

          setError(message);
          setLoading(false);

          resolve(null);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }, [isSupported]);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  /*
    Check whether the browser exposes a permissions API.
    This does not request location permission by itself.
  */
  useEffect(() => {
    let permissionStatus;
    let cancelled = false;

    const checkPermission = async () => {
      if (
        !navigator.permissions ||
        !isSupported
      ) {
        return;
      }

      try {
        permissionStatus =
          await navigator.permissions.query({
            name: "geolocation"
          });

        if (cancelled) {
          return;
        }

        const handlePermissionChange = () => {
          /*
            Clear stale errors when permission changes.
          */
          if (
            permissionStatus.state === "granted"
          ) {
            setError("");
          }
        };

        permissionStatus.addEventListener(
          "change",
          handlePermissionChange
        );

        return () => {
          permissionStatus.removeEventListener(
            "change",
            handlePermissionChange
          );
        };
      } catch {
        /*
          Some browsers do not fully support
          permissions.query for geolocation.
        */
      }
    };

    checkPermission();

    return () => {
      cancelled = true;

      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [isSupported]);

  return {
    coordinates,
    loading,
    error,
    isSupported,
    getLocation,
    clearError
  };
}

export default useLocation;
