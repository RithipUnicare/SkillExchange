import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import AppNavigation from './Navigation/AppNavigation';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

function AppContent() {
  const { theme, isDark } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigation />
    </PaperProvider>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
