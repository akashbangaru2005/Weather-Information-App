
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY =
  "weather-app-theme";

/* =========================================================
   GET INITIAL THEME
========================================================= */

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const savedTheme =
      window.localStorage.getItem(
        THEME_STORAGE_KEY
      );

    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      return savedTheme;
    }
  } catch {
    // Ignore localStorage errors.
  }

  /*
    Use the operating system theme when the user
    has not selected a preference yet.
  */
  if (
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
  ) {
    return "dark";
  }

  return "light";
}


/* =========================================================
   PROVIDER
========================================================= */

export function ThemeProvider({
  children
}) {
  const [theme, setThemeState] =
    useState(getInitialTheme);

  /* =======================================================
     SET THEME
  ======================================================= */

  const setTheme = useCallback(
    (nextTheme) => {
      const resolvedTheme =
        nextTheme === "dark"
          ? "dark"
          : "light";

      setThemeState(
        resolvedTheme
      );

      try {
        window.localStorage.setItem(
          THEME_STORAGE_KEY,
          resolvedTheme
        );
      } catch {
        // Ignore storage errors.
      }
    },
    []
  );

  /* =======================================================
     TOGGLE THEME
  ======================================================= */

  const toggleTheme =
    useCallback(() => {
      setTheme(
        theme === "dark"
          ? "light"
          : "dark"
      );
    }, [theme, setTheme]);

  /* =======================================================
     APPLY THEME TO DOCUMENT
  ======================================================= */

  useEffect(() => {
    const root =
      document.documentElement;

    root.dataset.theme =
      theme;

    /*
      Helpful for native browser UI,
      form controls and mobile browser chrome.
    */
    root.style.colorScheme =
      theme;

    /*
      Useful if other global CSS wants to
      target the document itself.
    */
    root.classList.toggle(
      "dark-mode",
      theme === "dark"
    );

    return () => {
      root.classList.remove(
        "dark-mode"
      );
    };
  }, [theme]);

  /* =======================================================
     LISTEN FOR SYSTEM THEME CHANGES
  ======================================================= */

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia
    ) {
      return undefined;
    }

    let savedTheme = null;

    try {
      savedTheme =
        window.localStorage.getItem(
          THEME_STORAGE_KEY
        );
    } catch {
      // Ignore storage errors.
    }

    /*
      Once the user explicitly chooses a theme,
      do not override it when the OS theme changes.
    */
    if (
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      return undefined;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleSystemThemeChange =
      (event) => {
        setThemeState(
          event.matches
            ? "dark"
            : "light"
        );
      };

    if (
      typeof mediaQuery.addEventListener ===
      "function"
    ) {
      mediaQuery.addEventListener(
        "change",
        handleSystemThemeChange
      );

      return () => {
        mediaQuery.removeEventListener(
          "change",
          handleSystemThemeChange
        );
      };
    }

    /*
      Older browser fallback.
    */
    mediaQuery.addListener(
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeListener(
        handleSystemThemeChange
      );
    };
  }, []);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === "dark",
      isLight: theme === "light"
    }),
    [
      theme,
      setTheme,
      toggleTheme
    ]
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}


/* =========================================================
   CUSTOM HOOK
========================================================= */

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside a ThemeProvider."
    );
  }

  return context;
}

export default ThemeContext;
