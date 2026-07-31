import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'bm-theme';
export const THEMES = ['light', 'dark', 'brand'];

const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => {},
    cycleTheme: () => {},
});

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (THEMES.includes(stored)) return stored;
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);

    const setTheme = useCallback((next) => {
        if (!THEMES.includes(next)) return;
        setThemeState(next);
    }, []);

    const cycleTheme = useCallback(() => {
        setThemeState((current) => {
            const idx = THEMES.indexOf(current);
            return THEMES[(idx + 1) % THEMES.length];
        });
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme, setTheme, cycleTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
