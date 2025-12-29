import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#6200EE',
        secondary: '#03DAC6',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        error: '#B00020',
        text: '#000000',
        onSurface: '#000000',
        disabled: '#C4C4C4',
        placeholder: '#757575',
        backdrop: 'rgba(0, 0, 0, 0.5)',
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#BB86FC',
        secondary: '#03DAC6',
        background: '#121212',
        surface: '#1E1E1E',
        error: '#CF6679',
        text: '#FFFFFF',
        onSurface: '#FFFFFF',
        disabled: '#6C6C6C',
        placeholder: '#A0A0A0',
        backdrop: 'rgba(0, 0, 0, 0.7)',
    },
};
