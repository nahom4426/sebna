import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const THEME_KEY = 'sebna_theme';

const defaultTheme = (() => {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    // Respect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
})();

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

ThemeContext.displayName = 'ThemeContext';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(defaultTheme);

  const applyTheme = useCallback((next) => {
    const root = document.documentElement;
    if (next === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((next) => {
    const safe = next === 'dark' ? 'dark' : 'light';
    setThemeState(safe);
    applyTheme(safe);
    try {
      window.localStorage.setItem(THEME_KEY, safe);
    } catch {
      // ignore
    }
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const isDark = theme === 'dark';

  const value = useMemo(
    () => ({ theme, isDark, toggleTheme, setTheme }),
    [theme, isDark, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

ThemeProvider.displayName = 'ThemeProvider';

export function useTheme() {
  return useContext(ThemeContext);
}
