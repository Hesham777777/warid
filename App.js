import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeDatabase } from './src/services/database';
import ErrorBoundary from './src/utils/ErrorBoundary';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  
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
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>فشل تهيئة التطبيق: {initError}</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style="auto" />
      <AppNavigator />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', padding: 24 },
});
