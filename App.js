import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeDatabase } from './src/services/database';
import ErrorBoundary from './src/utils/ErrorBoundary';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/appStore';
import './src/i18n';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]} testID="app-container">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (initError) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]} testID="app-container">
        <Text style={[styles.errorText, isDarkMode && styles.darkText]}>فشل تهيئة التطبيق: {initError}</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style={isDarkMode ? 'light' : 'auto'} />
      <View style={[styles.container, isDarkMode && styles.darkContainer]} testID="app-container">
        <AppNavigator />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  darkContainer: { backgroundColor: '#1a1a1a' },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', padding: 24 },
  darkText: { color: '#FCA5A5' },
});
