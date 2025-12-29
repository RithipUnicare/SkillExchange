import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3Theme } from 'react-native-paper';
import { lightTheme, darkTheme } from '../theme/theme';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    theme: MD3Theme;
    themeMode: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
                setThemeModeState(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            setThemeModeState(mode);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = themeMode === 'dark' ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    const isDark = themeMode === 'auto'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, themeMode, isDark, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useAppTheme must be used within a ThemeProvider');
    }
    return context;
};
